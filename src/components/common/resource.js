const Resource = {
    API: {
        GetAssetById: "https://localhost:44309/api/v1/Assets/",
        GetAssetsFilter: "https://localhost:44309/api/v1/Assets/Filter?searchText=",
        GetAssetsFilters: "https://localhost:44309/api/v1/Assets/Filters?searchText=",
        GetDepartments: "https://localhost:44309/api/v1/Departments",
        GetAssetCategories: "https://localhost:44309/api/v1/AssetCategories",
        DeleteAsset: "https://localhost:44309/api/v1/Assets?entityIds=",
        GetNewAssetCode: "https://localhost:44309/api/v1/Assets/NewCode",
        GetExportExcel: "https://localhost:44309/api/v1/Assets/ExportExcel",

        GetAssetCategoryByName: "https://localhost:44309/api/v1/AssetCategories/AssetCategoryName?entityName=",
        GetDepartmentByName: "https://localhost:44309/api/v1/Departments/DepartmentName?entityName=",
        AssetMultiplePost: "https://localhost:44309/api/v1/Assets/MultiplePost",
        Loginlogout: "https://localhost:44309/api/v1/User",

        /* API phần Ghi tăng tài sản */
        GetLicenseFilter: "https://localhost:44309/api/v1/License/Filter?searchText=",
        GetLicenseById: "https://localhost:44309/api/v1/License/",
        PostLicense: "https://localhost:44309/api/v1/License",
        GetAssetsByLicenseId: "https://localhost:44309/api/v1/Assets/GetByLicenseId/",
        GetLicenseDetailByLicenseId: "https://localhost:44309/api/v1/LicenseDetail?licenseId=",
        GetNewLicenseCode: "https://localhost:44309/api/v1/License/NewCode",
        GetCostSource: "https://localhost:44309/api/v1/CostSource",
        DeleteLicenseByIds: "https://localhost:44309/api/v1/License?entityIds=",
        CheckAssetReferencedLicense: "https://localhost:44309/api/v1/Assets/AssetReferencedLicense/",
        

    },

    Notice: {
        ConfirmMultiDelete: "tài sản đã được chọn. Bạn có muốn xoá các tài sản này khỏi danh sách?",
        ConfirmSingleDelete: "Bạn có muốn xoá",
        AlertClickToDelete: "Bạn chưa chọn tài sản nào. Chọn ít nhất 1 bản ghi để xóa.",
        ConfirmCancelEdit: "Thông tin thay đổi sẽ không được cập nhật nếu bạn không lưu. Bạn có muốn lưu các thay đổi này?",
        ConfirmCancelAdd: "Bạn có muốn huỷ bỏ khai báo tài sản này?",
        RequiredField: "Không được để trống trường này!",

        License_ConfirmMultiDelete: "chứng từ đã được chọn. Bạn có muốn xoá các chứng từ này khỏi danh sách?",
        License_ConfirmCancelAdd: "Bạn có muốn huỷ bỏ khai báo chứng từ này?",
        AlertNeedChooseAsset: "Bạn cần chọn ít nhất 1 tài sản liên kết với chứng từ này!",

        WrongFormatFileExcel: "File chưa đúng định dạng. Vui lòng chọn file .xlsx hoặc .xls.",
        EmptyFileExcel: "Không có dữ liệu để nhập khẩu! Vui lòng kiểm tra lại file excel.",
        FieldRequired: "không được để trống!",
        FieldInvalid: "không hợp lệ!",
        
    },

    TextBtn: {
        Delete: "Xóa",
        No: "Không",
        Close: "Đóng",
        Save: "Lưu",
        DontSave: "Không lưu",
        Cancel: "Hủy bỏ",
    },

    ErrorMsg: {
        DepreciationRate: "Tỉ lệ hao mòn phải bằng 1/Số năm sử dụng",
        AnnualDepreciation: "Hao mòn năm phải nhỏ hơn hoặc bằng nguyên giá",

    },

    ToastMsg: {
        EditSuccess: "Lưu dữ liệu thành công",
        EditFail: "Lưu dữ liệu thất bại",
        AddSuccess: "Thêm dữ liệu thành công",
        AddFail: "Thêm dữ liệu thất bại",
        DeleteSuccess: "Xóa dữ liệu thành công",
        DeleteFail: "Xóa dữ liệu thất bại",

    }

}

export default Resource;