const logger = require("../configs/logger");
const LoaiSoiCauService = require("../services/LoaiSoiCau");

const getLoaiSoiCaus = async (req, res) => {
    try {
        const data = await LoaiSoiCauService.getLoaiSoiCaus();

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

// const getLoaiSoiCau = async (req, res) => {
//     try {
//         const data = await LoaiSoiCauService.getLoaiSoiCaus(req.params.id);

//         res.json(data);
//     } catch (error) {
//         res.status(400).json(error);
//     }
// };

const createLoaiSoiCau = async (req, res) => {
    try {
        logger.info('CREATE LoaiSoiCau: ' + JSON.stringify(req.body));

        const data = await LoaiSoiCauService.createLoaiSoiCau(req.body);

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const updateLoaiSoiCau = async (req, res) => {
    try {
        logger.info('UPDATE LoaiSoiCau: ' + JSON.stringify(req.body));

        const data = await LoaiSoiCauService.updateLoaiSoiCau(req.body);

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const deleteLoaiSoiCau = async (req, res) => {
    try {
        logger.info('DELETE LoaiSoiCau: ' + req.body._id);

        await LoaiSoiCauService.deleteLoaiSoiCau(req.params.id);

        res.json("OK");
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

module.exports = {
    getLoaiSoiCaus,
    createLoaiSoiCau,
    updateLoaiSoiCau,
    deleteLoaiSoiCau,
};
