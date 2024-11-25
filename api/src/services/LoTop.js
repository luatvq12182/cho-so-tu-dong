const axios = require("axios");
const chalk = require("chalk");
const LoTopModel = require("../models/LoTop");
const DomainModel = require("../models/Domain");
const { cache } = require("../configs/cache");

const autoGenNumbers = async (_req, res) => {
    const domains = await DomainModel.find({});

    for (let i = 0; i < domains.length; i++) {
        const domain = domains[i].toObject();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const obj = await LoTopModel.find({
            domainId: domain._id.toString(),
            createdAt: { $gte: today },
        });

        if (obj.length > 0) {
            // console.log(chalk.yellow("Đã tạo Lô top hôm nay"));
        } else {
            let array = [];
            for (let i = 0; i < 100; i++) {
                array.push(i.toString().padStart(2, "0"));
            }

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            let shuffledArray = shuffle(array);

            const date = new Date();
            date.setHours(1, 0, 0, 0);

            const newObj = new LoTopModel({
                domainId: domain._id.toString(),
                numbers: shuffledArray.map((e) => {
                    return {
                        number: e,
                    };
                }),
                createdAt: date,
            });

            await newObj.save();
        }
    }

    if (res) {
        res.json({
            msg: "OK",
        });
    }
};

const checkResult = async (req, res) => {
    try {
        const domains = await DomainModel.find({});

        const today = new Date();
        // if (today.getHours() < 19) {
        //     today.setDate(today.getDate() - 1);
        // }

        const ngay = `${today.getDate()}-${
            today.getMonth() + 1
        }-${today.getFullYear()}`;

        const kqxs = await axios.get(
            `https://apixoso.com/api/kqxs?domain=1&ngay=${ngay}`
        );
        const ketqua = kqxs.data.ketqua;
        delete ketqua.madacbiet;

        const lo = {};

        for (let giai in ketqua) {
            ketqua[giai].forEach((e) => {
                const num = e.slice(-2);

                if (lo[num]) {
                    lo[num] = lo[num] + 1;
                } else {
                    lo[num] = 1;
                }
            });
        }

        for (let j = 0; j < domains.length; j++) {
            const domain = domains[j].toObject();

            const d = new Date();
            d.setHours(0, 0, 0, 0);

            const loTop = (
                await LoTopModel.findOne({
                    domainId: domain._id.toString(),
                    createdAt: { $gte: d },
                }).sort({ createdAt: -1 })
            )?.toObject();
            if (!loTop) return;

            let numbers = loTop.numbers;

            for (let n = 0; n < numbers.length; n++) {
                const number = numbers[n].number;

                if (lo[number]) {
                    numbers[n] = {
                        number,
                        win: true,
                        times: lo[number],
                    };
                } else {
                    numbers[n] = {
                        number,
                        win: false,
                    };
                }
            }

            await LoTopModel.findByIdAndUpdate(
                loTop._id.toString(),
                {
                    numbers: numbers,
                    isWaiting: false,
                },
                {
                    new: true,
                }
            );
        }

        if (res) {
            res.json({
                msg: "OK",
            });
        }
    } catch (error) {
        if (res) {
            res.status(400).json({
                msg: "Error",
            });
        }
    }
};

