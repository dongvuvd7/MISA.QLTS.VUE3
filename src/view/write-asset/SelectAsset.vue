<template>
    <div id="selectAsset">
        <div class="dialog-modal"></div>
        <div class="dialog">
            <div class="dialog-body">
                <div class="dialog-">
                    <div class="dialog-title-text">Chọn tài sản ghi tăng</div>
                    <div class="icon-x" @click="$emit('closeSelectAsset')"></div>
                </div>
                <div class="dialog-content">

                </div>
            </div>
            <!-- end dialog-body -->
            <div class="dialog-footer">

            </div>
            <!-- end dialog-footer -->
        </div>
    </div>
</template>

<script>

import numeral from "numeral";

export default {
    components: {

    },

    props: {
        //Danh sách những tài sản liên kết với chứng từ đang xét
        currentSelectedAssets: {
            type: Array,
            default() {
                return [];
            },
        },
    },

    data() {
        return {
            listAssets: [], //Danh sách tài sản
            selectedIndex: -1, //Vị trí tài sản đã chọn
            selectAll: false, //Check box chọn tất cả tài sản
            countSelected: 0, //Đếm số tài sản đã chọn
            pageSize: 20, //Số bản ghi / 1 trang
            currentPage: 1, //Trang hiện tại
            totalPage: 1, //Tổng số trang
            searchText: "", //Từ khóa tìm kiếm
            totalRows: 0, //Tổng số bản ghi
            selectedAssets: [], //Danh sách tài sản đã chọn
        };
    },

    created() {

    },

    watch: {

    },

    methods: {

        /**
         * Định dạng số
         * Created by: VDDong (10/05/2022)
         */
        formatNumber(value) {
            return numeral(value).format("0.0");
        }
    },
}
</script>
