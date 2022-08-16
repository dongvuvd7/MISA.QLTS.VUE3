<template>
  <div id="licenseDetail">
    <div class="dialog-modal"></div>
    <div class="dialog">
      <div class="dialog-body">
        <div class="dialog-title">
          <div class="dialog-title-text">
            {{
              formMode == "edit"
                ? "Sửa chứng từ ghi tăng"
                : "Thêm chứng từ ghi tăng"
            }}
          </div>
          <div class="icon-x" @click="$emit('closeDialog')"></div>
        </div>
        <div class="dialog-content">
          <div class="dialog-content-top">
            <div class="dialog-top-title">Thông tin chứng từ</div>
            <div class="dialog-top-content">
              <v-row>
                <!-- Mã chứng từ -->
                <v-col cols="4">
                  <div class="dialog-content-label">
                    Mã chứng từ
                    <span style="color: red">*</span>
                  </div>
                  <base-input
                    :placeholder="'Nhập mã chứng từ'"
                    :value="license.licenseCode"
                    :fieldName="'licenseCode'"
                    @updated="update"
                    :required="true"
                    :errorMsg="'Mã chứng từ không được phép để trống'"
                    ref="licenseCode"
                    :maxLength="50"
                  />
                </v-col>
                <!-- Ngày chứng từ -->
                <v-col cols="4">
                  <div class="dialog-content-label">
                    Ngày chứng từ
                    <span style="color: red">*</span>
                  </div>
                  <date-picker
                    v-model="license.licenseDate"
                    valueType="date"
                    format="DD/MM/YYYY"
                    :editable="true"
                    :clearable="false"
                    :disabled-date="disabledAfterToday"
                  ></date-picker>
                  <!-- <div class="date-icon">
                    <div class="input-icon icon-calendar"></div>
                  </div> -->
                </v-col>
                <!-- Ngày ghi tăng -->
                <v-col cols="4">
                  <div class="dialog-content-label">
                    Ngày ghi tăng
                    <span style="color: red">*</span>
                  </div>
                  <date-picker
                    v-model="license.writeDate"
                    valueType="date"
                    format="DD/MM/YYYY"
                    :editable="true"
                    :clearable="false"
                    :disabled-date="disabledAfterToday"
                  ></date-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="dialog-content-label">Ghi chú</div>
                  <base-input
                    :value="license.note"
                    :fieldName="'note'"
                    @updated="update"
                    :maxLength="500"
                  />
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="dialog-content-bot">
            <div class="dialog-bot-title">Thông tin chi tiết</div>
            <div class="dialog-bot-content">
              <div class="dialog-table-header">
                <div class="dialog-table-header-left">
                  <!-- Input tìm kiếm -->
                  <base-input
                    :placeholder="'Tìm kiếm theo mã, tên tài sản'"
                    :withIcon="true"
                    :icon="'icon-search-black'"
                    :fieldName="'searchAssets'"
                    :value="searchTextListAsset"
                    @searching="typingSearch"
                  />
                </div>
                <div class="dialog-table-header-right">
                  <!-- Nút chọn tài sản -->
                  <base-button-text
                    text="Chọn tài sản"
                    :btnType="'outline-btn'"
                    @click="showSelectAsset = true"
                    class="btn-select-asset"
                  />
                </div>
              </div>
              <div
                class="table-wrapper"
                :style="{
                  'min-height': listAssets.length == 0 ? '50%' : 'unset',
                }"
              >
                <!-- Nếu không có dữ liệU thì hiện text 'Không có dữ liệu' -->
                <div
                  class="no-content-table-asset"
                  v-if="listAssets.length == 0"
                >
                  <!-- Chứng từ chưa liên kết tài sản nào -->
                </div>
                <table
                  id="tblAsset"
                  cellpadding="0"
                  :class="{ 'table-empty': listAssets.length == 0 }"
                >
                  <!-- thead -->
                  <thead>
                    <tr>
                      <th style="width: 50px" class="text-center">STT</th>
                      <th
                        style="min-width: 90px; max-width: 90px"
                        class="text-left"
                      >
                        Mã tài sản
                      </th>
                      <th style="max-width: 150px" class="text-left">
                        Tên tài sản
                      </th>
                      <th style="min-width: 180px" class="text-left">
                        Bộ phận sử dụng
                      </th>
                      <th
                        style="min-width: 110px; max-width: 110px"
                        class="text-right"
                      >
                        Nguyên giá
                      </th>
                      <th
                        style="min-width: 110px; max-width: 110px"
                        class="text-right"
                      >
                        Hao mòn năm
                      </th>
                      <th
                        style="min-width: 110px; max-width: 110px"
                        class="text-right"
                      >
                        Giá trị còn lại
                      </th>
                      <th style="width: 100px" class="text-center"></th>
                    </tr>
                  </thead>
                  <!-- tbody -->
                  <tbody>
                    <tr v-for="(asset, index) in listAssets" :key="index">
                      <td class="text-center">
                        {{ index + 1 }}
                      </td>
                      <td class="text-left">{{ asset.assetCode }}</td>
                      <td style="max-width: 150px" class="text-left">
                        {{ asset.assetName }}
                      </td>
                      <td class="text-left" style="max-width: 170px">
                        {{ asset.departmentName }}
                      </td>
                      <td class="text-right">
                        {{ formatNumber(asset.cost) }}
                      </td>
                      <td class="text-right">
                        {{ formatNumber(asset.annualDepreciation) }}
                      </td>
                      <td class="text-right">
                        {{ formatNumber(asset.remainingValue) }}
                      </td>
                      <td class="text-center" style="width: 100px">
                        <div class="function-container">
                          <div
                            class="icon-edit"
                            @click="
                              btnEditOnClick(
                                asset.assetId,
                                index,
                                asset.costDetail
                              )
                            "
                            title="Sửa nguồn hình thành tài sản"
                          ></div>
                          <div
                            class="icon-delete"
                            @click="btnDeleteOnClick(asset.assetId)"
                            title="Bỏ tài sản"
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <!-- Trick để ngăn phần paging co lên khi số bản ghi ít -->
                    <tr id="tr-empty" style="height: 100%">
                      <td
                        colspan="11"
                        style="background-color: #fff; padding: 0; border: none"
                      ></td>
                    </tr>
                  </tbody>
                  <!-- Table Footer -->
                  <tfoot>
                    <tr
                      class="tr-sum-assets-license"
                      style="position: sticky; bottom: 38px; height: 40px"
                      v-if="listAssets.length > 0"
                    >
                      <td class="text-left" colspan="4"></td>
                      <td class="text-right bold">
                        {{ formatNumber(sum("cost")) }}
                      </td>
                      <td class="text-right bold">
                        {{ formatNumber(sum("accumulatedDepreciation")) }}
                      </td>
                      <td class="text-right bold">
                        {{ formatNumber(sum("remainingValue")) }}
                      </td>
                      <td></td>
                    </tr>
                    <tr class="tr-paging-assets-license">
                      <td
                        class="text-left"
                        colspan="5"
                        style="border-top: none"
                      >
                        <div class="table-footer-left">
                          <!-- Tổng số bản ghi -->
                          <div class="total-record">
                            <span>Tổng số: </span>
                            <span class="bold">{{ totalRowsListAsset }}</span>
                            <span> bản ghi</span>
                          </div>
                          <!-- Kích thước trang -->
                          <div class="page-size">
                            <select
                              name="pageSize"
                              id="pageSize"
                              v-model="pageSizeListAsset"
                            >
                              <option value="2">2</option>
                              <option value="10">10</option>
                              <option value="20">20</option>
                              <option value="30">30</option>
                              <option value="50">50</option>
                            </select>
                          </div>
                          <!-- Phân trang -->
                          <div
                            class="btn-prev-page"
                            @click="
                              currentPageListAsset = Math.max(
                                currentPageListAsset - 1,
                                1
                              )
                            "
                          >
                            <div class="icon-prev-page"></div>
                          </div>
                          <paginate
                            v-model="currentPageListAsset"
                            :page-count="totalPageListAsset"
                            :page-range="3"
                            :margin-pages="1"
                            :prev-text="''"
                            :next-text="''"
                            :container-class="'pagination'"
                            :page-class="'page-item'"
                          >
                          </paginate>
                          <div
                            class="btn-next-page"
                            @click="
                              currentPageListAsset = Math.min(
                                currentPageListAsset + 1,
                                totalPageListAsset
                              )
                            "
                          >
                            <div class="icon-next-page"></div>
                          </div>
                        </div>
                      </td>
                      <td colspan="3" style="border-top: none"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <base-button-text
          :text="'Lưu'"
          @click="saveDataLicense"
          style="order: 2"
        />
        <base-button-text
          :text="'Huỷ'"
          :btnType="'white-btn'"
          @click="btnCancelOnClick"
          style="order: 1"
        />
      </div>
    </div>
    <!-- end dialog -->

    <!-- Dialog Chọn tài sản -->
    <select-asset
      v-if="showSelectAsset"
      :currentSelectedAssets="listAssets"
      @closeSelectAsset="showSelectAsset = false"
      @updateListAssets="updateListAssets"
    />

    <!-- Dialog Chi tiết nguyên giá -->
    <cost-detail
      v-if="showCostDetail"
      :assetId="selectedAssetId"
      :licenseId="selectedId"
      :index="selectedIndex"
      :costDetail="costDetail"
      @saveCostDetail="saveCostDetail"
      @closeCostDetail="showCostDetail = false"
    />
  </div>