const autoNumber = async (req, res) => {
    const { domain, time, cvHtml } = req.query;
    const domainObj = (await DomainModel.findOne({ name: domain }))?.toObject();

    if (cache.isExist(`LO_TOP_${domain}_${time}_${+cvHtml}`)) {
        res.json({
            html: cache.getKey(`LO_TOP_${domain}_${time}_${+cvHtml}`)
        });
        return;
    }

    if (!domainObj) {
        res.status(404).json({
            msg: "Provide domain"
        });
        return;
    }

    let startOfDay = new Date();
    let endOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    if (time === "yesterday") {
        startOfDay.setDate(startOfDay.getDate() - 1);
        endOfDay.setDate(endOfDay.getDate() - 1);
    } else if (time == "2_days_ago") {
        startOfDay.setDate(startOfDay.getDate() - 2);
        endOfDay.setDate(endOfDay.getDate() - 2);
    }

    const loTop = await LoTopModel.findOne({
        domainId: domainObj._id.toString(),
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        },
    });

    if (!loTop) {
        res.status(404).json({
            msg: "Not found result",
        });
        return;
    }
    
    const numbers = loTop.toObject().numbers;
    const isWaiting = loTop.toObject().isWaiting;

    if (+cvHtml) {
        const html = `
            <div class="loTop">
                ${numbers
                    .map(({ number, win, times }, index) => {
                        let fontSize = '';

                        if (index === 0) {
                            fontSize = 34 + 'px';
                        } else if (index > 0 && index <= 10) {
                            fontSize = (33 - index * 0.2) + 'px';
                        } else if (index > 10 && index <= 20) {
                            fontSize = (32 - index * 0.2) + 'px';
                        } else if (index > 20 && index <= 30) {
                            fontSize = (31 - index * 0.2) + 'px';
                        } else {
                            fontSize = (30 - index * 0.15) + 'px';
                        }

                        return `
                            <div style="margin-right: 5px; font-size: ${fontSize}; ${index > 30 ? "display: none;" : ""}" class="${isWaiting ? "waiting" : ""} ${win ? "win" : "lose"}">
                                ${number}
                                ${win ? `<span>${times}</span>` : ""}
                            </div>
                        `;
                    })
                    .join("")}
            </div>
        `;

        cache.setKey(`LO_TOP_${domain}_${time}_${+cvHtml}`, html);

        res.json({
            html: html,
        });
    } else {
        res.json(loTop);
    }
};

const getMultipleRs = async (req, res) => {
    const { domain, rows, cvHtml, header } = req.query;

    const domainObj = (await DomainModel.findOne({ name: domain }))?.toObject();

    if (cache.isExist(`LO_TOP_MULTIPLE_${domain}_${rows}_${+cvHtml}_${header}`)) {
        res.json({
            html: cache.getKey(`LO_TOP_MULTIPLE_${domain}_${rows}_${+cvHtml}_${header}`)
        });
        return;
    }

    if (!domainObj) {
        res.status(404).json({
            msg: "Provide domain"
        });
        return;
    }

    const loTops = await LoTopModel.find({
        domainId: domainObj._id.toString(),
    }).sort({
        createdAt: -1,
    }).limit(+rows || 30);

    if (loTops.length === 0) {
        res.status(404).json({
            msg: "Not found result",
        });
        return;
    }

    if (+cvHtml) {
        let html = `<div class="loTops">`;

        loTops.forEach((loTop) => {
            const numbers = loTop.toObject().numbers;
            const isWaiting = loTop.toObject().isWaiting;
            const date = new Date(loTop.toObject().createdAt);

            const [d, m, y] = (() => {
                return [
                    date.getDate().toString(),
                    (date.getMonth() + 1).toString(),
                    date.getFullYear(),
                ]
            })()

            html += `
                <div class="lotop-box">
                    <div class="lotop-box-header">
                        ${header.replaceAll('{{date}}', `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`)}
                    </div>
                    <div class="lotop-box-numbers">
                        ${numbers
                            .map(({ number, win, times }, index) => {
                                let fontSize = '';

                                if (index === 0) {
                                    fontSize = 34 + 'px';
                                } else if (index > 0 && index <= 10) {
                                    fontSize = (33 - index * 0.2) + 'px';
                                } else if (index > 10 && index <= 20) {
                                    fontSize = (32 - index * 0.2) + 'px';
                                } else if (index > 20 && index <= 30) {
                                    fontSize = (31 - index * 0.2) + 'px';
                                } else {
                                    fontSize = (30 - index * 0.15) + 'px';
                                }

                                return `
                                    <div style="margin-right: 5px; font-size: ${fontSize}; ${index > 30 ? "display: none;" : ""}" class="${isWaiting ? "waiting" : ""} ${win ? "win" : "lose"}">
                                        ${number}
                                        ${win ? `<span>${times}</span>` : ""}
                                    </div>
                                `;
                            })
                            .join("")}                    
                    </div>
                    <button class="btn btn-danger view-more-lotop">Xem tất cả</button>
                </div>
            `;
        });
        html += `</div>`;

        cache.setKey(`LO_TOP_MULTIPLE_${domain}_${rows}_${+cvHtml}_${header}`, html);

        res.json({
            html,
        })
    } else {
        res.json(loTops);
    }
}

module.exports = {
    autoGenNumbers,
    checkResult,
    autoNumber,
    getMultipleRs,
};
