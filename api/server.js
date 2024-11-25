require("dotenv").config();
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("./database");
require("./schedule");
const logger = require("./src/configs/logger");
const LoaiSoiCauController = require("./src/controllers/LoaiSoiCau");
const DomainController = require("./src/controllers/Domain");
const UserTruyenController = require("./src/controllers/UserTruyen");
const ExpertController = require('./src/controllers/Expert');
const SoHangNgayService = require("./src/services/SoHangNgay");
const LoTopService = require('./src/services/LoTop');
const SoiCauHangNgayService = require('./src/services/SoiCauHangNgay');
// const ChuyenGiaChoSoService = require('./src/services/ChuyenGiaChoSo');
const { cache } = require("./src/configs/cache");
// const SoiCau888Org = require("./src/up-post-soicau/soicau888.org");
// const RBK666Mobi = require("./src/up-post-soicau/rongbachkim666.mobi");
// const RBK888Org = require("./src/up-post-soicau/rongbachkim888.org");

// Cấu hình Multer cho việc lưu trữ file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Thư mục lưu file
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        ); // Tên file
    },
});

const upload = multer({ storage: storage });

process.on("uncaughtException", (error) => {
    logger.error(error.stack);
});

const app = express();

if (process.env.MOD === "development") {
    app.use(cors());
}

app.use(
    express.json({
        limit: "40mb",
    })
);
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT, () => {
    console.log("Server is running on port: ", process.env.PORT);

    logger.info('STARTING SERVER');
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

app.get("/api/userTruyen", authenticateToken, UserTruyenController.getUserTruyens);
app.post("/api/userTruyen", UserTruyenController.createUserTruyen);
app.delete("/api/userTruyen/:id", authenticateToken, UserTruyenController.deleteUserTruyen);

app.get("/api/autoGenNumbers", authenticateToken, SoHangNgayService.autoGenNumbers);
app.get("/api/checkResult", authenticateToken, SoHangNgayService.checkResult);
app.get("/api/soHangNgay", SoHangNgayService.autoNumber);
app.get("/api/loTop/soHangNgay", LoTopService.autoNumber);
app.get("/api/loTop/getMultipleRs", LoTopService.getMultipleRs);
app.get("/api/loTop/checkResult", LoTopService.checkResult);

app.get("/api/soiCauHangNgay/autoGenNumbers", SoiCauHangNgayService.autoGenNumbers);
app.get("/api/soiCauHangNgay/soHangNgay", SoiCauHangNgayService.getSoiCauHangNgay);

app.get("/api/experts", authenticateToken, ExpertController.getExperts);
app.get("/api/experts/soHangNgay", ExpertController.soHangNgay);
app.get("/api/experts/:id", authenticateToken, ExpertController.getExpert);
app.post("/api/experts", upload.single('avatar'), authenticateToken, ExpertController.createExpert);
app.put("/api/experts", upload.single('avatar'), authenticateToken, ExpertController.updateExpert);
app.post("/api/experts/delete-multiple", authenticateToken, ExpertController.deleteExperts);
app.delete("/api/experts/:id", authenticateToken, ExpertController.deleteExpert);
 
app.get("/api/cache/keys", (_req, res) => {
    const keys = cache.getKeys();

    res.json(keys);
});
app.get("/api/cache/reset", authenticateToken, (_req, res) => {
    cache.reset();

    res.json('OK');
});
app.get("/api/logs", authenticateToken, (_req, res) => {
    const logDirectory = path.join(__dirname, 'logs');

    fs.readdir(logDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        
        const logFiles = files.filter(file => path.extname(file) === '.log');
        res.json(logFiles);
    });    
});
app.get('/api/logs/:fileName', authenticateToken, (req, res) => {
    const { fileName } = req.params;
    const logFilePath = path.join(__dirname, 'logs', fileName);

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found');
            }
            return res.status(500).send('Error reading file: ' + err);
        }

        const logLines = data.split('\n').filter(line => line.trim() !== '').map(line => {
            try {
                return JSON.parse(line);
            } catch (parseErr) {
                return { error: 'Invalid JSON', line };
            }
        });

        res.json(logLines);
    });
});

// SoiCau888Org.taoBaiVietMienBac();
// SoiCau888Org.taoBaiVietMienNam();
// SoiCau888Org.taoBaiVietMienTrung();

// RBK666Mobi.taoBaiVietMienBac();
// RBK666Mobi.taoBaiVietMienNam();
// RBK666Mobi.taoBaiVietMienTrung();

// RBK888Org.taoBaiVietMienBac();
// RBK888Org.taoBaiVietMienNam();
// RBK888Org.taoBaiVietMienTrung();
