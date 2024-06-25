const schedule = require("node-schedule");
const SoHangNgayService = require("./src/services/SoHangNgay");
const LoTopService = require("./src/services/LoTop");
const SoiCauHangNgayService = require('./src/services/SoiCauHangNgay');
const ChuyenGiaChoSoService = require('./src/services/ChuyenGiaChoSo');
const logger = require('./src/configs/logger');
const { cache } = require("./src/configs/cache");

schedule.scheduleJob("0 1 * * *", async function () {
    logger.info('BẮT ĐẦU CHO SỐ');
    await SoHangNgayService.autoGenNumbers();
    await LoTopService.autoGenNumbers();
    await SoiCauHangNgayService.autoGenNumbers();
    await ChuyenGiaChoSoService.autoGenNumbers();
    cache.reset();
});

schedule.scheduleJob("35 18 * * *", async function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    await SoHangNgayService.checkResult();
    await LoTopService.checkResult();
    await SoiCauHangNgayService.checkResult(1);
    await ChuyenGiaChoSoService.checkResult();
    cache.reset();
});

schedule.scheduleJob("45 16 * * *", async function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    await SoiCauHangNgayService.checkResult(3);
    cache.reset();
});

schedule.scheduleJob("45 17 * * *", async function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    await SoiCauHangNgayService.checkResult(2);
    cache.reset();
});
