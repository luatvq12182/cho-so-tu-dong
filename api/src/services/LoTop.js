const axios = require("axios");
const chalk = require("chalk");
const LoTopModel = require("../models/LoTop");
const DomainModel = require("../models/Domain");

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
            console.log(chalk.yellow("Đã tạo Lô top hôm nay"));
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

            const newObj = new LoTopModel({
                domainId: domain._id.toString(),
                numbers: shuffledArray.map((e) => {
                    return {
                        number: e,
                    };
                }),
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

const checkResult = async () => {
    const domains = await DomainModel.find({});

    const today = new Date();
    if (today.getHours() < 19) {
        today.setDate(today.getDate() - 1);
    }

    const ngay = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    const kqxs = await axios.get(`https://apixoso.com/api/kqxs?domain=1&ngay=${ngay}`);
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
                    times: lo[number]
                }
            } else {
                numbers[n] = {
                    number,
                    win: false,
                }
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
}

const autoNumber = async (req, res) => {
    const { domain, cvHtml } = req.query; 
    const domainObj = (await DomainModel.findOne({ name: domain }))?.toObject();

    if (!domainObj) {
        res.json({
            html: "",
        });
        return;
    }

    const loTop = await LoTopModel.findOne({
        domainId: domainObj._id.toString(),
    }).sort({ createdAt: -1 });

    if (loTop?.length === 0) {
        res.json({
            html: "",
        });
        return;
    }
    const numbers = loTop.toObject().numbers;
    const isWaiting = loTop.toObject().isWaiting;

    if (+cvHtml) {
        res.json({
            html: `
                    <div class="loTop">
                        ${numbers.map(({ number, win, times }) => {
                            return `
                                <div class="${isWaiting ? "waiting" : ""} ${win ? "win" : "lose"}">
                                    ${number}
                                    ${win ? `<span>${times}</span>` : ""}
                                </div>
                            `
                        }).join('')}
                    </div>
                `,
        });
    } else {
        res.json(loTop);
    }
};

module.exports = {
    autoGenNumbers,
    checkResult,
    autoNumber,
};
