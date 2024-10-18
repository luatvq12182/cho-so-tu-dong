const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTruyenSchema = new Schema(
    {
        name: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        },
        password: {
            type: String,
            default: "",
        },
        ipAddress: {
            type: String,
            default: "",
        },
        browserInfo: {
            type: String,
            default: "",
        },
        site: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const UserTruyen = mongoose.model("UserTruyen", userTruyenSchema);

module.exports = UserTruyen;
