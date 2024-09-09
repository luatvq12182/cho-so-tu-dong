/**
 * TẠM BỎ QUA KHÔNG ĐĂNG
 * 
 * /create-post-soi-cau
 *
 * post_title, post_content, post_type
 *
 */

const { default: axios } = require("axios");
const logger = require("../configs/logger");
const { randomNumber } = require("../utils");
const { NUMBER_TYPE, DAY_LABELS, LICH_QUAY_THUONG, PROVINCE_HREFS } = require("../constants");

const createPostAPI = async (payload) => {
    try {
        const res = await axios.post(
            "https://soicau247vip.pro/wp-json/custom/v1/create-post",
            payload,
            {
                headers: {
                    'WP-Token': '894ced0a56d1d694a216402d8082bbd36f905b2310b8720cca29bf3be8391523',
                }
            }
        );

        // logger.info("");
        console.log(`soicau247vip.pro ${payload.post_type} | Post created: `, res.data);
    } catch (error) {
        console.log("Error: ");
        console.log(`soicau247vip.pro ${payload.post_type} | Post fail: `, error.response.data);
        // logger.error("");
    }
};

const taoBaiVietMienBac = () => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDay();

    const todayLabel = `${currentDate}/${currentMonth}/${currentYear}`;

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

    const post_title = `Dự đoán XSMB ${todayLabel} – Dự đoán xổ số miền Bắc ${dayLabel} Ngày ${currentDate}/${currentMonth.toString().padStart(2, '0')} Chuẩn Nhất`;
    const post_content = `
        <p class="new-description">Dự đoán XSMB ngày ${todayLabel} - Chúng tôi mang đến những dự đoán xổ số miền bắc ${dayLabel} ngày ${currentDate}/${currentMonth.toString().padStart(2, '0')} siêu chính xác từ các chuyên gia, hoàn toàn miễn phí.Cùng nhận dự đoán lô tô và giải đặc biệt XS Miền Bắc hôm nay. Cao thủ chốt số Miền Bắc hôm nay miễn phí.</p>
        Thống kê XSMB ngày ${dayLabel}, ${todayLabel}, chúng tôi đã tìm ra các bộ số có tỉ lệ về nhiều nhất trong kết quả xổ số Miền Bắc trong ngày hôm nay. Chúng tôi đã dự đoán các cặp lô đề đẹp, bạch thủ lô, lô xiên 2, lô xiên 3, 3 càng Miền Bắc với xác suất trúng cao nhất.
        <div></div>
        <div>
        <h2 id="trick0"><a title="Dự đoán XSMB" href="https://soicaumb.org/du-doan-xsmb-du-doan-xo-so-mien-bac">Dự đoán XSMB</a> ${todayLabel} ${dayLabel} hôm nay</h2>
        Hãy cùng chuyên gia SoiCauMB.org dự đoán XSMB ${todayLabel} ${dayLabel} hôm nay siêu chuẩn.Chúng tôi sử dụng các phương pháp soi cầu thống kê thông minh và những thuật toán để mang đến những con số đẹp nhất.Hy vọng sẽ mang đến nhiều may mắn giúp anh chị em lựa được các cặp loto chuẩn xác nhất. Cụ thể như sau:
        <table class="table_dudoan">
        <tbody>
        <tr>
        <td>✅ Đặc biệt đầu, đuôi: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Bạch thủ lô hôm nay: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 1).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Lô tô xiên 2: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')})</span></td>
        </tr>
        <tr>
        <td>✅ Lô tô xiên 3: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')})</span></td>
        </tr>
        <tr>
        <td>✅ Cầu VIP 4 số: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 4).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Lô kép: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_KEP, 2).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Xỉu chủ đẹp (lô 3 càng) hôm nay: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999, 2).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Dàn đặc biệt 36 số bất bại hôm nay: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 36).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Dàn đặc biệt 20 số miễn phí: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 20).join(' - ')}</span></td>
        </tr>
        <tr>
        <td>✅ Dàn đặc biệt 10 số ngày ${todayLabel}: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 10).join(' - ')}</span></td>
        </tr>
        </tbody>
        </table>
        </div>    
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_bac",
        post_name: `du-doan-kqxs-mien-bac-hom-nay-ngay-${currentDate.toString().padStart(2, '0')}-${currentMonth.toString().padStart(2, '0')}-${currentYear}-chuan-nhat`,
        post_thumbnail: 972,
    });
};

const taoBaiVietMienTrung = () => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDay();

    const todayLabel = `${currentDate}/${currentMonth}/${currentYear}`;

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

    const post_title = `Dự đoán XSMT ${todayLabel} - Dự đoán xổ số miền Trung ${dayLabel} Ngày ${currentDate}/${currentMonth.toString().padStart(2, '0')} Chuẩn Nhất`;
    const post_content = `
        <p class="new-description">Dự đoán XSMT ${todayLabel} - Soi cầu dự đoán xổ số miền Trung ${dayLabel} Ngày ${currentDate}/${currentMonth.toString().padStart(2, '0')} Tham khảo dự đoán xổ số ${provinces.join(' - ')} chính xác nhất.</p>
        Chúng tôi hân hạnh mang đến dự đoán XSMT ${todayLabel}, được tính toán dựa trên các phương pháp phân tích kết quả xổ số của ngày hôm qua để chọn ra những cặp số may mắn nhất. Bạn có thể tham khảo dự đoán xổ số miền Trung này hoàn toàn miễn phí từ chúng tôi, hoặc áp dụng phương pháp này để tự tìm ra những con số phù hợp cho mình. Chúng tôi hy vọng rằng thông tin này sẽ hữu ích cho quý vị trong việc tham gia xổ số miền Trung.
        <h2 id="trick0">Dự Đoán XSMT ${todayLabel}</h2>
        Dự đoán XSMT hôm nay ${todayLabel} sẽ mang đến cho toàn thể anh em những cặp số đẹp dựa trên các phương thức cầu lô đặc biệt. Cùng xem các con số sẽ mang đến may mắn cho toàn thể anh em khi tham gia dự đoán ${provinces.join(' - ')} ngày ${todayLabel}.
        <div class="table_dudoan_wrapper mt25">
        ${provinces.map((province) => {
            return `
                <h3 id="dudoan.38">✅ Chốt số lô <a title="Dự đoán xổ số ${province}" href="https://soicaumb.org/du-doan-xo-so-binh-dinh">Dự đoán xổ số ${province}</a> ${todayLabel}</h3>
                <table class="table_dudoan">
                <tbody>
                <tr>
                <td>⭐ Giải đặc biệt (đầu , đuôi): <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')} - ${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9, 1).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ giải tám: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ Bao lô 2 số chuẩn nhất: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')}</span></td>
                </tr>
                <tr>
                <td>⭐ Xiên: <span class="conso_dudoan red">(${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 2).join(' - ')}) (${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99, 3).join(' - ')})</span></td>
                </tr>
                <tr>
                <td>⭐ Xỉu chủ bất bại: <span class="conso_dudoan red">${randomNumber(NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999, 2).join(' - ')}</span></td>
                </tr>
                </tbody>
                <tbody>
                <tr>
                <td colspan="3">=&gt; Xem tường thuật trực tiếp kết quả <a title="Xổ số ${province}" href="https://soicau247vip.pro/${PROVINCE_HREFS[province]}">Xổ số ${province}</a></td>
                </tr>
                </tbody>
                </table>            
            `;
        }).join('')}
        </div>
    `;

    createPostAPI({
        post_title,
        post_content,
        post_type: "soi_cau_mien_trung",
        post_name: `du-doan-xsmt-${currentDate}-5-2024-du-doan-xo-so-mien-trung-thu-5-ngay-30-05-chuan-nhat`,
        post_thumbnail: 1474,
    });
};

const taoBaiVietMienNam = () => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentDay = today.getDay();

    const todayLabel = `${currentDate.toString().padStart(2, '0')}/${currentMonth.toString().padStart('0', 2)}/${currentYear}`;

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
