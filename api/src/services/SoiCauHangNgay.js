const { default: axios } = require("axios");
const { DOMAINS, LICH_QUAY_THUONG, NUMBER_TYPE } = require("../constants");
const DomainModel = require("../models/Domain");
const SoiCauHangNgayModel = require("../models/SoiCauHangNgay");
const { randomNumber } = require("../utils");

const autoGenNumbers = async (_req, res) => {
    const domains = await DomainModel.find({});

    // domain này là domain website, ví dụ soilokhung247
    for (let i = 0; i < domains.length; i++) {
        const today = new Date();
        // today.setDate(today.getDate() - 1);
        today.setHours(0, 0, 0, 0);
        const day = today.getDay();
        const domain = domains[i].toObject();

        // i là domain đại diện cho 3 tỉnh Bắc trung nam
        for (let i = 1; i <= 3; i++) {
            if (i === DOMAINS.MienBac) {
                const find = await SoiCauHangNgayModel.findOne({
                    domain: i,
                    domainId: domain._id.toString(),
                    createdAt: { $gte: today },
                });

                if (!find) {
                    today.setHours(1, 0, 0, 0);

                    const soiCauMienBac = new SoiCauHangNgayModel({
                        domainId: domain._id.toString(),
                        domain: 1,
                        province: "",
                        numbers: {
                            giaidacbiet: {
                                dau: {
                                    number: randomNumber(
                                        NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9,
                                        1
                                    )[0],
                                },
                                duoi: {
                                    number: randomNumber(
                                        NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9,
                                        1
                                    )[0],
                                },
                            },
                            bachthulodepnhat: randomNumber(
                                NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                                1
                            ).map((e) => {
                                return {
                                    number: e,
                                };
                            }),
                            songthulodepnhat: randomNumber(
                                NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                                2
                            ).map((e) => {
                                return {
                                    number: e,
                                };
                            }),
                            lokepdepnhat: randomNumber(
                                NUMBER_TYPE.SO_KEP,
                                2
                            ).map((e) => {
                                return {
                                    number: e,
                                };
                            }),
                            loxien2xien3depnhat: randomNumber(
                                NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                                5
                            ).map((e) => {
                                return {
                                    number: e,
                                };
                            }),
                            cau3canglodepnhat: randomNumber(
                                NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999,
                                3
                            ).map((e) => {
                                return {
                                    number: e,
                                };
                            }),
                        },
                        isWaiting: true,
                        createdAt: today,
                    });

                    await soiCauMienBac.save();
                }
            } else {
                const provinces = LICH_QUAY_THUONG[day][i];

                for (let p = 0; p < Object.keys(provinces).length; p++) {
                    const province = Object.keys(provinces)[p];

                    today.setHours(1, 0, 0, 0);

                    const find = await SoiCauHangNgayModel.findOne({
                        domain: i,
                        province: province,
                        domainId: domain._id.toString(),
                        createdAt: { $gte: today },
                    });

                    if (!find) {
                        const res = await axios.get(
                            `https://apixoso.com/api/thong-ke/v2/soicaumb/thong-ke-loto?domain=${i}&province=${province}`
                        );
                        const thongkeloto = res.data;

                        const soicauTinh = new SoiCauHangNgayModel({
                            domainId: domain._id.toString(),
                            domain: i,
                            province: province,
                            numbers: {
                                giaidacbiet: {
                                    dau: {
                                        number: randomNumber(
                                            NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9,
                                            1
                                        )[0],
                                    },
                                    duoi: {
                                        number: randomNumber(
                                            NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9,
                                            1
                                        )[0],
                                    },
                                },
                                caulotoVip: randomNumber(
                                    NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                                    2
                                ).map((e) => {
                                    return {
                                        number: e,
                                    };
                                }),
                                lotoXien: randomNumber(
                                    NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                                    8
                                ).map((e) => {
                                    return {
                                        number: e,
                                    };
                                }),
                                lotovenhieu: thongkeloto.lotoVeNhieu.map(
                                    (e) => {
                                        return {
                                            number: e,
                                        };
                                    }
                                ),
                                lotolaukhongve: thongkeloto.lotoLauKhongVe.map(
                                    (e) => {
                                        return {
                                            number: e,
                                        };
                                    }
                                ),
                            },
                            isWaiting: true,
                            createdAt: today,
                        });
                        await soicauTinh.save();
                    }
                }
            }
        }
    }

    res.json({
        msg: "OK",
    });
};

