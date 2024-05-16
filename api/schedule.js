const schedule = require("node-schedule");
const { autoGenNumbers, checkResult } = require("./src/services/SoHangNgay");

schedule.scheduleJob("0 1 * * *", function () {
    console.log("Bắt đầu cho số");
    autoGenNumbers();
});

schedule.scheduleJob("0 19 * * *", function () {
    console.log("Bắt đầu check kết quả");
    checkResult();
});
