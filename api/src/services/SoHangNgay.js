const axios = require("axios");
const chalk = require("chalk");
const SoHangNgayModel = require("../models/SoHangNgay");
const LoaiSoiCauModel = require("../models/LoaiSoiCau");
const DomainModel = require("../models/Domain");
const { randomNumber } = require("../utils");
const { cache } = require("../configs/cache");
const { PRIZE, NUMBER_TYPE, ONE_DAY } = require("../constants");

const autoGenNumbers = async (_req, res) => {
    const loaiSoiCau = await LoaiSoiCauModel.find({});
    const domains = await DomainModel.find({});

    for (let i = 0; i < loaiSoiCau.length; i++) {
        const lSoiCau = loaiSoiCau[i].toObject();

        for (let i = 0; i < domains.length; i++) {
            const domain = domains[i].toObject();

            const today = new Date();
            today.setDate(today.getDate() - (lSoiCau.numberOfDays - 1));
            today.setHours(0, 0, 0, 0);

            const obj = await SoHangNgayModel.find({
                loaiSoiCauId: lSoiCau._id.toString(),
                domainId: domain._id.toString(),
                createdAt: { $gte: today },
            });

            if (obj.length > 0) {
                console.log(chalk.yellow("Đã tạo: ", lSoiCau.name));
            } else {
                const date = new Date();
                // date.setDate(date.getDate() - 1);
                date.setHours(1, 0, 0, 0);

                const newObj = new SoHangNgayModel({
                    loaiSoiCauId: lSoiCau._id.toString(),
                    domainId: domain._id.toString(),
                    number: randomNumber(lSoiCau.numberType, lSoiCau.quantity),
                    result: [],
                    createdAt: date,
                });

                await newObj.save();
                console.log(chalk.green("Tạo mới dàn số cho: ", lSoiCau.name));
            }
        }
    }

    if (res) {
        res.json({
            msg: "OK",
        });
    }
};

const checkResult = async (_req, res) => {
    const loaiSoiCau = await LoaiSoiCauModel.find({});
    const domains = await DomainModel.find({});

    const today = new Date();
    // if (today.getHours() < 19) {
    //     today.setDate(today.getDate() - 1);
    // }

    const ngay = `${today.getDate()}-${
        today.getMonth() + 1
    }-${today.getFullYear()}`;
    // const ngay = "15-5-2024";

    const response = await axios.get(
        `https://apixoso.com/api/kqxs?domain=1&ngay=${ngay}`
    );
    const ketqua = response.data.ketqua;
    delete ketqua.madacbiet;

    const lo = {};
    let de;
    let bacang;

    for (let giai in ketqua) {
        if (giai === "giaidacbiet") {
            de = ketqua[giai][0].slice(-2);
            bacang = ketqua[giai][0].slice(-3);
        }

        ketqua[giai].forEach((e) => {
            const num = e.slice(-2);

            if (lo[num]) {
                lo[num] = lo[num] + 1;
            } else {
                lo[num] = 1;
            }
        });
    }

    for (let i = 0; i < loaiSoiCau.length; i++) {
        const lSoiCau = loaiSoiCau[i].toObject();
        const numberType = lSoiCau.numberType;

        for (let j = 0; j < domains.length; j++) {
            const domain = domains[j].toObject();

            const d = new Date();
            d.setDate(d.getDate() - (lSoiCau.numberOfDays - 0));
            d.setHours(0, 0, 0, 0);

            const soCho = (
                await SoHangNgayModel.findOne({
                    loaiSoiCauId: lSoiCau._id.toString(),
                    domainId: domain._id.toString(),
                    createdAt: { $gte: d },
                }).sort({ createdAt: -1 })
            )?.toObject();

            if (!soCho) continue;

            const number = soCho.number.flat();

            if (soCho) {
                const today = new Date();
                // today.setDate(today.getDate() - 1);
                today.setHours(1, 0, 0, 0);

                const day = (today - new Date(soCho.createdAt)) / ONE_DAY;
                const prize = lSoiCau.prize;

                if (prize === PRIZE.LO) {
                    const newRs = soCho.result;
                    newRs[day] = [];

                    for (let s = 0; s < number.length; s++) {
                        const num = number[s];

                        if (lo[num]) {
                            newRs[day].push({
                                number: num,
                                times: lo[num],
                            });
                        }
                    }

                    await SoHangNgayModel.findByIdAndUpdate(
                        soCho._id.toString(),
                        {
                            result: newRs,
                            isWaiting: false,
                        },
                        {
                            new: true,
                        }
                    );
                }

                if (prize === PRIZE.DE) {
                    const newRs = soCho.result;
                    newRs[day] = [];

                    if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999) {
                        if (number.includes(bacang)) {
                            newRs[day].push({
                                number: bacang,
                                times: 1,
                                type: PRIZE.BA_CANG,
                            });
                        }

                        const danDe = number.map((e) => e.slice(-2));

                        if (danDe.includes(de)) {
                            newRs[day].push({
                                number: de,
                                times: 1,
                                type: PRIZE.DE,
                            });
                        }
                    } else {
                        if (number.includes(de)) {
                            newRs[day].push({
                                number: de,
                                times: 1,
                                type: PRIZE.DE,
                            });
                        }
                    }

                    await SoHangNgayModel.findByIdAndUpdate(
                        soCho._id.toString(),
                        {
                            result: newRs,
                            isWaiting: false,
                        },
                        {
                            new: true,
                        }
                    );
                }
            }
        }
    }

    if (res) {
        res.json({ ketqua, lo, de, bacang });
    }
};

