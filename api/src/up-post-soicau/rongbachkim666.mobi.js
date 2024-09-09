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

const DOMAIN = 'https://rongbachkim666.mobi';
const WP_TOKEN = '9d7c54998d947451206bab600109710430eafd5acbada72c5ec7eaedfb959e20';

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

        logger.info(`rongbachkim666.mobi ${payload.post_type} | Post created: ${JSON.stringify(res.data)}`);
    } catch (error) {
        logger.error(`rongbachkim666.mobi ${payload.post_type} | Post fail: ${JSON.stringify(error.response.data)}`);
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

    const post_title = `Dự đoán XSMB ${currentDate}/${currentMonth}/${currentYear} – Soi Cầu dự đoán xổ số miền Bắc`;
    const post_content = `
    <strong>Dự đoán KQXS miền Bắc hôm nay ${todayLabel}</strong> dựa vào những phương pháp phân tích KQXS MB ${dayLabel} tuần trước &amp; Bảng Thống Kê. Từ đó chọn ra những cặp số may mắn nhất, cầu đẹp nhất hoàn toàn miễn phí cho anh em.

    <img class="aligncenter size-full wp-image-1419" src="https://rongbachkim666.mobi/wp-content/uploads/2024/08/du-doan-kqxs-mb-rbk666.png" alt="" width="1200" height="672" />
    <h2><b>Dự đoán KQXS miền Bắc ngày ${todayLabel}</b></h2>
    <span style="font-weight: 400;">Dưới dây kết quả Soi cầu Dự đoán KQ XSMB từ đội ngũ ngũ chuyên gia của chúng tôi:</span>
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
    <h2><a href="https://rongbachkim666.mobi/xsmb-xo-so-mien-bac/">KQSX miền Bắc</a> vào <a href="https://rongbachkim666.mobi/xsmb-${dayUrl[currentDay]}/">${dayLabel}</a> tuần trước ngày ${lastWeekLabel}</h2>
    <i><span style="font-weight: 400;">Cập nhật KQSX Miền Bắc chính xác ngày ${lastWeekLabel}</span></i>
    
    [ket_qua_xo_so domain="1" ngay="${lastDate}-${lastMonth}-${lastYear}"]
    <h2><b>Bảng thống kê KQXS Miền Bắc từ Rồng Bạch Kim 666</b></h2>
    Để có thể soi cầu mang lại tỉ lệ trúng lô hoặc đề các chuyên gia tại <strong><a href="https://rongbachkim666.mobi/">Rồng Bạch Kim 666</a></strong> thường xem các bảng Thống Kê chi tiết. Cùng xem thông kê từ chúng tôi để nhận định KQXS MB hôm nay nhé.
    
    [thong_ke_general domain="1" ngay="${currentDate}-${currentMonth}-${currentYear}"]
    <h2><b>Kết luận</b></h2>
    <span style="font-weight: 400;">Như vậy chúng tôi đã gửi đến bạn những </span><b>dự đoán KQXS miền bắc hôm nay</b><span style="font-weight: 400;"> ngày ${todayLabel} dựa trên quá trình soi cầu thống kê, phân tích kỹ lưỡng. Hy vọng anh em sẽ đọc kỹ và lựa chọn được con số may mắn cho bản thân.</span>    
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_bac",
        post_name: `du-doan-xsmb-${currentDate}-${currentMonth}-${currentYear}-soi-cau-du-doan-xo-so-mien-bac`,
        post_thumbnail: 1419,
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

    const post_title = `Dự đoán XSMT ${currentDate}/${currentMonth}/${currentYear} - Soi Cầu dự đoán xổ số miền Trung`;
    const post_content = `
        <strong><a href="https://rongbachkim666.mobi/">Rồng Bạch Kim 666</a></strong> tiếp tục gửi tới anh em những thông tin <strong>Dự đoán KQXS miền trung hôm nay vào ${dayLabel} ngày ${todayLabel}</strong>. Với những phương pháp soi cầu chuẩn xác có thể giúp anh em thu lợi nhuận cao từ việc đánh lô đề.

        <img class="aligncenter size-full wp-image-1421" src="https://rongbachkim666.mobi/wp-content/uploads/2024/08/du-doan-kqxs-mt-rbk666.png" alt="" width="1200" height="672" />
        <h2>Xem lại kết quả XSMT ${dayLabel} tuần trước ${lastWeekLabel}</h2>
        Để có thể soi cầu hôm nay ngày ${todayLabel} các bạn nên tham khảo KQXS MT ngày ${lastWeekLabel} - từ là ngày ${dayLabel} tuần trước.
        
        [ket_qua_xo_so domain="2" ngay="${lastDate}-${lastMonth}-${lastYear}"]
        <h2><b>Dự Đoán <a href="https://rongbachkim666.mobi/xsmt-xo-so-mien-trung/">KQXS Miền Trung</a> Hôm Nay <a href="/xsmt-${dayUrl[currentDay]}/">${dayLabel}</a> Ngày ${todayLabel}</b></h2>
        Tận dụng kết quả từ Kết quả Xổ số Miền Trung ngày ${lastWeekLabel} anh em có thể dựa vào đó để lấy dữ liệu quan trọng, sử dụng cho việc Dự đoán KQXS miền trung hôm nay. Cùng xem những dự đoán từ các chuyên gia của chúng tôi ngay bây giờ nhé:
        ${provinces.map((province) => {
            return `
                <h3><b>✅ Dự đoán <a href="https://rongbachkim666.mobi/${PROVINCE_HREFS[province]}">KQXS ${province}</a> ngày ${todayLabel}</b></h3>
                <span style="font-weight: 400;">Soi cầu ${province} ${currentDate}/${currentMonth} ${dayLabel} hôm nay gồm có chốt số kết quả giải 8, số đầu - đuôi giải đặc biệt, loto 2 số, lô tô xiên hôm nay.</span>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>👉 Giải đặc biệt (đầu &amp; đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)}</span></td>
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
        <h2><b>Tổng hợp các bảng Thống kê KQSX miền Trung</b></h2>
        Những bảng Thống kê KQSX miền Trung sẽ giúp ích các bạn rất nhiều trong quá trình soi cầu ngày hôm nay. Hãy xem kỹ lại những thống kê về các bộ số, lô gan lâu chưa ra... để chọn số nhé.
        
        [thong_ke_general domain="2" ngay="${currentDate}-${currentMonth}-${currentYear}"]
        <h2><b>Kết luận</b></h2>
        <span style="font-weight: 400;">Hy vọng với những thông tin từ các chuyên gia về </span><b>Dự đoán KQXS miền Trung hôm nay</b> sẽ giúp anh em trúng lô để<span style="font-weight: 400;">. Cũng như chọn ra được cho mình con số may mắn trong ngày hôm sau. Tuy nhiên mọi người chỉ nên tham gia xổ số theo đúng quy định của pháp luật, nên chơi dựa trên tinh thần thoải mái không nên quá tham lam nhé.</span>    
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_trung",
        post_name: `du-doan-xsmt-${currentDate}-${currentMonth}-${currentYear}-soi-cau-du-doan-xo-so-mien-trung`,
        post_thumbnail: 1421,
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

    const post_title = `Dự đoán XSMN ${currentDate}/${currentMonth}/${currentYear} - Soi Cầu dự đoán xổ số miền Nam`;
    const post_content = `
    Hôm nay anh em lô đề thủ miền Nam đã kết con số nào chưa? Nếu chưa hãy cùng các chuyên gia tại <strong><a href="https://rongbachkim666.mobi/">Rồng Bạch Kim 666</a></strong> <strong>Soi cầu Dự đoán KQXS miền Nam hôm nay ${dayLabel} ngày ${todayLabel}</strong> nhé.

    <img class="aligncenter size-full wp-image-1422" src="https://rongbachkim666.mobi/wp-content/uploads/2024/08/du-doan-kqxs-mn-rbk666.png" alt="" width="1200" height="672" />
    <h2>Dự Đoán KQXS Miền Nam Hôm Nay ${dayLabel} Ngày ${todayLabel}</h2>
    Dưới đây là kết quả Soi cầu từ các chuyên gia miền Nam của RongBachKim666.Mobi để bạn có thể tham khảo.
    ${provinces.map((province) => {
        return `
            <h3><b>✅ Dự đoán <a href="https://rongbachkim666.mobi/${PROVINCE_HREFS[province]}">KQXS ${province}</a> ngày ${todayLabel}</b></h3>
            <span style="font-weight: 400;">Dự Đoán KQXS ${province} ${currentDate}/${currentMonth} ngày ${todayLabel} với những con số may mắn cho anh em lô đề thủ miền Nam:</span>
            <table class="table_dudoan">
            <tbody>
            <tr>
            <td>👉 Giải đặc biệt (đầu &amp; đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1)}</span></td>
            </tr>
            <tr>
            <td>👉 Bạch thủ Lô: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></td>
            </tr>
            <tr>
            <td>👉 Bao lô 3 số chuẩn nhất: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></td>
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
    <h2>Xem lại <a href="https://rongbachkim666.mobi/xsmn-xo-so-mien-nam/">Kết quả XSMN</a> vào <a href="/xsmn-${dayUrl[currentDay]}/">${dayLabel}</a> tuần trước ${lastDate}/${lastMonth}/${lastYear}</h2>
    <span style="font-weight: 400;">Kết quả xổ số miền Nam ngày ${lastDate}/${lastMonth}/${lastYear} được quay thưởng vào ${dayLabel} tuần trước:</span>
    
    [ket_qua_xo_so domain="3" ngay="${lastDate}-${lastMonth}-${lastYear}"]
    <h2>Tổng hợp bảng Thống kê KQSX miền Nam</h2>
    [thong_ke_general domain="3" ngay="${currentDate}-${currentMonth}-${currentYear}"]
    <h2><b>Kết luận</b></h2>
    <span style="font-weight: 400;">Với những <strong>D</strong></span><strong>ự đoán KQXS miền Nam hôm nay</strong> từ các chuyên gia của chúng tôi hi vọng anh em sẽ ăn đậm cả lô lẫn đề. Đừng quên các dự đoán chỉ mang tính chất tham khảo, chính vì thế anh em cần vận dụng với kiến thức soi cầu của bản thân để lựa chọn con số phù hợp.    
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_nam",
        post_name: `du-doan-kqxs-mien-nam-hom-nay-ngay-${currentDate}-${currentMonth}-${currentYear}-chuan-nhat`,
        post_thumbnail: 1422,
    });
};

module.exports = {
    taoBaiVietMienBac,
    taoBaiVietMienTrung,
    taoBaiVietMienNam,
};