</template>

<script>
import { bus } from "../../main";
import axios from "axios";
import numeral from "numeral";
import moment from "moment";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import Paginate from "vuejs-paginate";

import Enums from "../../components/common/enum.js";
import Resources from "../../components/common/resource.js";

import BaseInput from "../../components/base/BaseInput.vue";
import BaseButtonText from "../../components/base/BaseButtonText.vue";

import SelectAsset from "../write-asset/SelectAsset.vue";
import CostDetail from "../write-asset/CostDetail.vue";

export default {
  components: {
    BaseInput,
    DatePicker,
    BaseButtonText,
    Paginate,
    SelectAsset,
    CostDetail,
  },

  props: {
    //Form mode (thêm, sửa)
    formMode: {
      type: String,
      default: Enums.FormMode.Add,
    },
    //Id chứng từ LicenseList truyền lên (thêm mới: null, sửa: id truyền lên)
    selectedId: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      //Thông tin chứng từ trên form
      license: {
        licenseCode: "", //Mã chứng từ
        licenseDate: new Date(), //ngày bắt đầu sử dụng
        writeDate: new Date(), //ngày ghi tăng
        note: "", //ghi chú
        totalCost: 0, //tổng nguyên giá
        //Danh sách chi tiết chứng từ, khi vào LicenseRepository sẽ tách ra để insert trường này vào bảng LicenseDetail
        licenseDetail: [],
      },
      licenseOrigin: {}, //Chứng từ ban đầu khi mở form detail license
      selectedAssetId: null, //id tài sản được chọn (truyền vào form chi tiết nguyên giá)
      selectedIndex: null, //index của tài sản được chọn (truyền vào form chi tiết nguyên giá)
      costDetail: null, //chi tiết nguyên giá của tài sản được chọn (truyền vào form chi tiết nguyên giá)
      listAssets: [], //Danh sách tài sản tương ứng với chứng từ đang xét
      showSelectAsset: false, //Hiển thị form chọn tài sản khi thêm mới chứng từ
      showCostDetail: false, //Hiển thị form chi tiết nguyên giá của tài sản

      currentPageListAsset: 1, //Trang tài sản hiện tại, đang fix cứng là 1
      totalPageListAsset: 1, //Tổng số trang tài sản
      pageSizeListAsset: 10, //Số lượng tài sản trên một trang
      searchTextListAsset: "", //Từ khóa tìm kiếm tài sản
      totalRowsListAsset: 0, //Tổng số các bản ghi tài sản
    };
  },

  created() {
    /**
     * Khai báo event saveDataLicense tại bus
     * Created by: VDDong (12/08/2022)
     */
    bus.$on("saveDataLicense", this.saveDataLicense);

    /**
     * Lấy dữ liệu từ server để render ra form detail
     */
    if (this.formMode == Enums.FormMode.Edit) {
      //Nếu là form sửa chứng từ
      var me = this;
      //Gửi yêu cầu api lấy thông tin chứng từ
      axios
        .get(Resources.API.GetLicenseById + `${me.selectedId}`)
        .then(function (response) {
          var license = response.data;
          license.licenseDate = new Date(license.licenseDate); //Ngày chứng từ
          license.licenseDate.setHours(license.licenseDate.getHours() + 7); //+7 tiếng để đối sang giờ UTC+7
          license.writeDate = new Date(license.writeDate); //Ngày ghi tăng
          license.writeDate.setHours(license.writeDate.getHours() + 7); //+7 tiếng để đối sang giờ UTC+7
          license.assetIds = "";
          me.license = license;
          me.licenseOrigin = { ...license }; //Lưu thông tin chứng từ ban đầu khi mở form detail license
        })
        .catch(function (error) {
          console.log(error);
        });
      this.getListAssetsByLicenseId();
    } else {
      //Nếu là form thêm chứng từ
      //Lấy mã chứng từ mới
      this.license.licenseCode = this.getNewLicenseCode();
    }
  },

  mounted() {
    /**
     * Auto focus on input field Mã chứng từ
     * Created by: VDDong (12/08/2022)
     */
    this.$refs.licenseCode.$refs.input.focus();
  },

  updated() {
    /**
     * Khi có cập nhật thì tính lại số trang
     * Created by: VDDong (09/08/2022)
     */
    this.totalPageListAsset = Math.ceil(
      this.totalRowsListAsset / this.pageSizeListAsset
    );
  },

  watch: {
    /**
     * Theo dõi biến số trang hiện tại
     * CreatedBy: VDDong(13/07/2022)
     */
    currentPageListAsset() {
      var me = this;
      me.getListAssetsByLicenseId();
    },
    /**
     * Theo dõi biến kích thước trang
     * CreatedBy: VDDong(13/07/2022)
     */
    pageSizeListAsset() {
      var me = this;
      //Quay về trang đầu
      me.currentPageListAsset = 1;
      me.getListAssetsByLicenseId();
    },
  },

  methods: {
    /**
     * Lấy thông tin các tài sản theo chứng từ
     * Created by: VDDong (15/08/2022)
     */
    getListAssetsByLicenseId() {
      var me = this;
      //Gửi yêu cầu api lấy danh sách các tài sản theo chứng từ
      me.listAssets = [];
      axios
        .get(`${Resources.API.GetFilterAssetByLicenseId}${me.selectedId}&searchText=${me.searchTextListAsset}&pageSize=${me.pageSizeListAsset}&pageNumber=${me.currentPageListAsset}`)
        .then(function (response) {
          me.totalRowsListAsset = response.data.totalRecords;
          var listAssets = response.data.data || [];
          listAssets.forEach((asset) => {
            //Set các thuộc tính
            var startUseYear = asset.useDate.substring(0, 4); //Năm mua
            var currentYear = new Date().getFullYear(); //Năm hiện tại
            var rate = asset.depreciationRate; //Tỷ lệ hao mòn
            var cost = asset.cost; //Nguyên giá
            asset.selected = false;
            asset.annualDepreciation = rate * cost; //Giá trị hao mòn năm
            asset.accumulatedDepreciation =
              (currentYear - startUseYear) * rate * cost; //Khấu hao lũy kế = (Năm hiện tại - năm bắt đầu sử dụng) * giá trị hao mòn năm
            asset.remainingValue = asset.cost - asset.accumulatedDepreciation; //Giá trị còn lại
            me.listAssets.push(asset);
          });

          //Lấy dữ liệu chi tiết nguyên giá của các tài sản của chứng từ đang sửa
          axios
            .get(Resources.API.GetLicenseDetailByLicenseId + `${me.selectedId}`)
            .then(function (response) {
              var licenseDetails = response.data;
              for (let index = 0; index < licenseDetails.length; index++) {
                //Thêm trường costDetail vào mỗi asset trong listAssets
                me.listAssets[index].costDetail = licenseDetails[index].detail;
              }
              console.log("List Assets of License: ", me.listAssets);
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Lưu thông tin chứng từ khi thêm hoặc sửa
     * Created by: VDDong (11/08/2022)
     */
    saveDataLicense() {
      var valid = true;
      //Validate bắt buộc nhập
      valid = this.requiredFieldLicenseValidate();
      //Nếu pass validate bắt buộc nhập
      if (valid) {
        //Validate chưa chọn tài sản nào
        if (this.listAssets.length === 0) {
          this.$emit("validateError", [Resources.Notice.AlertNeedChooseAsset]);
          return; //Không request api
        }
        //Set các thuộc tính: chi tiết chứng từ(mã tài sản, detail: tênnguồn-giátrị), tổng nguyên giá (để lên server thêm vào bảng licensedetail)
        this.license.licenseCode = this.license.licenseCode.trim(); //Xóa khoảng trắng ở đầu và cuối của mã chứng từ
        this.license.licenseDetail = []; //Danh sách chi tiết chứng từ
        this.license.totalCost = 0; //Tổng nguyên giá

        this.listAssets.forEach((asset) => {
          this.license.licenseDetail.push({
            assetId: asset.assetId, //Mã tài sản
            detail: asset.costDetail, //Chi tiết nguyên giá
          });
          this.license.totalCost += asset.cost; //Tổng nguyên giá = Tổng (giá các tài sản)
        });
        console.log("license before send to server: ", this.license);

        //Call API lưu dữ liệu
        var me = this;
        //Nếu là sửa chứng từ
        if (this.formMode === Enums.FormMode.Edit) {
          axios
            .put(
              Resources.API.GetLicenseById + `${this.selectedId}`,
              this.license
            )
            .then(() => {
              //Load lại dữ liệu
              me.$emit("loadData");
              //Show thông báo thành công
              me.$emit("showToast", Resources.ToastMsg.EditSuccess);
              //Đóng form chi tiết LicenseDetail
              me.$emit("closeDialog");
            })
            .catch((error) => {
              //Emit event validateError, hiện Popup báo cho người dùng các lỗi từ server trả về
              me.$emit(
                "validateError",
                error.response.data.exception.errorMsgs
              );
            });
        } else {
          //Nếu là thêm chứng từ
          axios
            .post(Resources.API.PostLicense, this.license)
            .then(() => {
              //Load lại dữ liệu
              me.$emit("loadData");
              //Show thông báo thành công
              me.$emit("showToast", Resources.ToastMsg.AddSuccess);
              //Đóng form chi tiết
              me.$emit("closeDialog");
            })
            .catch((error) => {
              //Hiện Popup báo cho người dùng các lỗi từ server trả về
              me.$emit(
                "validateError",
                error.response.data.exception.errorMsgs
              );
            });
        }
      }
    },

    /**
     * Validate bắt buộc nhập những file required trong form detail license
     * Created by: VDDong (15/08/2022)
     */
    requiredFieldLicenseValidate() {
      //get all input with class m-input-required
      var inputs = this.$el.querySelectorAll(".m-input-required");
      //loop all input
      for (var i = 0; i < inputs.length; i++) {
        //get value of input
        var value = inputs[i].value;
        //if value is empty
        if (value == "") {
          //show error
          bus.$emit("validate");
          //focus on input
          inputs[i].focus();
          //break loop
          return false;
        }
      }

      //get all input with name is date
      var inputsDate = this.$el.querySelectorAll(
        '.dialog .dialog-content input[name="date"]'
      );
      //loop all input name is date
      for (var j = 0; j < inputsDate.length; j++) {
        //get value of input
        var valueInputDate = inputsDate[j].value;
        //if value is empty
        if (valueInputDate == "") {
          //show error by add class error-input to that elemnt
          inputsDate[j].classList.add("error-input");
          //add title = "Bạn cần nhập trường này."
          inputsDate[j].title = Resources.Notice.RequiredField;
          //focus on input
          inputsDate[j].focus();
          //break loop
          return false;
        } else {
          //remove class error-input
          inputsDate[j].classList.remove("error-input");
        }
      }

      //if all input is not empty
      return true;
    },

    /**
     * Click sửa tài sản (Vào form Chi tiết nguyên giá)
     * Created by: VDDong (10/08/2022)
     */
    btnEditOnClick(assetId, index, costDetail) {
      //Set các giá trị để truyền vào Form CostDetail(xem chi tiết nguyên giá)
      this.selectedIndex = index;
      this.selectedAssetId = assetId;
      this.costDetail = costDetail;
      this.showCostDetail = true;
    },

    /**
     * Click vào xóa tài sản (tài sản của chứng từ đang xét)
     * Thực hiện xóa tài sản đó khỏi listAssets
     * Created by: VDDong (10/08/2022)
     */
    btnDeleteOnClick(assetId) {
      const removeIndex = this.listAssets.findIndex(
        (asset) => asset.assetId === assetId
      );
      this.listAssets.splice(removeIndex, 1);
    },

    /**
     * Nhấn vào nút hủy ở form detail chứng từ
     * Created by: VDDong (10/08/2022)
     */
    btnCancelOnClick() {
      var me = this;
      const licenseInit = JSON.parse(JSON.stringify(me.licenseOrigin));
      const licenseNow = JSON.parse(JSON.stringify(me.license));
      //Emit event btnCancelOnClick cho component cha show popup
      if (me.formMode == Enums.FormMode.Edit) {
        if (me.compareTwoObject(licenseNow, licenseInit))
          me.$emit("btnCancelOnClick", Enums.Action.Put);
        else me.$emit("closeDialog");
      } else {
        me.$emit("btnCancelOnClick", Enums.Action.Post);
      }
    },

    /**
     * So sánh 2 object để kiểm tra có thay đổi hay không
     * Created by: VDDong (15/08/2022)
     */
    compareTwoObject(obj1, obj2) {
      for (let i in obj1) {
        if (obj1[i] !== obj2[i]) {
          return true;
        }
      }
      return false;
    },

    /**
     * Lưu chi tiết nguyên giá của tài sản tương ứng vị trí index
     * Created by: VDDong (11/08/2022)
     */
    saveCostDetail(costDetail, index) {
      this.listAssets[index].costDetail = costDetail;
      console.log(this.listAssets, "list Assets after save cost detail");
    },

    /**
     * Cập nhật lại danh sách tài sản tưởng ứng của chứng từ
     * Created by: VDDong (10/08/2022)
     */
    updateListAssets(selectAssets) {
      this.listAssets = selectAssets;
    },

    /**
     * Lấy mã chứng từ mới
     * Created by: VDDong (10/08/2022)
     */
    getNewLicenseCode() {
      var me = this;
      //Gọi API lấy mã chứng từ mới
      axios
        .get(Resources.API.GetNewLicenseCode)
        .then(function (response) {
          me.license.licenseCode = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * Tìm kiếm tài sản theo tên hoặc mã tài sản 
     * Created by: VDDong (15/08/2022)
     */
    typingSearch(searchText) {
      var me = this;
      me.searchTextListAsset = searchText;
      me.currentPageListAsset = 1;
      me.getListAssetsByLicenseId();
    },

    /**
     * Cập nhật dữ liệu tương ứng khi thay đổi input (validate)
     * Created by: VDDong  (10/08/2022)
     */
    update(fieldName, value) {
      //Cập nhật thuộc tính [fieldName] tương ứng
      this.license[fieldName] = value;
    },

    /**
     * Không cho phép chọn ngày sau ngày hiện tại
     * CreatedBy: VDDong (09/05/2022)
     */
    disabledAfterToday: function (date) {
      return date > new Date();
    },

    /**
     * Tính tổng các giá trị
     * (Ở đây tính Tổng các giá trị của listAssets)
     * Created by: VDDong (09/08/2022)
     */
    sum(fieldName) {
      var me = this;
      var total = 0;
      me.listAssets.forEach(function (asset) {
        total += asset[fieldName];
      });
      return total;
    },
    /**
     * Định dạng số
     * Created by: VDDong (10/08/2022)
     */
    formatNumber: function (value) {
      return numeral(value).format("0,0");
    },
    /**
     * Định dạng ngày tháng
     * Created by: VDDong (10/08/2022)
     */
    formatDate: function (value) {
      return moment(value).format("DD/MM/YYYY");
    },
  },
};
</script>

<style scoped>
.no-content-table-asset {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tr-sum-assets-license td {
  background-color: #f5f5f5 !important;
}
.tr-paging-assets-license td {
  border-top: 1px solid #e5e5e5 !important;
}

.btn-select-asset:hover {
  color: #ffffff !important;
  background-color: var(--primary-color-active) !important;
}
</style>