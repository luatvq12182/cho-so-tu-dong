const DomainService = require("../services/Domain");

const getDomains = async (req, res) => {
    try {
        const data = await DomainService.getDomains();

        res.json(data);
    } catch (error) {
        res.status(400).json(error);
    }
};

const createDomain = async (req, res) => {
    try {
        const data = await DomainService.createDomain(req.body);

        res.json(data);
    } catch (error) {
        res.status(400).json(error);
    }
};

const updateDomain = async (req, res) => {
    try {
        const data = await DomainService.updateDomain(req.body);

        res.json(data);
    } catch (error) {
        res.status(400).json(error);
    }
};

const deleteDomain = async (req, res) => {
    try {
        await DomainService.deleteDomain(req.params.id);

        res.json("OK");
    } catch (error) {
        res.status(400).json(error);
    }
};

module.exports = {
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
};
