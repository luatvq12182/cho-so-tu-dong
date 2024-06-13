const { default: axios } = require("axios");
const { DOMAINS, LICH_QUAY_THUONG, NUMBER_TYPE } = require("../constants");
const DomainModel = require("../models/Domain");
const SoiCauHangNgayModel = require("../models/SoiCauHangNgay");
const { randomNumber, genHtmlValue } = require("../utils");
const { cache } = require("../configs/cache");

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
                                NUMBER_TYPE.CAP_SO_DAO,
                                1
                            ).flat().map((e) => {
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

    if (cache.isExist(`SOI_CAU_HANG_NGAY_${domain}_${site}_${+cvHtml}`)) {
        res.json({
            html: cache.getKey(`SOI_CAU_HANG_NGAY_${domain}_${site}_${+cvHtml}`)
        });
        return;
    }

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
                            <td class="name" style="width: 50%">Giải đặc biệt</td>
                            <td class="value">
                                Đầu ${genHtmlValue(scDaily.numbers.giaidacbiet.dau, true)} , 
                                Đuôi ${genHtmlValue(scDaily.numbers.giaidacbiet.duoi, true)}
                            </td>
                        </tr>
                        <tr>
                            <td class="name">Bạch thủ lô đẹp nhất</td>
                            <td class="value">
                                ${genHtmlValue(scDaily.numbers.bachthulodepnhat[0])}
                            </td>
                        </tr>
                        <tr>
                            <td class="name">Song thủ lô đẹp nhất</td>
                            <td class="value">
                                ${genHtmlValue(scDaily.numbers.songthulodepnhat[0])} - 
                                ${genHtmlValue(scDaily.numbers.songthulodepnhat[1])}
                            </td>
                        </tr>
                        <tr>
                            <td class="name">Lô kép đẹp nhất</td>
                            <td class="value">
                                ${genHtmlValue(scDaily.numbers.lokepdepnhat[0])} - 
                                ${genHtmlValue(scDaily.numbers.lokepdepnhat[1])}
                            </td>
                        </tr>
                        <tr>
                            <td class="name">Lô xiên 2, xiên 3 đẹp nhất</td>
                            <td class="value">
                                (${genHtmlValue(scDaily.numbers.loxien2xien3depnhat[0])} - 
                                ${genHtmlValue(scDaily.numbers.loxien2xien3depnhat[1])})
                                (${genHtmlValue(scDaily.numbers.loxien2xien3depnhat[2])} - 
                                ${genHtmlValue(scDaily.numbers.loxien2xien3depnhat[3])} - 
                                ${genHtmlValue(scDaily.numbers.loxien2xien3depnhat[4])})
                            </td>
                        </tr>
                        <tr>
                            <td class="name">Cầu 3 càng lô đẹp nhất</td>
                            <td class="value">
                                ${genHtmlValue(scDaily.numbers.cau3canglodepnhat[0])} - 
                                ${genHtmlValue(scDaily.numbers.cau3canglodepnhat[1])} - 
                                ${genHtmlValue(scDaily.numbers.cau3canglodepnhat[2])}
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
                                    Đầu ${genHtmlValue(scDaily.numbers.giaidacbiet.dau, true)} , 
                                    Đuôi ${genHtmlValue(scDaily.numbers.giaidacbiet.duoi, true)}
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Cầu Loto VIP:</td>
                                <td class="value">
                                    ${genHtmlValue(scDaily.numbers.caulotoVip[0])} - 
                                    ${genHtmlValue(scDaily.numbers.caulotoVip[1])}
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Loto Xiên:</td>
                                <td class="value">
                                    (${genHtmlValue(scDaily.numbers.lotoXien[0])} - ${genHtmlValue(scDaily.numbers.lotoXien[1])})
                                    (${genHtmlValue(scDaily.numbers.lotoXien[2])} - ${genHtmlValue(scDaily.numbers.lotoXien[3])})
                                    (${genHtmlValue(scDaily.numbers.lotoXien[4])} - ${genHtmlValue(scDaily.numbers.lotoXien[5])})
                                    (${genHtmlValue(scDaily.numbers.lotoXien[6])} - ${genHtmlValue(scDaily.numbers.lotoXien[7])})
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Loto về nhiều:</td>
                                <td class="value">
                                    ${genHtmlValue(scDaily.numbers.lotovenhieu[0])} - 
                                    ${genHtmlValue(scDaily.numbers.lotovenhieu[1])} - 
                                    ${genHtmlValue(scDaily.numbers.lotovenhieu[2])} - 
                                    ${genHtmlValue(scDaily.numbers.lotovenhieu[3])}
                                </td>
                            </tr>
                            <tr>
                                <td class="name">Loto lâu không về:</td>
                                <td class="value">
                                    ${genHtmlValue(scDaily.numbers.lotolaukhongve[0])} - 
                                    ${genHtmlValue(scDaily.numbers.lotolaukhongve[1])} - 
                                    ${genHtmlValue(scDaily.numbers.lotolaukhongve[2])} - 
                                    ${genHtmlValue(scDaily.numbers.lotolaukhongve[3])}
                                </td>
                            </tr>
                        </tbody>
                    </table>            
                `;
            }
        }

        cache.setKey(`SOI_CAU_HANG_NGAY_${domain}_${site}_${+cvHtml}`, html);

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

                    if (+giaidacbiet[0] === +dau) {
                        scDaily.numbers.giaidacbiet.dau.win = true;
                        scDaily.numbers.giaidacbiet.dau.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.dau.win = false;
                    }

                    if (+giaidacbiet[1] === +duoi) {
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
                })
                .reduce((pre, cr) => {
                    return {
                        ...pre,
                        [cr]: pre[cr] ? pre[cr] + 1 : 1,
                    };
                }, {});

            for (let key in scDaily.numbers) {
                if (key === "giaidacbiet") {
                    const dau = scDaily.numbers[key].dau.number;
                    const duoi = scDaily.numbers[key].duoi.number;

                    if (+giaidacbiet[0] === +dau) {
                        scDaily.numbers.giaidacbiet.dau.win = true;
                        scDaily.numbers.giaidacbiet.dau.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.dau.win = false;
                    }

                    if (+giaidacbiet[1] === +duoi) {
                        scDaily.numbers.giaidacbiet.duoi.win = true;
                        scDaily.numbers.giaidacbiet.duoi.returnNumber = giaidacbiet;
                    } else {
                        scDaily.numbers.giaidacbiet.duoi.win = false;
                    }
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
    }
};

module.exports = {
    autoGenNumbers,
    getSoiCauHangNgay,
    checkResult,
};