const getSoiCauHangNgay = async (req, res) => {
    const { domain, cvHtml, site } = req.query;

    const domainObj = (await DomainModel.findOne({ name: site }))?.toObject();

    if (!domainObj) {
        res.status(404).json({
            html: "",
        });
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const find = await SoiCauHangNgayModel[+domain === DOMAINS.MienBac ? 'findOne' : 'find']({
        domain,
        domainId: domainObj._id.toString(),
        createdAt: { $gte: today },
    });

    if (!find) {
        res.status(404).json({
            html: "",
        });
        return;
    }

    if (+cvHtml) {
        let html = ``;
       
        if (+domain === DOMAINS.MienBac) {
            const scDaily = find.toObject();

            html += `
                <table id="soi-cau-hang-ngay" class="table table-sm table-striped text-center table-bordered">
                    <tbody>
                        <tr>
                            <td style="width: 50%">Giải đặc biệt</td>
                            <td><b class="text-red">Đầu 4 , Đuôi 8</b></td>
                        </tr>
                        <tr>
                            <td>Bạch thủ lô đẹp nhất</td>
                            <td>
                                <b class="text-red">
                                    ${scDaily.numbers.bachthulodepnhat[0].number}
                                </b>
                            </td>
                        </tr>
                        <tr>
                            <td>Song thủ lô đẹp nhất</td>
                            <td style="color: red; font-weight: bolder;">
                                ${scDaily.numbers.songthulodepnhat[0].number} - 
                                ${scDaily.numbers.songthulodepnhat[1].number}
                            </td>
                        </tr>
                        <tr>
                            <td>Lô kép đẹp nhất</td>
                            <td style="color: red; font-weight: bolder;">
                                ${scDaily.numbers.lokepdepnhat[0].number} - 
                                ${scDaily.numbers.lokepdepnhat[1].number}
                            </td>
                        </tr>
                        <tr>
                            <td>Lô xiên 2, xiên 3 đẹp nhất</td>
                            <td style="color: red; font-weight: bolder;">
                                (${scDaily.numbers.loxien2xien3depnhat[0].number} - 
                                ${scDaily.numbers.loxien2xien3depnhat[1].number})
                                (${scDaily.numbers.loxien2xien3depnhat[2].number} - 
                                ${scDaily.numbers.loxien2xien3depnhat[3].number} - 
                                ${scDaily.numbers.loxien2xien3depnhat[4].number})
                            </td>
                        </tr>
                        <tr>
                            <td>Cầu 3 càng lô đẹp nhất</td>
                            <td style="color: red; font-weight: bolder;">
                                ${scDaily.numbers.cau3canglodepnhat[0].number} - 
                                ${scDaily.numbers.cau3canglodepnhat[1].number} - 
                                ${scDaily.numbers.cau3canglodepnhat[2].number}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="pd10">
                                <p>Mời anh em nhận <b>con số đẹp nhất</b> cho mình trong ngày ${today.getDate().toString().padStart(2, '0')}/${today.getMonth().toString().padStart(2, '0')}/${today.getFullYear()}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <div class="text-center pd10">
                                    <button class="btn btn-danger" id="chotso_rbk">BẤM ĐỂ NHẬN SỐ</button>
                                    <strong class="d-none">Cặp số sẽ xuất hiện sau <span id="countDown" class="text-danger"></span>
                                        giây bạn nhé</strong>
                                    <strong class="d-none">Cặp số đẹp ngày ${today.getDate().toString().padStart(2, '0')}/${today.getMonth().toString().padStart(2, '0')}/${today.getFullYear()} là: <span id="showResult" class="text-danger"></span></strong>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>            
            `;
        } else {
            for (let i = 0; i < find.length; i++) {
                const scDaily = find[i].toObject();

                html += `
                    <table class="table table-prediction" width="100%">
                        <thead>
                            <tr>
                                <th class="text-center prediction-title" colspan="2">Thống kê vip xổ số ${scDaily.province}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="name">Đặc biệt:</td>
                                <td class="value">
                                    Đầu ${scDaily.numbers.giaidacbiet.dau.number} , 
                                    Đuôi ${scDaily.numbers.giaidacbiet.duoi.number}
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Cầu Loto VIP:</td>
                                <td class="value">
                                    ${scDaily.numbers.caulotoVip[0].number} - 
                                    ${scDaily.numbers.caulotoVip[1].number}
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Loto Xiên:</td>
                                <td class="value">
                                    (${scDaily.numbers.lotoXien[0].number} - ${scDaily.numbers.lotoXien[1].number})
                                    (${scDaily.numbers.lotoXien[2].number} - ${scDaily.numbers.lotoXien[3].number})
                                    (${scDaily.numbers.lotoXien[4].number} - ${scDaily.numbers.lotoXien[5].number})
                                    (${scDaily.numbers.lotoXien[6].number} - ${scDaily.numbers.lotoXien[7].number})
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Loto về nhiều:</td>
                                <td class="value">
                                    ${scDaily.numbers.lotovenhieu[0].number} - 
                                    ${scDaily.numbers.lotovenhieu[1].number} - 
                                    ${scDaily.numbers.lotovenhieu[2].number} - 
                                    ${scDaily.numbers.lotovenhieu[3].number}
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Loto lâu không về:</td>
                                <td class="value">
                                    ${scDaily.numbers.lotolaukhongve[0].number} - 
                                    ${scDaily.numbers.lotolaukhongve[1].number} - 
                                    ${scDaily.numbers.lotolaukhongve[2].number} - 
                                    ${scDaily.numbers.lotolaukhongve[3].number}
                                </td>
                            </tr>
                        </tbody>
                    </table>            
                `;
            }
        }

        res.json({
            html,
        })
    } else {
        res.json(find);
    }
};

/**
 * b1: lấy ra bộ số đã cho hôm nay (miền bắc và các tỉnh Trung Nam)
 * b2: lấy được kqxs của ngày hôm nay (miền bắc và theo các tỉnh Trung Nam);
 * b3: check kết quả
 * b4: update database
 */

const checkResult = async (domain) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // today.setDate(today.getDate() - 1);
    const ngay = `${today.getDate()}-${
        today.getMonth() + 1
    }-${today.getFullYear()}`;

    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);
    // endTime.setDate(endTime.getDate() - 1);

    if (domain === DOMAINS.MienBac) {
        const kqxs = await axios.get(
            `https://apixoso.com/api/kqxs?domain=1&ngay=${ngay}`
        );
        const ketqua = kqxs.data.ketqua;
        delete ketqua.madacbiet;
        const giaidacbiet = ketqua.giaidacbiet[0].slice(-2);
        const lo = Object.values(ketqua)
            .flat()
            .map((e) => {
                return e.slice(-2);
            })
            .reduce((pre, cr) => {
                return {
                    ...pre,
                    [cr]: pre[cr] ? pre[cr] + 1 : 1,
                };
            }, {});

        const bacang = Object.values(ketqua)
            .flat()
            .map((e) => {
                return e.slice(-3);
            });

        const soiCauHangNgay = await SoiCauHangNgayModel.find({
            domain: DOMAINS.MienBac,
            createdAt: {
                $gte: today,
                $lte: endTime,
            },
        });

        if (!soiCauHangNgay.length === 0) return;

        for (let i = 0; i < soiCauHangNgay.length; i++) {
            const scDaily = soiCauHangNgay[i].toObject();

            for (let key in scDaily.numbers) {
                if (key === "giaidacbiet") {
                    const dau = scDaily.numbers[key].dau.number;
                    const duoi = scDaily.numbers[key].duoi.number;

                    if (giaidacbiet[0] === dau) {
                        scDaily.numbers.giaidacbiet.dau.win = true;
                        scDaily.numbers.giaidacbiet.dau.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.dau.win = false;
                    }

                    if (giaidacbiet[1] === duoi) {
                        scDaily.numbers.giaidacbiet.duoi.win = true;
                        scDaily.numbers.giaidacbiet.duoi.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.duoi.win = false;
                    }
                } else if (key === "cau3canglodepnhat") {
                    scDaily.numbers[key].forEach(({ number }, index) => {
                        if (bacang.includes(number)) {
                            scDaily.numbers[key][index].win = true;
                        } else {
                            scDaily.numbers[key][index].win = false;
                        }
                    });
                } else {
                    scDaily.numbers[key].forEach(({ number }, index) => {
                        if (lo[number]) {
                            scDaily.numbers[key][index].win = true;
                            scDaily.numbers[key][index].times = lo[number];
                        } else {
                            scDaily.numbers[key][index].win = false;
                        }
                    });
                }
            }

            await SoiCauHangNgayModel.findByIdAndUpdate(
                scDaily._id.toString(),
                {
                    ...scDaily,
                    isWaiting: false,
                },
                {
                    new: true,
                }
            );
        }
    } else {
        const soiCauHangNgay = await SoiCauHangNgayModel.find({
            domain,
            createdAt: {
                $gte: today,
                $lte: endTime,
            },
        });

        for (let i = 0; i < soiCauHangNgay.length; i++) {
            const scDaily = soiCauHangNgay[i].toObject();

            const kqxs = await axios.get(
                `https://apixoso.com/api/kqxs?domain=${scDaily.domain}&ngay=${ngay}&province=${scDaily.province}`
            );
            const ketqua = kqxs.data.ketqua;
            const giaidacbiet = ketqua.giaidacbiet[0].slice(-2);
            const lo = Object.values(ketqua)
                .flat()
                .map((e) => {
                    return e.slice(-2);
                });

            for (let key in scDaily.numbers) {
                if (key === "giaidacbiet") {
                    const dau = scDaily.numbers[key].dau.number;
                    const duoi = scDaily.numbers[key].duoi.number;

                    if (giaidacbiet[0] === dau) {
                        scDaily.numbers.giaidacbiet.dau.win = true;
                        scDaily.numbers.giaidacbiet.dau.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.dau.win = false;
                    }

                    if (giaidacbiet[1] === duoi) {
                        scDaily.numbers.giaidacbiet.duoi.win = true;
                        scDaily.numbers.giaidacbiet.duoi.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.duoi.win = false;
                    }
                } else {
                    scDaily.numbers[key].forEach(({ number }, index) => {
                        if (lo.includes(number)) {
                            scDaily.numbers[key][index].win = true;
                        } else {
                            scDaily.numbers[key][index].win = false;
                        }
                    });
                }
            }

            await SoiCauHangNgayModel.findByIdAndUpdate(
                scDaily._id.toString(),
                {
                    ...scDaily,
                    isWaiting: false,
                },
                {
                    new: true,
                }
            );
        }
    }
};

module.exports = {
    autoGenNumbers,
    getSoiCauHangNgay,
    checkResult,
};
