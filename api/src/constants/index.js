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

const DOMAINS = {
    MienBac: 1,
    MienTrung: 2,
    MienNam: 3,
};

const ONE_DAY = 86400000;

const LICH_QUAY_THUONG = {
    0: {
        1: {
            "Thái Bình": [],
        },
        2: {
            Huế: [],
            "Khánh Hòa": [],
            "Kon Tum": [],
        },
        3: {
            "Đà Lạt": [],
            "Kiên Giang": [],
            "Tiền Giang": [],
        },
    },
    1: {
        1: {
            "Hà Nội": [],
        },
        2: {
            Huế: [],
            "Phú Yên": [],
        },
        3: {
            "Cà Mau": [],
            "Đồng Tháp": [],
            TPHCM: [],
        },
    },
    2: {
        1: {
            "Quảng Ninh": [],
        },
        2: {
            "Đắk Lắk": [],
            "Quảng Nam": [],
        },
        3: {
            "Bạc Liêu": [],
            "Bến Tre": [],
            "Vũng Tàu": [],
        },
    },
    3: {
        1: {
            "Bắc Ninh": [],
        },
        2: {
            "Đà Nẵng": [],
            "Khánh Hòa": [],
        },
        3: {
            "Cần Thơ": [],
            "Đồng Nai": [],
            "Sóc Trăng": [],
        },
    },
    4: {
        1: {
            "Hà Nội": [],
        },
        2: {
            "Bình Định": [],
            "Quảng Bình": [],
            "Quảng Trị": [],
        },
        3: {
            "An Giang": [],
            "Bình Thuận": [],
            "Tây Ninh": [],
        },
    },
    5: {
        1: {
            "Hải Phòng": [],
        },
        2: {
            "Gia Lai": [],
            "Ninh Thuận": [],
        },
        3: {
            "Bình Dương": [],
            "Trà Vinh": [],
            "Vĩnh Long": [],
        },
    },
    6: {
        1: {
            "Nam Định": [],
        },
        2: {
            "Đà Nẵng": [],
            "Đắk Nông": [],
            "Quảng Ngãi": [],
        },
        3: {
            "Bình Phước": [],
            "Hậu Giang": [],
            "Long An": [],
            TPHCM: [],
        },
    },
};

const CHECK_TYPE = {
    LO: 1,
    LO_DAU: 2,
    LO_DUOI: 3,
    "3_CANG_LO": 4,
    DE: 5,
    DE_DAU: 6,
    DE_DUOI: 7,
    "3_CANG_DE": 8,
};

module.exports = {
    NUMBER_TYPE,
    PRIZE,
    NUMBER_TYPE_LABELS,
    PRIZE_LABELS,
    ONE_DAY,
    DOMAINS,
    LICH_QUAY_THUONG,
    CHECK_TYPE,
};
