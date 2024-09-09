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

const DOMAIN = 'https://rongbachkim888.org';
const WP_TOKEN = '59dd59fe24daae14c1b67e42d1f27475506d1560c32bf7b5b04915bd0dcc0341';

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

        logger.info(`rongbachkim888 ${payload.post_type} | Post created: ${JSON.stringify(res.data)}`);
    } catch (error) {
        logger.error(`rongbachkim888 ${payload.post_type} | Post fail: ${JSON.stringify(error.response.data)}`);
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

    const post_title = `Dự đoán Kết Quả Xổ số miền Bắc ${dayLabel} Ngày ${todayLabel}`;
    const post_content = `
        <b>Dự đoán</b> <b>KQXS miền bắc hôm nay</b><span style="font-weight: 400;"> ${todayLabel} tỷ lệ trúng cao dựa vào kết quả phân tích soi cầu với nhiều phương pháp từ các chuyên gia tại <strong><a href="https://rongbachkim888.org/">Rồng Bạch Kim 888</a></strong>. </span>

        <img class="aligncenter size-full wp-image-1439" src="https://rongbachkim888.org/wp-content/uploads/2024/08/du-doan-kqxs-mb-rnk888.png" alt="" width="1200" height="672" />
        <h2><b>Dự Đoán <a href="https://rongbachkim888.org/xsmb-xo-so-mien-bac/">KQSX Miền Bắc</a> Hôm Nay <a href="https://rongbachkim888.org/xsmb-${dayUrl[currentDay]}/">${dayLabel}</a> Ngày ${todayLabel}</b></h2>
        <b>Dự đoán</b> <b>KQXS miền bắc hôm nay </b><span style="font-weight: 400;">chi tiết từ giải bảy đến giải đặc biệt. Anh em hãy đọc kỹ bài viết sau đây, lưu lại thông tin để tham khảo nhé!</span>
        <table class="table_dudoan" style="height: 244px;" width="534">
        <tbody>
        <tr>
        <td>👉 Bạch thủ lô siêu VIP hôm nay: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Cặp lô đẹp nhất hôm nay: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.CAP_SO_DAO, 1)[0].join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Lô xiên 2: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Lô xiên 3: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Lô kép đẹp nhất hôm nay: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_KEP, 1).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Dàn lô 4 số đẹp: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 4).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Bạch thủ đề siêu VIP hôm nay: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></strong></td>
        </tr>
        <tr>
        <td>👉 Dàn đề 10 số: <strong><span class="number-red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 10).join(' - ')}</span></strong></td>
        </tr>
        </tbody>
        </table>
        <h2><b>Điểm lại KQSX miền Bắc vào ${dayLabel} tuần trước ngày ${lastDate}/${lastMonth}/${lastYear} </b></h2>
        <span style="font-weight: 400;">Trước khi đi vào </span><b>dự đoán KQSX miền bắc hôm nay, </b>chúng ta<span style="font-weight: 400;"> hãy cùng xem qua bảng KQXS Miền Bắc tuần trước ngày ${lastDate}/${lastMonth.toString().padStart(2, '0')}/${lastYear} đã:</span>

        <i><span style="font-weight: 400;">Bảng thống kê KQSX miền bắc chi tiết ngày ${lastDate.toString().padStart(2, '0')}/${lastMonth.toString().padStart(2, '0')}</span></i>

        [ket_qua_xo_so domain="1" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        <h2><b>Bảng thống kê KQXS Miền Bắc từ Rồng Bạch Kim 888</b></h2>
        <span style="font-weight: 400;">Để đưa ra dự đoán về KQSX miền bắc, chúng tôi khuyên bạn nên xem lại bảng kết quả mở thưởng 30 ngày qua. Từ đó tiến hành tổng hợp dữ liệu, dựa trên thống kê phân tích để đưa ra dự đoán sáng suốt.</span>

        [thong_ke_general domain="1" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Kết luận</b></h2>
        <span style="font-weight: 400;">Chia sẻ đến bạn <strong>D</strong></span><strong>ự đoán KQXS miền bắc hôm nay ngày ${currentDate.toString().padStart(2, '0')}</strong><span style="font-weight: 400;"><strong>/${currentMonth.toString().padStart(2, '0')}/${currentYear}</strong> từ các chuyên gia của chúng tôi. Bạn nên tham khảo dự đoán của chúng tôi để có thêm dữ kiện cho quyết định đánh lô hoặc đề vào tối nay. Chúc Anh Em trúng lớn ăn cả lô lẫn đề giải miền Bắc nhé.</span>      
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_bac",
        post_name: `du-doan-ket-qua-xo-so-mien-bac-${dayUrl[currentDay]}-ngay-${currentDate.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}-${currentYear}`,
        post_thumbnail: 1439,
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

    const post_title = `Dự đoán Kết Quả Xổ số miền Trung ${dayLabel} Ngày ${todayLabel}`;
    const post_content = `
        <strong>Dự đoán KQXS miền Trung hôm nay</strong><span style="font-weight: 400;"><strong> ${dayLabel} ngày ${todayLabel}</strong> dựa trên các phương pháp Soi cầu dự đoán từ những chuyên gia hàng đầu miền Trung tại <strong><a href="https://rongbachkim888.org/">Rồng Bạch Kim 888</a></strong>.</span>

        <img class="aligncenter size-full wp-image-1441" src="https://rongbachkim888.org/wp-content/uploads/2024/08/du-doan-kqxs-mt-rnk888.png" alt="" width="1200" height="672" />
        <h2><b>Dự Đoán <a href="https://rongbachkim888.org/xsmt-xo-so-mien-trung/">KQXS Miền Trung</a> Hôm Nay <a href="https://rongbachkim888.org/xsmt-${dayUrl[currentDay]}/">${dayLabel}</a> Ngày ${todayLabel} </b></h2>
        <b>Dự đoán KQXS miền trung hôm nay</b><span style="font-weight: 400;"> ngày ${todayLabel} được dự đoán một cách chính xác và hoàn toàn miễn phí. Các chuyên gia phân tích tổng hợp thông tin, đưa ra kết luận dựa trên cơ sở khoa học, nhằm hỗ trợ người chơi chọn lựa con số may mắn.</span>
        ${provinces.map((province) => {
            return `
                <h3><b>✅ Dự đoán <a href="https://rongbachkim888.org/${PROVINCE_HREFS[province]}">KQXS ${province}</a> ngày ${todayLabel}</b></h3>
                <span style="font-weight: 400;">Soi cầu ${province} ${currentDate}/${currentMonth} ${dayLabel} hôm nay gồm có chốt số kết quả giải 8, số đầu - đuôi giải đặc biệt, loto 2 số, lô tô xiên hôm nay.</span>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>👉 Giải đặc biệt (đầu &amp; đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>👉 Bạch thủ Lô: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>👉 Bao lô 2 số chuẩn nhất: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>👉 Xiên: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')})</span></td>
                </tr>
                <tr>
                <td>👉 Xỉu chủ bất bại: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999, 2).join(' - ')}</span></td>
                </tr>
                </tbody>
                </table>                
            `;
        }).join('')}
        <h2>Xem lại kết quả XSMT ${dayLabel} tuần trước ${lastWeekLabel}</h2>
        <span style="font-weight: 400;">Trước khi </span><b>Dự đoán KQXS miền trung hôm nay</b><span style="font-weight: 400;">, cùng tham khảo nhanh bảng kết quả XSMT kỳ trước ngày ${lastWeekLabel}. Nhận định những bộ số mở thưởng mới nhất để chuẩn đoán soi cầu xổ số Miền Trung ngày ${currentDate} tháng ${currentMonth} năm ${currentYear} chính xác nhất.</span>
        
        [ket_qua_xo_so domain="2" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        <h2><b>Thống kê Phân tích KQSX miền Trung</b></h2>
        <span style="font-weight: 400;">Xem ngay bảng số liệu thống kê cho ngày hôm nay để lựa chọn cặp lô có khả năng nổ cao nhất. Dựa vào đó để mọi người có thể dự đoán, soi cầu và </span><b>Dự đoán KQXS miền trung hôm nay</b><span style="font-weight: 400;">. Cụ thể:</span>
        
        [thong_ke_general domain="2" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Kết luận</b></h2>
        <b>Dự đoán KQXS miền trung hôm nay ngày ${todayLabel}</b><span style="font-weight: 400;"> chỉ mang tính chất tham khảo. Bạn vẫn nên cân nhắc kỹ lưỡng trước khi đưa ra bất kỳ quyết định chọn số, đặt cược nào nhé!</span>    
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_trung",
        post_name: `du-doan-ket-qua-xo-so-mien-trung-${dayUrl[currentDay]}-ngay-${currentDate.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}-${currentYear}`,
        post_thumbnail: 1441,
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

    const post_title = `Dự đoán Kết Quả Xổ số miền Nam ${dayLabel} Ngày ${todayLabel}`;
    const post_content = `
        <b>Dự đoán KQXS miền Nam hôm nay</b><span style="font-weight: 400;"> dựa trên kết quả Xổ số Miền Nam ngày hôm trước kết hợp với xác suất thống kê chuyên sâu. Từ đây kết hợp với các phương pháp soi cầu những chuyên gia tại <strong><a href="https://rongbachkim888.org/">Rồng Bạch Kim 888</a></strong> đã trúng lô &amp; đề hàng ngày.</span>

        <img class="aligncenter size-full wp-image-1443" src="https://rongbachkim888.org/wp-content/uploads/2024/08/du-doan-kqxs-mn-rnk888.png" alt="" width="1200" height="672" />
        <h2>Dự Đoán KQXS Miền Nam Hôm Nay ${dayLabel} Ngày ${todayLabel}</h2>
        <span style="font-weight: 400;">Dựa vào </span><b>dự đoán KQXS miền Nam hôm nay</b><span style="font-weight: 400;">  và kết hợp phân tích kết quả xổ số miền Nam trong vòng 30 ngày qua, xác định các cặp lô tô xuất hiện thường xuyên nhất, hiếm hoi nhất, bộ số gan lâu chưa về, giải tám, đầu đuôi giải đặc biệt trong 7 kỳ gần nhất... như sau:</span>
        ${provinces.map((province) => {
            return `
                <h3><b>✅ Dự đoán <a href="https://rongbachkim888.org/${PROVINCE_HREFS[province]}">KQXS ${province}</a> ngày ${todayLabel}</b></h3>
                <span style="font-weight: 400;">Soi cầu ${province} ${currentDate}/${currentMonth} ${dayLabel} hôm nay gồm có:</span>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>👉 Giải đặc biệt (đầu &amp; đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>👉 Bạch thủ Lô: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>👉 Bao lô 2 số chuẩn nhất: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>👉 Xiên: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')})</span></td>
                </tr>
                <tr>
                <td>👉 Xỉu chủ bất bại: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999, 2).join(' - ')}</span></td>
                </tr>
                </tbody>
                </table>                
            `;
        }).join('')}
        <h2>Xem lại <a href="https://rongbachkim888.org/xsmn-xo-so-mien-nam/">Kết quả XSMN</a> vào <a href="https://rongbachkim888.org/xsmn-${dayUrl[currentDay]}/">${dayLabel}</a> tuần trước ${lastWeekLabel}</h2>
        <span style="font-weight: 400;">KQXS miền nam ngày ${lastWeekLabel} đã được mở thưởng vào tuần trước</span>
        
        [ket_qua_xo_so domain="3" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        <h2>Xem bảng Thống kê KQSX miền Nam</h2>
        Xem lại các bản Thống kê KQXS MN để có thể các dữ liệu cho bạn lựa chọn số lô hoặc đề ngày hôm nay.
        
        [thong_ke_general domain="3" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Kết luận</b></h2>
        <span style="font-weight: 400;">Những </span><b>dự đoán KQXS miền Nam hôm nay</b><span style="font-weight: 400;">  trên đã được xem xét cẩn thận nhưng nhìn chung vẫn chỉ mang tính chất tham khảo. Người chơi nên lựa chọn hình thức xổ số hợp pháp, tính toán kỹ lưỡng trước khi quyết định cược.</span>
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_nam",
        post_name: `du-doan-ket-qua-xo-so-mien-nam-${dayUrl[currentDay]}-ngay-${currentDate.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}-${currentYear}`,
        post_thumbnail: 1443,
    });
};

module.exports = {
    taoBaiVietMienBac,
    taoBaiVietMienTrung,
    taoBaiVietMienNam,
};
