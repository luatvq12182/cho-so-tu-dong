const DomainModel = require("../models/Domain");

const getDomains = async () => {
    const domains = await DomainModel.find();

    return domains;
};

const getDomain = async (id) => {
    const domain = await DomainModel.findById(id);

    return domain;
};

const createDomain = async (data) => {
    const newObj = new DomainModel(data);

    return newObj.save();
};

const updateDomain = async (data) => {
    return DomainModel.findByIdAndUpdate(data._id, data, {
        new: true,
    });
};

const deleteDomain = async (id) => {
    return DomainModel.findByIdAndDelete(id);
};

module.exports = {
    getDomains,
    getDomain,
    createDomain,
    updateDomain,
    deleteDomain,
};
