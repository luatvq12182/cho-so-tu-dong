const NUMBER_TYPE = {
    SO_NGAU_NHIEN_0_TO_9: 1,
    SO_NGAU_NHIEN_0_TO_99: 2,
    SO_NGAU_NHIEN_0_TO_999: 3,
    SO_KEP: 4,
    CAP_SO_DAO: 5,
};

const PRIZE = {
    LO: 1,
    DE: 2,
    BA_CANG: 3,
};

const NUMBER_TYPE_LABELS = {
    1: "Số ngẫu nhiên (0 -> 9)",
    2: "Số ngẫu nhiên (0 -> 99)",
    3: "Số ngẫu nhiên (0 -> 999)",
    4: "Số kép",
    5: "Cặp số đảo",
};

const PRIZE_LABELS = {
    1: "Lô",
    2: "Đề",
};

const ONE_DAY = 86400000;

module.exports = {
    NUMBER_TYPE,
    PRIZE,
    NUMBER_TYPE_LABELS,
    PRIZE_LABELS,
    ONE_DAY,
};
