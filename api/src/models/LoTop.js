const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * loaiSoiCauId: xxx (Bạch Thủ Lô Kép Hôm Nay)
 * domainId: yyy (soicau247.org)
 * number: 68
 * result: Trúng (x2)
 */

const loTopSchema = new Schema(
    {
        domainId: {
            type: String,
            default: "",
        },
        /**
         * {
         *  number: '00',
         *  win: true | false
         *  times: 1
         * }
         */
        numbers: {
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

const LoTop = mongoose.model("LoTop", loTopSchema);

module.exports = LoTop;
