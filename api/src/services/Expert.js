const ExpertModel = require("../models/Expert");

const getExperts = async () => {
    const experts = await ExpertModel.find();

    return experts;
};

const getExpert = async (id) => {
    const expert = await ExpertModel.findById(id);

    return expert;
};

const createExpert = async (data) => {
    const expert = new ExpertModel(data);

    await expert.save();

    return expert;
};

const updateExpert = async (data) => {
    await ExpertModel.findByIdAndUpdate(data._id, data, {
        new: true,
    });
};

const deleteExpert = async (id) => {
    await ExpertModel.findByIdAndDelete(id);
};

const deleteExperts = async (id) => {
    await ExpertModel.findByIdAndDelete(id);
};

module.exports = {
    getExperts,
    getExpert,
    createExpert,
    updateExpert,
    deleteExpert,
    deleteExperts,
};
