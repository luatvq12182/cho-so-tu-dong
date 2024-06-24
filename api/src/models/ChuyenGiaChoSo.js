const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * expertId: 66739429af64a71bb3465012
 * domainId: 6646ff20cce4ea8086bb1ad2
 * soCho: [{
 *      id: "id-94yfmebo2-lxmy0rzz",
 *      name: 'BTL',
 *      checkType: "5",
 *      numberType: "1",
 *      quantity: 1,
 *      numbers: [{
 *          number: 23,
 *          win: false,
 *          times: 2,
 *      }],
 * }]
 * createdAt: 2024-06-19T18:00:00.000Z
 */

const chuyenGiaChoSoSchema = new Schema(
    {
        expertId: {
            type: String,
            default: "",
        },
        domainId: {
            type: String,
            default: "",
        },
        giveNumbers: {
            type: Array,
            default: [],
        },
        isWaiting: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

const ChuyenGiaChoSo = mongoose.model("ChuyenGiaChoSo", chuyenGiaChoSoSchema);

module.exports = ChuyenGiaChoSo;
