import axios from "axios";

const jwt_token = window.localStorage.getItem("jwt_token");

const httpClient = axios.create({
    // baseURL: import.meta.env.VITE_SERVICE,
    baseURL: `${window.location.origin}:3838`,
    headers: jwt_token
        ? {
              Authorization: jwt_token,
          }
        : {},
});

const signIn = (payload) => {
    return httpClient.post("/api/sign-in", payload);
};

const verifyToken = () => {
    return httpClient.post("/api/verify-token");
};

const getDomains = () => {
    return httpClient.get("/api/domains");
};

const createDomain = (payload) => {
    return httpClient.post("/api/domains", payload);
};

const updateDomain = (payload) => {
    return httpClient.put("/api/domains", payload);
};

const deleteDomain = (id) => {
    return httpClient.delete("/api/domains/" + id);
};

const getUserTruyens = () => {
    return httpClient.get("/api/userTruyen");
};

const createUserTruyen = (payload) => {
    return httpClient.post("/api/userTruyen", payload);
};

const deleteUserTruyen = (id) => {
    return httpClient.delete("/api/userTruyen/" + id);
};

const getLoaiSoiCau = () => {
    return httpClient.get("/api/loaiSoiCau");
};

const createLoaiSoiCau = (payload) => {
    return httpClient.post("/api/loaiSoiCau", payload);
};

const updateLoaiSoiCau = (payload) => {
    return httpClient.put("/api/loaiSoiCau", payload);
};

const deleteLoaiSoiCau = (id) => {
    return httpClient.delete("/api/loaiSoiCau/" + id);
};

const autoGenNumbers = () => {
    return httpClient.get("/api/autoGenNumbers");
}

const getLogFiles = () => {
    return httpClient.get('/api/logs')
}

const getLogFileContent = (fileName) => {
    return httpClient.get('/api/logs/' + fileName);
}

const getExperts = () => {
    return httpClient.get("/api/experts");
};

const createExpert = (payload) => {
    return httpClient.post("/api/experts", payload);
};

const updateExpert = (payload) => {
    return httpClient.put("/api/experts", payload);
};

const deleteExpert = (id) => {
    return httpClient.delete("/api/experts/" + id);
};

export {
    signIn,
    verifyToken,
    getDomains,
    createDomain,
    updateDomain,
    deleteDomain,
    getUserTruyens,
    createUserTruyen,
    deleteUserTruyen,
    getLoaiSoiCau,
    createLoaiSoiCau,
    updateLoaiSoiCau,
    deleteLoaiSoiCau,
    autoGenNumbers,
    getLogFiles,
    getLogFileContent,
    getExperts,
    createExpert,
    updateExpert,
    deleteExpert,    
};
