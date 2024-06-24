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
};

const NUMBER_TYPE_LABELS = {
    1: "Số ngẫu nhiên (0 -> 9)",
    2: "Số ngẫu nhiên (0 -> 99)",
    3: "Số ngẫu nhiên (0 -> 999)",
    4: "Số kép",
    5: "Cặp số đảo",
};

const CHECK_TYPE_LABELS = {
    1: "Lô",
    2: "Lô Đầu",
    3: "Lô Đuôi",
    4: "3 Càng Lô",
    5: "Đề",
    6: "Đề Đầu",
    7: "Đề Đuôi",
    8: "3 Càng Đề",
};

const PRIZE_LABELS = {
    1: "Lô",
    2: "Đề",
};

export {
    NUMBER_TYPE,
    PRIZE,
    CHECK_TYPE_LABELS,
    NUMBER_TYPE_LABELS,
    PRIZE_LABELS,
};
