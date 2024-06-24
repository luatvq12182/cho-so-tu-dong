const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * loaiSoiCauId: xxx (Bạch Thủ Lô Kép Hôm Nay)
 * domainId: yyy (soicau247.org)
 * number: 68
 * result: Trúng (x2)
 */

const expertSchema = new Schema(
    {
        name: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        sites: {
            type: Array,
            default: [],
        },
        soicau: {
            type: Array,
            default: [],
        },
        metadata: {
            type: Object,
            default: {},
        }
    },
    {
        timestamps: true,
    }
);

const Expert = mongoose.model("Expert", expertSchema);

module.exports = Expert;
