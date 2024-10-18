const UserTruyen = require("../models/UserTruyen");

const getUserTruyens = async () => {
    const res = await UserTruyen.find();

    return res;
};

const getUserTruyen = async (id) => {
    const res = await UserTruyen.findById(id);

    return res;
};

const createUserTruyen = async (data) => {
    const newObj = new UserTruyen(data);

    return newObj.save();
};

// const updateUserTruyen = async (data) => {
//     return UserTruyen.findByIdAndUpdate(data._id, data, {
//         new: true,
//     });
// };

const deleteUserTruyen = async (id) => {
    return UserTruyen.findByIdAndDelete(id);
};

module.exports = {
    getUserTruyens,
    getUserTruyen,
    createUserTruyen,
    // updateUserTruyen,
    deleteUserTruyen,
};
