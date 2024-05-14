const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * ex:
 * name: Bạch Thủ Lô Kép Hôm Nay
 * prize: 0 (Lô)
 * numberType: 0 (Số ngẫu nhiên (0 -> 99))
 * numberOfDays: 1
 */

const loaiSoiCauSchema = new Schema(
    {
        // ex: Bạch Thủ Lô Kép Hôm Nay
        name: {
            type: String,
            default: "",
        },
        // 0 => lô | 1 => đề
        prize: {
            type: Number,
        },
        // Số ngẫu nhiên (0 ->9) | Số ngẫu nhiên (0 -> 99) | Số kép | Số ngẫu nhiên (0 -> 999)
        numberType: {
            type: Number,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        numberOfDays: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

const LoaiSoiCau = mongoose.model("LoaiSoiCau", loaiSoiCauSchema);

module.exports = LoaiSoiCau;