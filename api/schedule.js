const schedule = require("node-schedule");
const SoHangNgayService = require("./src/services/SoHangNgay");
const LoTopService = require("./src/services/LoTop");
const SoiCauHangNgayService = require('./src/services/SoiCauHangNgay');
const logger = require('./src/configs/logger');

schedule.scheduleJob("0 1 * * *", function () {
    logger.info('BẮT ĐẦU CHO SỐ');
    SoHangNgayService.autoGenNumbers();
    LoTopService.autoGenNumbers();
    SoiCauHangNgayService.autoGenNumbers();
});

schedule.scheduleJob("35 18 * * *", function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    SoHangNgayService.checkResult();
    LoTopService.checkResult();
    SoiCauHangNgayService.checkResult(1);
});

schedule.scheduleJob("45 16 * * *", function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    SoiCauHangNgayService.checkResult(3);
});

schedule.scheduleJob("45 17 * * *", function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    SoiCauHangNgayService.checkResult(2);
});
