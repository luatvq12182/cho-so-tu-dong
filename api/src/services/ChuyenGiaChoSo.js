const { default: axios } = require("axios");
const logger = require("../configs/logger");
const ExpertService = require("./Expert");
const DomainService = require("./Domain");
const ChuyenGiaChoSoModel = require("../models/ChuyenGiaChoSo");
const ExpertModel = require("../models/Expert");
const { randomNumber, sleep } = require("../utils");
const { CHECK_TYPE } = require("../constants");

const checkExist = async (expertId, domainId, date) => {
    const startTime = new Date(date.getTime());
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date.getTime());
    endTime.setHours(23, 59, 59, 999);

    const find = await ChuyenGiaChoSoModel.findOne({
        expertId,
        domainId,
        createdAt: {
            $gte: startTime,
            $lte: endTime,
        },
    });

    if (find) {
        console.log("Created");
        return true;
    } else {
        console.log("Not created yet");
        return false;
    }
};

const genNumberExpert = async (expert, domain, date) => {
    const domainId = domain._id.toString();
    const expertId = expert._id.toString();

    const isExist = await checkExist(expertId, domainId, date);

    if (isExist) {
        return;
    }

    const soicau = expert.soicau;

    const giveNumbers = [];

    for (let s = 0; s < soicau.length; s++) {
        const { numberType, quantity } = soicau[s];

        const randomNumbers = randomNumber(+numberType, +quantity);

        giveNumbers.push({
            ...soicau[s],
            numbers: randomNumbers.flat().map((e) => {
                return {
                    number: e,
                };
            }),
        });
    }

    const newObj = new ChuyenGiaChoSoModel({
        domainId,
        expertId,
        giveNumbers,
        isWaiting: true,
        createdAt: date,
    });

    await newObj.save();
};

const calWinningRate = async (expertId, domainId) => {
    const find = await ChuyenGiaChoSoModel.find({
        expertId,
        domainId,
    });
    let expert = await ExpertService.getExpert(expertId);
    let domain = await DomainService.getDomain(domainId);

    if (!expert || !domain) {
        return;
    }

    if (find) {
        let win = 0;
        let total = 0;

        for (let i = 0; i < find.length; i++) {
            const chuyenGiaChoSo = find[i].toObject();
            const giveNumbers = chuyenGiaChoSo.giveNumbers;
            total += giveNumbers.length;

            chuyenGiaChoSo.giveNumbers.forEach((giveNumber) => {
                const isWin = giveNumber.numbers.some((e) => e.win);

                if (isWin) {
                    win++;
                }
            });
        }

        expert = expert.toObject();
        domain = domain.toObject();

        await ExpertModel.findByIdAndUpdate(
            expert._id.toString(),
            {
                ...expert,
                metadata: {
                    ...(expert.metadata || {}),
                    winRate: {
                        ...(expert?.metadata?.winRate || {}),
                        [domain.name]: (win / total) * 100,
                    },
                },
            },
            {
                new: true,
            }
        );

        console.log(
            `Expert: ${expert.name} - Site: ${domain.name}`,
            (win / total) * 100 + "%"
        );
    }
};

