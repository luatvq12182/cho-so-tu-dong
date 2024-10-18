/**
 * STATUS: IN PROGRESS
 */

/**
 * /create-post-soi-cau
 *
 * post_title, post_content, post_type
 *
 */

const { default: axios } = require("axios");
const logger = require("../configs/logger");
const { randomNumber } = require("../utils");
const { NUMBER_TYPE, DAY_LABELS, LICH_QUAY_THUONG, PROVINCE_HREFS } = require("../constants");

const DOMAIN = 'https://nuoilokhung.org';
const WP_TOKEN = '90bffe1884b84d5e255f12ff0ecbd70f2edfc877b68d612dc6fb50638b3ac17c';

const createPostAPI = async (payload) => {
    try {
        const res = await axios.post(
            DOMAIN + "/wp-json/custom/v1/create-post",
            payload,
            {
                headers: {
                    'WP-Token': WP_TOKEN,
                }
            }
        );

        logger.info(`nuoilokhung.org ${payload.post_type} | Post created: ${JSON.stringify(res.data)}`);
    } catch (error) {
        logger.error(`nuoilokhung.org ${payload.post_type} | Post fail: ${JSON.stringify(error.response.data)}`);
    }
};

const taoBaiVietMienBac = () => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDay();

    const todayLabel = `${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`;

    const { lastDate, lastMonth, lastYear } = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);

        const lastDate = d.getDate();
        const lastMonth = d.getMonth() + 1;
        const lastYear = d.getFullYear();

        return {
            lastDate,
            lastMonth,
            lastYear,
        };
    })();
    const lastWeekLabel = `${lastDate.toString().padStart(2, '0')}/${lastMonth.toString().padStart(2, '0')}/${lastYear}`;
    const dayLabel = DAY_LABELS[currentDay];

    const dayUrl = {
        0: 'chu-nhat',
        1: 'thu-2',
        2: 'thu-3',
        3: 'thu-4',
        4: 'thu-5',
        5: 'thu-6',
        6: 'thu-7',
    };
    const tinhQuayThuong = {
        0: 'Thái Bình',
        1: 'Hà Nội',
        2: 'Quảng Ninh',
        3: 'Bắc Ninh',
        4: 'Hà Nội',
        5: 'Hải Phòng',
        6: 'Nam Định',
    }[currentDay];

    const post_title = `Dự Đoán KQXS Miền Bắc Hôm Nay Ngày ${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear} Chuẩn Nhất`;
    const post_content = `
        <b>Dự đoán KQXS miền bắc hôm nay</b><span style="font-weight: 400;"> theo cập nhật kết quả từ đài xổ số chiều ${todayLabel} chính xác nhất. Thông tin được tổng hợp từ đài số ${tinhQuayThuong} sẽ được chia sẻ trong bài viết của <strong><a href="https://soicau888.org/">Soi Cầu 888</a></strong> sau đây. Theo dõi để có những kiến thức xổ số MB soi cầu thông minh cho mình nhé!</span>

        <img class="aligncenter size-full wp-image-1434" src="https://soicau888.org/wp-content/uploads/2024/08/du-doan-kqxs-mb.png" alt="" width="1280" height="628" />
        <h2><b>Xem lại <a href="https://soicau888.org/xsmb-${dayUrl[currentDay]}/">KQXS ${dayLabel}</a> tuần trước ngày ${lastWeekLabel}</b></h2>
        [ket_qua_xo_so domain="1" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        
        Ngoài ra các bạn cũng có thể tham khảo thêm các thông tin Thống Kê KQXS Miền Bắc từ chúng tôi để nâng cao tỉ lệ chiến thắng:
        
        [thong_ke_general domain="1" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Dự đoán</b> <b>KQXSX miền bắc hôm nay ${todayLabel} chuẩn xác nhất</b></h2>
        <span style="font-weight: 400;">Từ bảng tổng hợp phân tích KQXS miền Bắc các chuyên gia của chúng tôi dự đoán KQXS Miền Bắc hôm nay như sau:</span>
        <div class="table_dudoan_wrapper">
        <table class="table_dudoan">
        <tbody>
        <tr>
        <td>🌟 Bạch thủ lô siêu VIP hôm nay: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Cặp lô đẹp nhất hôm nay: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.CAP_SO_DAO, 1)[0].join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Lô xiên 2: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Lô xiên 3: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Lô kép đẹp nhất hôm nay: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_KEP, 1).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Dàn lô 4 số đẹp: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 4).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Bạch thủ đề siêu VIP hôm nay: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>🌟 Dàn đề 10 số: <strong><span class="number-red" style="color: #ff0000;">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 10).join(' - ')}</span></strong></td>
        </tr>
        </tbody>
        </table>
        </div>
        <h2><b>Kết luận</b></h2>
        <span style="font-weight: 400;">Bài viết của soicau888.org đã cập nhật cho bạn </span><b>Dự đoán kết quả Xổ Số Miền Bắc hôm nay ${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}</b><span style="font-weight: 400;"> theo 2 cách phân tích dữ liệu, soi cầu dễ thực hiện. Đừng quên truy cập tham khảo hàng ngày đề để chơi lô hoặc đề hiệu quả nhé các anh em!</span>
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_bac",
        post_name: `du-doan-kqxs-mien-bac-hom-nay-ngay-${currentDate.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}-${currentYear}-chuan-nhat`,
        post_thumbnail: 1434,
    });
};

const taoBaiVietMienTrung = () => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDay();

    const todayLabel = `${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`;

    const { lastDate, lastMonth, lastYear } = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);

        const lastDate = d.getDate();
        const lastMonth = d.getMonth() + 1;
        const lastYear = d.getFullYear();

        return {
            lastDate,
            lastMonth,
            lastYear,
        };
    })();
    const lastWeekLabel = `${lastDate.toString().padStart(2, '0')}/${lastMonth.toString().padStart(2, '0')}/${lastYear}`;
    const dayLabel = DAY_LABELS[currentDay];

    const dayUrl = {
        0: 'chu-nhat',
        1: 'thu-2',
        2: 'thu-3',
        3: 'thu-4',
        4: 'thu-5',
        5: 'thu-6',
        6: 'thu-7',
    };

    const provinces = Object.keys(LICH_QUAY_THUONG[currentDay][2]);

    const post_title = `Dự Đoán KQXS Miền Trung Hôm Nay Ngày ${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear} Chuẩn Nhất`;
    const post_content = `
        <b>Dự đoán KQXS miền trung hôm nay </b><span style="font-weight: 400;">ngày ${currentDate} tháng ${currentMonth} năm ${currentYear} bao gồm các tỉnh ${provinces.join(', ')}. Các chuyên gia tại <strong><a href="https://soicau888.org/">Soi Cầu 888</a></strong> dự đoán và phân tích dựa trên số liệu thống kê, cung cấp thông tin tham khảo cho người chơi.</span>

        <img class="aligncenter size-full wp-image-1474" src="https://soicau888.org/wp-content/uploads/2024/08/du-doan-kqxs-mt.png" alt="" width="1280" height="628" />
        <h2><b>Xem lại kết quả XSMT ${dayLabel} tuần trước ${lastWeekLabel}</b></h2>
        <span style="font-weight: 400;">Cập nhật kết quả xổ số miền Trung ${dayLabel} tuần trước</span><span style="font-weight: 400;"> như sau:</span>
        
        [ket_qua_xo_so domain="2" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        
        Ngoài ra các bạn cũng có thể tham khảo thêm các thông tin Thống Kê KQXS Miền Trung từ chúng tôi để nâng cao tỉ lệ chiến thắng:
        
        [thong_ke_general domain="2" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Dự đoán XSMT ngày ${todayLabel} chuẩn nhất</b></h2>
        <span style="font-weight: 400;">Với dữ liệu kết quả XSMT ${todayLabel} đội ngũ chuyên gia đã đưa ra vài</span> <b>Dự đoán KQXS miền trung hôm nay </b><span style="font-weight: 400;">như sau:</span>
        ${provinces.map((province) => {
            return `
                <h3><b>✅ Dự đoán <a href="https://soicau888.org/${PROVINCE_HREFS[province]}">KQXS ${province}</a> ngày ${todayLabel}</b></h3>
                <span style="font-weight: 400;">Soi cầu ${province} ${currentDate}/${currentMonth} ${dayLabel} hôm nay gồm có chốt số kết quả giải 8, số đầu - đuôi giải đặc biệt, loto 2 số, lô tô xiên hôm nay.</span>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>⭐ Giải đặc biệt (đầu &amp; đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)}</span></td>
                </tr>
                <tr>
                <td>⭐ Bạch thủ Lô: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ Bao lô 3 số chuẩn nhất: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ Xiên: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')})</span></td>
                </tr>
                <tr>
                <td>⭐ Xỉu chủ bất bại: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999, 2).join(' - ')}</span></td>
                </tr>
                </tbody>
                </table>            
            `;
        }).join('')}
        <h2><b>Kết luận</b></h2>
        <span style="font-weight: 400;">Tham khảo </span><b>Dự đoán KQXS miền trung hôm nay</b><span style="font-weight: 400;"> ${dayLabel} ngày ${todayLabel} dựa vào những phân tích từ bảng kết quả ngày hôm qua. Từ đó đưa ra lựa chọn ra các cặp số chuẩn may mắn.</span>    
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_trung",
        post_name: `du-doan-kqxs-mien-trung-hom-nay-ngay-${currentDate}-${currentMonth.toString().padStart(2, '0')}-${currentYear}-chuan-nhat`,
        post_thumbnail: 1474,
    });
};

