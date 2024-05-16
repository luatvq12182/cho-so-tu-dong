const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * loaiSoiCauId: xxx (Bạch Thủ Lô Kép Hôm Nay)
 * domainId: yyy (soicau247.org)
 * number: 68
 * result: Trúng (x2)
 */

const soHangNgaySchema = new Schema(
    {
        loaiSoiCauId: {
            type: String,
            default: "",
        },
        domainId: {
            type: String,
            default: "",
        },
        number: {
            type: Array,
            default: [],
        },
        result: {
            type: Array,
            default: [],
        },
        isWaiting: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const SoHangNgay = mongoose.model("SoHangNgay", soHangNgaySchema);

module.exports = SoHangNgay;
