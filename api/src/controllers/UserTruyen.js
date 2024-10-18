const logger = require("../configs/logger");
const UserTruyenService = require("../services/UserTruyen");

const getUserTruyens = async (req, res) => {
    try {
        const data = await UserTruyenService.getUserTruyens();

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const createUserTruyen = async (req, res) => {
    try {
        logger.info('CREATE UserTruyen: ' + req.body.name);

        const data = await UserTruyenService.createUserTruyen(req.body);

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const deleteUserTruyen = async (req, res) => {
    try {
        logger.info('DELETE UserTruyen: ' + req.params.id);

        await UserTruyenService.deleteUserTruyen(req.params.id);

        res.json("OK");
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

module.exports = {
    getUserTruyens,
    createUserTruyen,
    deleteUserTruyen,
};