const autoNumber = async (req, res) => {
    const { domain, loaiSoiCau, cvHtml, rows } = req.query;

    if (cache.isExist(`SO_HANG_NGAY_${domain}_${loaiSoiCau}_${+cvHtml}_${rows}`)) {
        res.json({
            html: cache.getKey(`SO_HANG_NGAY_${domain}_${loaiSoiCau}_${+cvHtml}_${rows}`)
        });
        return;
    }

    const domainObj = (await DomainModel.findOne({ name: domain }))?.toObject();
    const loaiSoiCauObj = (
        await LoaiSoiCauModel.findOne({ name: loaiSoiCau })
    )?.toObject();

    if (!domainObj || !loaiSoiCauObj) {
        res.json({
            html: "",
        });
        return;
    }

    const soHangNgay = await SoHangNgayModel.find({
        loaiSoiCauId: loaiSoiCauObj._id.toString(),
        domainId: domainObj._id.toString(),
    }).sort({ createdAt: -1 }).limit(rows ? +rows : 30);

    if (soHangNgay?.length === 0) {
        res.json({
            html: "",
        });
        return;
    }

    if (+cvHtml) {
        const html = `
            <table class="table-soi-cau">
                <thead>
                    <tr>
                        <th>Ngày</th>
                        <th>Số</th>
                        <th>Kết quả</th>
                    </tr>
                </thead>

                <tbody>
                    ${soHangNgay
                        .map((e) => {
                            const sHangNgay = e.toObject();

                            const d = new Date(sHangNgay.createdAt);
                            let ngay;

                            if (loaiSoiCauObj.numberOfDays === 1) {
                                ngay = `${d.getDate()}-${
                                    d.getMonth() + 1
                                }-${d.getFullYear()}`;
                            } else {
                                const endDate = new Date();

                                endDate.setDate(d.getDate() + (loaiSoiCauObj.numberOfDays - 1));

                                ngay = `${d.getDate()} → ${endDate.getDate()}-${
                                    d.getMonth() + 1
                                }-${d.getFullYear()}`;
                            }

                            let rsHtml = "";

                            if (!sHangNgay.isWaiting) {
                                if (loaiSoiCauObj.numberOfDays === 1) {
                                    const rs = sHangNgay.result[0];

                                    if (rs.length === 0) {
                                        rsHtml =
                                            '<span class="truot">Trượt</span>';
                                    } else {
                                        rsHtml =
                                            "Ăn " +
                                            rs
                                                .map((e) => {
                                                    if (
                                                        e?.type ===
                                                        PRIZE.DE
                                                    ) {
                                                        return `<span class="number_return de">đề ${e.number}</span>`;
                                                    }

                                                    if (
                                                        e?.type ===
                                                        PRIZE.BA_CANG
                                                    ) {
                                                        return `<span class="number_return ba_cang">ba càng ${e.number}</span>`;
                                                    }

                                                    return `<span class="number_return">${e.number}</span> <span class="number_times">${e.times}</span> nháy`;
                                                })
                                                .join(", ");
                                    }
                                } else {
                                    const rs = sHangNgay.result;

                                    while (rs.length < loaiSoiCauObj.numberOfDays) {
                                        rs.push(null);
                                    }

                                    rsHtml = rs
                                        .map((e, i) => {
                                            if (!e) {
                                                return `
                                                    <div class="ket-qua-ngay ket-qua-ngay-${i + 1}">
                                                        Ngày ${i + 1}: <span style="color: #ff8b00;" class="cho-ket-qua">Chờ kết quả...</span>
                                                    </div>
                                                `;
                                            }

                                            return `
                                            <div class="ket-qua-ngay ket-qua-ngay-${
                                                i + 1
                                            }">
                                                Ngày ${i + 1}: ${
                                                e.length === 0
                                                    ? '<span class="truot">Trượt</span>'
                                                    : e.map(() => {
                                                        return (
                                                            "Ăn " +
                                                            e
                                                                .map(
                                                                    (
                                                                        rsByDay
                                                                    ) => {
                                                                        if (
                                                                            rsByDay?.type ===
                                                                            PRIZE.DE
                                                                        ) {
                                                                            return `<span class="number_return de">đề ${rsByDay.number}</span>`;
                                                                        }

                                                                        if (
                                                                            rsByDay?.type ===
                                                                            PRIZE.BA_CANG
                                                                        ) {
                                                                            return `<span class="number_return ba_cang">ba càng ${rsByDay.number}</span>`;
                                                                        }

                                                                        return `<span class="number_return">${rsByDay.number}</span> <span class="number_times">${rsByDay.times}</span> nháy`;
                                                                    }
                                                                )
                                                                .join(
                                                                    ", "
                                                                )
                                                        );
                                                    })
                                            }
                                            </div>
                                        `;
                                        })
                                        .join("");
                                }
                            }

                            return `
                                <tr>
                                    <td>
                                        <span class="table-soi-cau-ngay">${ngay}</span>
                                    </td>
                                    <td>
                                        <span class="table-soi-cau-number">
                                            ${loaiSoiCauObj.numberType === NUMBER_TYPE.CAP_SO_DAO
                                                ? sHangNgay.number.map((e) => {
                                                    return `(${e.join(" - ")})`;
                                                })
                                                : sHangNgay.number.join(" - ")}
                                        </span>
                                    </td>
                                    <td>${
                                        sHangNgay.isWaiting
                                            ? "Chờ kết quả..."
                                            : rsHtml
                                    }</td>
                                </tr>                                    
                            `;
                        })
                        .join("")}
                    
                </tbody>
            </table>
        `;

        cache.setKey(`SO_HANG_NGAY_${domain}_${loaiSoiCau}_${+cvHtml}_${rows}`, html);

        res.json({
            html: html,
        });
    } else {
        res.json(soHangNgay);
    }
};

module.exports = {
    autoGenNumbers,
    checkResult,
    autoNumber,
};
