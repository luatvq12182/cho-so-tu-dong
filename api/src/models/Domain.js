const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const domainSchema = new Schema(
    {
        name: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Domain = mongoose.model("Domain", domainSchema);

module.exports = Domain;
