const LoaiSoiCauModel = require("../models/LoaiSoiCau");

const getLoaiSoiCaus = async () => {
    const posts = await LoaiSoiCauModel.find();

    return posts;
};

const createLoaiSoiCau = async (data) => {
    const newObj = new LoaiSoiCauModel(data);

    return newObj.save();
};

const updateLoaiSoiCau = async (data) => {
    return LoaiSoiCauModel.findByIdAndUpdate(data._id, data, {
        new: true,
    });
};

const deleteLoaiSoiCau = async (id) => {
    return LoaiSoiCauModel.findByIdAndDelete(id);
};

module.exports = {
    getLoaiSoiCaus,
    createLoaiSoiCau,
    updateLoaiSoiCau,
    deleteLoaiSoiCau,
};
