const { NUMBER_TYPE } = require("../constants");

const randomNumber = (numberType, quantity) => {
    const rs = [];

    while (rs.length < quantity) {
        if (numberType === NUMBER_TYPE.CAP_SO_DAO) {
            let randomNum = "99";

            while (+randomNum[0] >= +randomNum[1]) {
                randomNum = Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(2, "0");
            }

            if (!rs.flat().includes(randomNum)) {
                rs.push([randomNum, `${randomNum[1]}${randomNum[0]}`]);
            }
        } else {
            let randomNum;

            if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9) {
                randomNum = Math.floor(Math.random() * 10)
                    .toString()
                    .padStart(1, "0");
            }

            if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99) {
                randomNum = Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(2, "0");
            }

            if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999) {
                randomNum = Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, "0");
            }

            if (numberType === NUMBER_TYPE.SO_KEP) {
                randomNum = [
                    "00",
                    "11",
                    "22",
                    "33",
                    "44",
                    "55",
                    "66",
                    "77",
                    "88",
                    "99",
                ][Math.floor(Math.random() * 10)];
            }

            if (!rs.includes(randomNum)) {
                rs.push(randomNum);
            }
        }
    }

    if (numberType === NUMBER_TYPE.CAP_SO_DAO) {
        return rs.sort((a, b) => {
            return a[0] - b[0];
        });
    } else {
        return rs.sort();
    }
};

const genHtmlValue = (soCho, isSpecial) => {
    if (isSpecial) {
        if (soCho.win === undefined) {
            return soCho.number;
        } else {
            if (soCho.win) {
                return `
                    <span class="win-number">${soCho.number} <span class="gdb">(về ${soCho.returnNumber})</span></span>
                `;
            } else {
                return `
                    <span class="lose-number">${soCho.number}</span>
                `;
            }
        }
    }

    if (soCho.win === undefined) {
        return soCho.number;
    } else {
        if (soCho.win) {
            return `
                <span class="win-number">${soCho.number}${soCho.times ? `<span class="times">${soCho.times}</span>` : ''}</span>
            `;
        } else {
            return `
                <span class="lose-number">${soCho.number}</span>
            `;
        }
    }
};

module.exports = { randomNumber, genHtmlValue };
