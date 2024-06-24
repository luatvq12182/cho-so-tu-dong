import { NUMBER_TYPE } from "../constants";

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

const generateRandomId = () => {
    return (
        "id-" +
        Math.random().toString(36).substr(2, 9) +
        "-" +
        Date.now().toString(36)
    );
};

export { randomNumber, generateRandomId };