const checkRsByDate = async (expertId, domainId, date) => {
    const startTime = new Date(date.getTime());
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date.getTime());
    endTime.setHours(23, 59, 59, 999);

    const find = await ChuyenGiaChoSoModel.findOne({
        expertId,
        domainId,
        createdAt: {
            $gte: startTime,
            $lte: endTime,
        },
    });

    if (find) {
        const [d, m, y] = (() => {
            return [date.getDate(), date.getMonth() + 1, date.getFullYear()];
        })();
        const ngay = `${d}-${m}-${y}`;
        const response = await axios.get(
            `https://apixoso.com/api/kqxs?domain=1&ngay=${ngay}`
        );
        if (!response.data) return;
        const ketqua = response.data.ketqua;
        delete ketqua.madacbiet;

        const lo = {};
        let bacanglo = {};
        let de;
        let bacangde;

        for (let giai in ketqua) {
            if (giai === "giaidacbiet") {
                de = ketqua[giai][0].slice(-2);
                bacangde = ketqua[giai][0].slice(-3);
            }

            ketqua[giai].forEach((e) => {
                const num = e.slice(-2);
                bacanglo[e.slice(-3)] = e.slice(-3);

                if (lo[num]) {
                    lo[num] = lo[num] + 1;
                } else {
                    lo[num] = 1;
                }
            });
        }

        const giveNumbers = find.toObject().giveNumbers;

        for (let g = 0; g < giveNumbers.length; g++) {
            const giveNumber = giveNumbers[g];
            const { checkType, numbers } = giveNumber;

            switch (+checkType) {
                case CHECK_TYPE.LO:
                    numbers.forEach(({ number }, i) => {
                        if (lo[number]) {
                            numbers[i].win = true;
                            numbers[i].times = lo[number];
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE.LO_DAU:
                    numbers.forEach(({ number }, i) => {
                        const returnNumbers = [];

                        Object.keys(lo).forEach((loNumber) => {
                            const soDau = loNumber[0];

                            if (
                                soDau === number &&
                                !returnNumbers.includes(loNumber)
                            ) {
                                returnNumbers.push(loNumber);
                            }
                        });

                        if (returnNumbers.length > 0) {
                            numbers[i].win = true;
                            numbers[i].returnNumbers = returnNumbers;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE.LO_DUOI:
                    numbers.forEach(({ number }, i) => {
                        const returnNumbers = [];

                        Object.keys(lo).forEach((loNumber) => {
                            const soDuoi = loNumber[1];

                            if (
                                soDuoi === number &&
                                !returnNumbers.includes(loNumber)
                            ) {
                                returnNumbers.push(loNumber);
                            }
                        });

                        if (returnNumbers.length > 0) {
                            numbers[i].win = true;
                            numbers[i].returnNumbers = returnNumbers;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE["3_CANG_LO"]:
                    numbers.forEach(({ number }, i) => {
                        if (bacanglo[number]) {
                            numbers[i].win = true;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE.DE:
                    numbers.forEach(({ number }, i) => {
                        if (number === de) {
                            numbers[i].win = true;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE.DE_DAU:
                    numbers.forEach(({ number }, i) => {
                        if (number == de[0]) {
                            numbers[i].win = true;
                            numbers[i].returnNumber = de;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE.DE_DUOI:
                    numbers.forEach(({ number }, i) => {
                        if (number == de[1]) {
                            numbers[i].win = true;
                            numbers[i].returnNumber = de;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                case CHECK_TYPE["3_CANG_DE"]:
                    numbers.forEach(({ number }, i) => {
                        if (bacangde[number]) {
                            numbers[i].win = true;
                        } else {
                            numbers[i].win = false;
                        }
                    });
                    break;

                default:
                    break;
            }

            await ChuyenGiaChoSoModel.findByIdAndUpdate(
                find.toObject()._id.toString(),
                {
                    ...find.toObject(),
                    giveNumbers,
                    isWaiting: false,
                },
                {
                    new: true,
                }
            );
        }
    }
};

const autoGenNumbers = async () => {
    try {
        const experts = await ExpertService.getExperts();

        for (let e = 0; e < experts.length; e++) {
            const expert = experts[e].toObject();
            const domains = expert.sites;

            for (let d = 0; d < domains.length; d++) {
                const domain = await DomainService.getDomain(domains[d]);

                if (!domain) continue;

                try {
                    const today = new Date();
                    today.setHours(1, 0, 0, 0);

                    for (let n = 0; n < 60; n++) {
                        today.setDate(today.getDate() - 1);

                        await genNumberExpert(expert, domain.toObject(), today);
                    }
                } catch (error) {
                    logger.error(error.stack);
                }
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
};

const checkResult = async () => {
    try {
        const experts = await ExpertService.getExperts();

        for (let e = 0; e < experts.length; e++) {
            const expert = experts[e];
            const sites = expert.sites;

            for (let s = 0; s < sites.length; s++) {
                const site = sites[s];

                const checkDate = new Date();

                for (let d = 0; d < 60; d++) {
                    console.log(
                        " ----------------------- ",
                        checkDate.toISOString(),
                        " ----------------------- "
                    );
                    checkDate.setDate(checkDate.getDate() - 1);

                    await checkRsByDate(
                        expert.toObject()._id.toString(),
                        sites[s],
                        checkDate
                    );

                    await sleep(500);
                }

                console.log(`Check Done ${expert.toObject().name}:${site}`);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const updateWinningRate = async () => {
    try {
        const experts = await ExpertService.getExperts();

        for (let e = 0; e < experts.length; e++) {
            const expert = experts[e];
            const sites = expert.sites;

            for (let s = 0; s < sites.length; s++) {
                const site = sites[s];

                await calWinningRate(expert.toObject()._id.toString(), site);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    autoGenNumbers,
    checkResult,
    updateWinningRate,
};