const taoBaiVietMienNam = () => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDay();

    const todayLabel = `${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`;

    const { lastDate, lastMonth, lastYear } = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);

        const lastDate = d.getDate();
        const lastMonth = d.getMonth() + 1;
        const lastYear = d.getFullYear();

        return {
            lastDate,
            lastMonth,
            lastYear,
        };
    })();
    const lastWeekLabel = `${lastDate.toString().padStart(2, '0')}/${lastMonth.toString().padStart(2, '0')}/${lastYear}`;
    const dayLabel = DAY_LABELS[currentDay];

    const dayUrl = {
        0: 'chu-nhat',
        1: 'thu-2',
        2: 'thu-3',
        3: 'thu-4',
        4: 'thu-5',
        5: 'thu-6',
        6: 'thu-7',
    };

    const provinces = Object.keys(LICH_QUAY_THUONG[currentDay][3]);

    const post_title = `Dự Đoán KQXS Miền Nam Hôm Nay Ngày ${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear} Chuẩn Nhất`;
    const post_content = `
        <b>Dự đoán KQXS miền nam hôm nay</b><span style="font-weight: 400;"> ngày ${currentDate} tháng ${currentMonth} năm ${currentYear} bao gồm các tỉnh ${provinces.join(', ')}. Các chuyên gia tại <strong><a href="https://soicau888.org/">Soi Cầu 888</a></strong> dự đoán và phân tích dựa trên số liệu thống kê, cung cấp thông tin tham khảo cho người chơi.</span>

        <img class="aligncenter size-full wp-image-1475" src="https://soicau888.org/wp-content/uploads/2024/08/du-doan-kqxs-mn.png" alt="" width="1280" height="628" />
        <h2>Xem lại KQXS miền Nam <a href="https://soicau888.org/xsmn-${dayUrl[currentDay]}/">${dayLabel}</a> Tuần trước ngày ${lastWeekLabel}</h2>
        [ket_qua_xo_so domain="3" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        
        Ngoài ra các bạn cũng có thể tham khảo thêm các thông tin Thống Kê KQXS Miền Nam từ chúng tôi để nâng cao tỉ lệ chiến thắng:
        
        [thong_ke_general domain="3" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Dự đoán XSMN ngày ${todayLabel} chuẩn nhất</b></h2>
        <span style="font-weight: 400;">Với dữ liệu kết quả XSMN ${lastWeekLabel}, đội ngũ chuyên gia đã đưa ra</span> <b>Dự đoán KQXS miền Nam hôm nay </b><span style="font-weight: 400;">như sau:</span>
        ${provinces.map((province) => {
            return `
                <h3><b>✅ Dự đoán <a href="https://soicau888.org/${PROVINCE_HREFS[province]}">KQXS ${province}</a> ngày ${todayLabel}</b></h3>
                <span style="font-weight: 400;">Soi cầu ${province} ${currentDate}/${currentMonth} thứ 3 hôm nay gồm có chốt số kết quả giải 8, số đầu - đuôi giải đặc biệt, loto 2 số, lô tô xiên hôm nay.</span>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>⭐ Giải đặc biệt (đầu &amp; đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)}</span></td>
                </tr>
                <tr>
                <td>⭐ Bạch thủ Lô: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ Bao lô 3 số chuẩn nhất: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ Xiên: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')})</span></td>
                </tr>
                <tr>
                <td>⭐ Xỉu chủ bất bại: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999, 2).join(' - ')}</span></td>
                </tr>
                </tbody>
                </table>                
            `;
        }).join('')}
        <h2>Kết luận</h2>
        <span style="font-weight: 400;">Thông tin </span><b>dự đoán KQXS miền Nam hôm nay</b><span style="font-weight: 400;">  được chúng tôi cung cấp nhằm mục đích tham khảo. Người chơi nên vận dụng kinh nghiệm cá nhân và cân nhắc kỹ lưỡng trước khi đưa ra quyết định, nhằm tăng cơ hội trúng thưởng.</span>
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_nam",
        post_name: `du-doan-kqxs-mien-nam-hom-nay-ngay-${currentDate.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}-${currentYear}-chuan-nhat`,
        post_thumbnail: 1475,
    });
};

module.exports = {
    taoBaiVietMienBac,
    taoBaiVietMienTrung,
    taoBaiVietMienNam,
};
