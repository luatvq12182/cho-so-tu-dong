const logger = require("../configs/logger");
const DomainService = require("../services/Domain");

const getDomains = async (req, res) => {
    try {
        const data = await DomainService.getDomains();

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const createDomain = async (req, res) => {
    try {
        logger.info('CREATE DOMAIN: ' + req.body.name);

        const data = await DomainService.createDomain(req.body);

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const updateDomain = async (req, res) => {
    try {
        logger.info('UPDATE DOMAIN: ' + req.body._id);
        
        const data = await DomainService.updateDomain(req.body);

        res.json(data);
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

const deleteDomain = async (req, res) => {
    try {
        logger.info('DELETE DOMAIN: ' + req.params.id);

        await DomainService.deleteDomain(req.params.id);

        res.json("OK");
    } catch (error) {
        logger.error(error.stack);
        res.status(400).json(error);
    }
};

module.exports = {
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
};
