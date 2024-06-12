const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const soiCauHangNgaySchema = new Schema(
    {
        domainId: {
            type: String,
            default: "",
        },
        domain: {
            type: Number,
            default: 1,
        },
        province: {
            type: String,
            default: ''
        },
        /**
         * MB
         * {
         *   giaidacbiet: {
         *      head: 0 -> 9,
         *      tail: 0 -> 9,
         *   },
         *   bachthulodepnhat: [{ number: 00 -> 99 }] length = 1
         *   songthulodepnhat: [{ number: 00 -> 99 }] length = 2
         *   lokepdepnhat: [{ number: 00 -> 99 }] length = 2
         *   loxien2xien3depnhat: [{ number: 00 -> 99 }] length = 5
         *   cau3canglodepnhat: [{ number: 000 -> 999 }] length = 3
         * }
         * 
         * MN
         * {
         *   giaidacbiet: {
         *      head: 0 -> 9
         *      tail: 0 -> 9
         *   }
         *   caulotoVip: [{ number: 00 -> 99 }] length = 2,
         *   lotoXien: [{ number: 00 -> 99 }] length = 8,
         *   lotovenhieu: [{ number: 00 -> 99 }] length = 4,
         *   lotolaukhongve: [{ number: 00 -> 99 }] length = 4,
         * }
         */
        numbers: {
            type: Object,
            default: {},
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

const SoiCauHangNgay = mongoose.model("SoiCauHangNgay", soiCauHangNgaySchema);

module.exports = SoiCauHangNgay;
