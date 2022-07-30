<template>
  <button class="base-button-icon" @click="btnAction()">
    <div class="button-icon" :class="icon"></div>

    <!-- -->
    <div class="excel-tool">
      <label for="uploadExcel" class="excel-tool-item"
        >Nhập khẩu
        <input
          type="file"
          id="uploadExcel"
          style="display: none"
          @change="importExcel"
        />
      </label>
      <div class="excel-tool-item" @click="exportExcel">Xuất khẩu</div>
    </div>
  </button>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";

import { bus } from "../../main";
import Resources from "../common/resource.js";

export default {
  components: {},

  props: {
    icon: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      listRecordsExcel: [], // Danh sách dữ liệu các bản ghi từ file excel
      listRecordsExcelValid: [], //Danh sách các bản ghi hợp lệ để gửi lên server
    };
  },

  created() {
    if (this.icon == "icon-excel") {
      //Khai báo sự kiện thêm một loạt các bản ghi từ file excel
      bus.$on("solveAddRecordsFromExcel", this.solveAddRecordsFromExcel);
    }
  },

  methods: {
    /**
     * Click vào nút
     * Created by: VDDong (21/06/2022)
     */
    btnAction() {
      this.$emit("click");
    },

    /**
     * Xuất dữ liệu ra file excel
     * Created by: VDDong (21/06/2022)
     */
    exportExcel() {
      window.open(Resources.API.GetExportExcel);
    },

    /**
     * Đọc file excel import vào
     * Created by: VDDong (05/07/2022)
     */
    importExcel(event) {
      var me = this;
      const files = event.target.files ? event.target.files[0] : null;
      if (files) {
        //Lấy đuôi file để xác định kiểu file
        var typeFile = files.name.split(".")[files.name.split(".").length - 1];
        if (typeFile != "xlsx" && typeFile != "xls") {
          return me.$emit("showPopupNotice", [
            Resources.Notice.WrongFormatFileExcel,
          ]);
        }

        const reader = new FileReader();

        //FileReader.onload: tùy biến hàm xử lý khi quá trình đọc file hoàn thành và đảm bảo không có lỗi gì xảy ra.
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          //Copy các bản ghi từ file excel vào mảng listRecordsExcel
          me.listRecordsExcel = [];
          for (let i = 0; i < data.length - 3; i++)
            me.listRecordsExcel[i] = data[i + 3];

          if (data.length - 3 < 0) {
            me.$emit("showPopupNotice", [
              Resources.Notice.EmptyFileExcel,
            ]);
          } else {
            me.$emit(
              "showPopupConfirmAddRecordsFromExcel",
              data.length - 3,
              files.name
            );
          }
        };
        // Đọc dữ liệu của file dưới dạng chuỗi nhị phân (binary string). Mỗi byte được biểu diễn bởi một số nguyên trong khoảng từ 0 đến 255.
        // Truyền `files` vào đối tượng `reader` và chỉ thị đọc ra dữ liệu dưới dạng `binary string`
        // Sau khi load thành công sẽ thực hiện đoạn code trong `onload` function phía trên
        reader.readAsBinaryString(files);

        //setup lại input file thành bình thường
        var input = document.getElementById("uploadExcel");
        input.value = "";
      }
    },

    /**
     * Hàm xử lý thêm một loạt các bản ghi từ file excel:
     * 1. Tiền xử lý dữ liệu (set value, validate)
     * 2. Gửi dữ liệu lên server
     * 3. Thông báo kết quả (thành công, lỗi)
     * Created by: VDDong (05/07/2022)
     */
    async solveAddRecordsFromExcel() {
      var me = this;
      var countSuccess = 0;
      var noticeMsgList = [];
      me.listRecordsExcelValid = [];
      me.$emit("showLoading", true); //emit sự kiện showLoading để bắt đầu show loading
      for (let i = 0; i < me.listRecordsExcel.length; i++) {
        var newRecord = {};
        /* Tiền xử lý dữ liệu */
        ///Validate required fields
        newRecord.isValid = true; //Gia su ban dau la du lieu hop le
        newRecord.assetCode = me.listRecordsExcel[i][1] || ""; //Mã tài sản
        if (newRecord.assetCode == "") {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Mã tài sản ${Resources.Notice.FieldRequired}`
          );
        }
        newRecord.assetName = me.listRecordsExcel[i][2] || ""; //Tên tài sản
        if (newRecord.assetName == "") {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Tên tài sản ${Resources.Notice.FieldRequired}`
          );
        }
        newRecord.assetCategoryName = me.listRecordsExcel[i][3] || ""; //Tên loại tài sản
        if (newRecord.assetCategoryName != "") {
          //Lấy id và mã loại tài sản theo tên loại
          await axios
            .get(
              Resources.API.GetAssetCategoryByName + me.listRecordsExcel[i][3]
            )
            .then((response) => {
              newRecord.assetCategoryId = response.data.assetCategoryId || ""; //Id loại tài sản
              newRecord.assetCategoryCode =
                response.data.assetCategoryCode || ""; //Mã loại tài sản
            })
            .catch((error) => {
              console.log(error);
              newRecord.isValid = false;
              noticeMsgList.push(
                newRecord.assetCode + `: Loại tài sản ${Resources.Notice.FieldInvalid}`
              );
            });
        } else {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Tên loại tài sản ${Resources.Notice.FieldRequired}`
          );
        }
        newRecord.departmentName = me.listRecordsExcel[i][4] || ""; //Tên bộ phận sử dụng
        if (newRecord.departmentName != "") {
          //Lấy id và mã bộ phận sử dụng theo tên bộ phận
          await axios
            .get(Resources.API.GetDepartmentByName + me.listRecordsExcel[i][4])
            .then((response) => {
              newRecord.departmentId = response.data.departmentId || ""; //Id bộ phận sử dụng
              newRecord.departmentCode = response.data.departmentCode || ""; //Mã bộ phận sử dụng
            })
            .catch((error) => {
              console.log(error);
              newRecord.isValid = false;
              noticeMsgList.push(
                newRecord.assetCode + `: Bộ phận sử dụng ${Resources.Notice.FieldInvalid}`
              );
            });
        } else {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Tên bộ phận sử dụng ${Resources.Notice.FieldRequired}`
          );
        }
        newRecord.quantity = me.listRecordsExcel[i][5]; //Số lượng
        if (
          newRecord.quantity == undefined ||
          parseInt(newRecord.quantity) < 0
        ) {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Số lượng ${Resources.Notice.FieldInvalid}`
          );
        }
        newRecord.cost = me.listRecordsExcel[i][6]; //Nguyên giá
        if (newRecord.cost == undefined || parseFloat(newRecord.cost) < 0) {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Nguyên giá ${Resources.Notice.FieldInvalid}`
          );
        }
        newRecord.lifeTime = me.listRecordsExcel[i][7]; //Số năm sử dụng
        if (
          newRecord.lifeTime == undefined ||
          parseInt(newRecord.lifeTime) < 0
        ) {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Số năm sử dụng ${Resources.Notice.FieldInvalid}`
          );
        }
        newRecord.depreciationRate = me.listRecordsExcel[i][8]; //Tỷ lệ khấu hao
        if (
          newRecord.depreciationRate == undefined ||
          parseFloat(newRecord.depreciationRate) < 0
        ) {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Tỷ lệ khấu hao ${Resources.Notice.FieldInvalid}`
          );
        }
        newRecord.purchaseDate =
          me.convertDDMMYYYYToDate(me.listRecordsExcel[i][9]) || ""; //Ngày mua
        if (newRecord.purchaseDate == "") {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Ngày mua ${Resources.Notice.FieldInvalid}`
          );
        }
        newRecord.useDate =
          me.convertDDMMYYYYToDate(me.listRecordsExcel[i][10]) || ""; //Ngày bắt đầu sử dụng
        if (newRecord.useDate == "") {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Ngày bắt đầu sử dụng ${Resources.Notice.FieldInvalid}`
          );
        }
        newRecord.trackedYear = 2022; //Năm theo dõi

        if (newRecord.assetCategoryId == "") {
          newRecord.isValid = false;
          noticeMsgList.push(`STT ${me.listRecordsExcel[i][0]}: Loại tài sản ${Resources.Notice.FieldInvalid}`);
        }
        if (newRecord.departmentId == "") {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Bộ phân sử dụng ${Resources.Notice.FieldInvalid}`
          );
        }

        ///Validate business logic
        //1. Tỉ lệ hao mòn phải bằng 1 / số năm sử dụng
        if ((1.0 / newRecord.lifeTime).toFixed(4) != (newRecord.depreciationRate * 1.0).toFixed(4) && newRecord.lifeTime != 0) {
          newRecord.isValid = false;
          noticeMsgList.push(
            `STT ${me.listRecordsExcel[i][0]}: Tỉ lệ hao mòn phải bằng 1/số năm sử dụng!`
          );
        }

        ///Lọc ra danh sách các bản ghi hợp lệ
        if (newRecord.isValid) {
          me.listRecordsExcelValid.push(newRecord);
        }
      }


      //Lọc ra các bản ghi trong listRecordsExcelValid có assetCategoryId và departmentId khác ""
      me.listRecordsExcelValid = me.listRecordsExcelValid.filter((record) => {
        if (record.assetCategoryId != "" && record.departmentId != "") {
          return true;
        }
        // if (record.assetCategoryId == "") {
        //   noticeMsgList.push(`${record.assetCode}: Loại tài sản ${Resources.Notice.FieldInvalid}`);
        // }
        // if (record.departmentId == "") {
        //   noticeMsgList.push(
        //     `${record.assetCode}: Bộ phân sử dụng ${Resources.Notice.FieldInvalid}`
        //   );
        // }
        return false;
      });
      /* Call api thêm các bản ghi hợp lệ vào database */
      if (me.listRecordsExcelValid.length > 0) {
        await axios
          .post(Resources.API.AssetMultiplePost, me.listRecordsExcelValid)
          .then((response) => {
            countSuccess = response.data.recordsInserted;
            noticeMsgList = noticeMsgList.concat(response.data.errorMsgs);
            me.$emit("loadData");
            bus.$emit("hightLightRow", response.data.successRecordsCode, 30000);
          })
          .catch((error) => {
            console.log(error, "error");
          });
      }

      //thêm thông báo số bản ghi lỗi lên đầu noticeMsgList
      if (noticeMsgList.length > 0) {
        noticeMsgList.unshift(
          "Thêm thất bại " +
            (me.listRecordsExcel.length - countSuccess) +
            " bản ghi. Vui lòng kiểm tra lại:"
        );
      }
      //thêm thông báo số bản ghi thêm thành công lên đầu noticeMsgList
      noticeMsgList.unshift(
        "Thêm thành công " + countSuccess + " bản ghi mới!"
      );

      //thông báo lỗi
      me.$emit("showPopupNotice", noticeMsgList);
    },

    /**
     * Hàm chuyển chuỗi sang ngày theo định dạng dd/mm/yyyy
     * Nếu không đúng định dạng thì trả về ""
     * Created by: VDDong (05/07/2022)
     */
    convertDDMMYYYYToDate(ddmmyyyy) {
      //Nếu ddmmyyy không đúng định dạng dd/MM/yyyy thì trả về ""
      if (
        !/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(
          ddmmyyyy
        )
      ) {
        return "";
      }
      //Nếu ddmmyyyy là undefinded thì trả về ngày hiện tại
      // if (!ddmmyyyy) return new Date();
      var date = ddmmyyyy.split("/");
      var day = date[0];
      var month = date[1];
      var year = date[2];
      return new Date(year, month - 1, day);
    },
  },
};
</script>