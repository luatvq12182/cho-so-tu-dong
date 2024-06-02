require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("./database");
require("./schedule");
const LoaiSoiCauController = require("./src/controllers/LoaiSoiCau");
const DomainController = require("./src/controllers/Domain");
const { autoGenNumbers, checkResult, autoNumber } = require("./src/services/SoHangNgay");
const LoTopService = require('./src/services/LoTop');

const app = express();

if (process.env.MOD === "development") {
    app.use(cors());
}

app.use(
    express.json({
        limit: "40mb",
    })
);

app.get("/api/hello-world", (_req, res) => {
    res.json({
        msg: "Hello world",
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port: ", process.env.PORT);
});

app.post("/api/sign-in", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Vui lòng cung cấp username và password" });
    }

    if (
        username !== process.env.USERNAME ||
        password !== process.env.PASSWORD
    ) {
        return res
            .status(401)
            .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.json({ token });
});

app.post("/api/verify-token", (req, res) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(Date.now(), err);

            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;

        res.json("OK");
    });
});

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

app.get("/api/loaiSoiCau", authenticateToken, LoaiSoiCauController.getLoaiSoiCaus);
app.post("/api/loaiSoiCau", authenticateToken, LoaiSoiCauController.createLoaiSoiCau);
app.put("/api/loaiSoiCau", authenticateToken, LoaiSoiCauController.updateLoaiSoiCau);
app.delete("/api/loaiSoiCau/:id", authenticateToken, LoaiSoiCauController.deleteLoaiSoiCau);

app.get("/api/domains", authenticateToken, DomainController.getDomains);
app.post("/api/domains", authenticateToken, DomainController.createDomain);
app.put("/api/domains", authenticateToken, DomainController.updateDomain);
app.delete("/api/domains/:id", authenticateToken, DomainController.deleteDomain);

app.get("/api/autoGenNumbers", authenticateToken, autoGenNumbers);
app.get("/api/checkResult", authenticateToken, checkResult);
app.get("/api/soHangNgay", autoNumber);
app.get('/api/loTop/soHangNgay', LoTopService.autoNumber);
