const schedule = require("node-schedule");
const SoHangNgayService = require("./src/services/SoHangNgay");
const LoTopService = require("./src/services/LoTop");

schedule.scheduleJob("0 1 * * *", function () {
    console.log("Bắt đầu cho số");
    SoHangNgayService.autoGenNumbers();
    LoTopService.autoGenNumbers();
});

schedule.scheduleJob("0 19 * * *", function () {
    console.log("Bắt đầu check kết quả");
    SoHangNgayService.checkResult();
});
