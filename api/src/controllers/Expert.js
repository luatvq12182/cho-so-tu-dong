const logger = require("../configs/logger");
const ExpertService = require("../services/Expert");
const ChuyenGiaChoSoService = require("../services/ChuyenGiaChoSo");

const getExperts = async (_req, res) => {
    try {
        const experts = await ExpertService.getExperts();

        res.json(experts);
    } catch (error) {
        console.log("Error getExperts: ", error);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

const getExpert = async (_req, res) => {
    try {
        const expert = await ExpertService.getExpert();

        res.json(expert);
    } catch (error) {
        console.log("Error getExpert: ", error);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

const createExpert = async (req, res) => {
    try {
        const payload = req.body;
        const avatar = req.file ? req.file.path : null;

        const expert = await ExpertService.createExpert({
            name: payload.name,
            avatar: avatar,
            sites: JSON.parse(payload.sites),
            soicau: JSON.parse(payload.soicau),
        });

        logger.info("CREATE Expert: " + JSON.stringify(req.body));

        res.status(201).json(expert);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

const updateExpert = async (req, res) => {
    try {
        const payload = req.body;
        const avatar = req.file ? req.file.path : null;

        await ExpertService.updateExpert({
            ...payload,
            avatar: avatar || payload.avatar,
            sites: JSON.parse(payload.sites),
            soicau: JSON.parse(payload.soicau),
        });

        logger.info("UPDATE Expert: " + JSON.stringify(req.body));

        res.status(200).json("OK");
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

const deleteExperts = async (req, res) => {
    try {
        // await ExpertService.deleteExperts(req.params.id);
    } catch (error) {
        console.log("Error deleteExperts: ", error);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

const deleteExpert = async (req, res) => {
    try {
        await ExpertService.deleteExpert(req.params.id);

        logger.info("DELETE Expert: " + req.params.id);

        res.json("OK");
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

const soHangNgay = async (req, res) => {
    try {
        const { site, cvHtml } = req.query;

        const data = await ChuyenGiaChoSoService.autoNumber(site, cvHtml);

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({
                msg: "Not found",
            });
        }
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json({
            msg: "Bad Request",
        });
    }
};

module.exports = {
    getExperts,
    getExpert,
    createExpert,
    updateExpert,
    deleteExpert,
    deleteExperts,
    soHangNgay,
};
