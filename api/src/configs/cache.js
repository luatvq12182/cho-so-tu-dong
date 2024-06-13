const logger = require("./logger");

const Cache = () => {
    let store = {};

    const isExist = (key) => {
        if (key in store) {
            return true;
        } else {
            return false;
        }
    }

    const getKey = (key) => {
        if (key in store) {
            return store[key];
        } 
    }

    const setKey = (key, data) => {
        if (key in store) {
            logger.info(`Không thể set cache: ${key} đã tồn tại`);
        } else {
            store[key] = data;
        }
    };

    const updateKey = (key, data) => {
        if (key in store) {
            store[key] = data;
        } else {
            logger.info(`Không thể update cache: ${key} không tồn tại`);
        }
    };

    const deleteKey = (key) => {
        if (key in store) {
            delete store[key];
        } else {
            logger.info(`Không thể delete cache: ${key} không tồn tại`);
        }
    };

    const reset = () => {
        logger.info(`RESET Cache`);
        store = {};
    };

    const getKeys = () => {
        return Object.keys(store);
    }

    return {
        isExist,
        getKey,
        setKey,
        updateKey,
        deleteKey,
        reset,
        getKeys,
    };
};

const cache = Cache();

module.exports = {
    cache,
};
