const schedule = require("node-schedule");
const SoHangNgayService = require("./src/services/SoHangNgay");
const LoTopService = require("./src/services/LoTop");
const logger = require('./src/configs/logger');

schedule.scheduleJob("0 1 * * *", function () {
    logger.info('BẮT ĐẦU CHO SỐ');
    SoHangNgayService.autoGenNumbers();
    LoTopService.autoGenNumbers();
});

schedule.scheduleJob("35 18 * * *", function () {
    logger.info('BẮT ĐẦU CHECK KẾT QUẢ');
    SoHangNgayService.checkResult();
    LoTopService.checkResult();
});
