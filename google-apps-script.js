/**
 * HƯỚNG DẪN TỰ ĐỘNG ĐẨY ĐĂNG KÝ VÀO 3 TAB SHEET, GỬI EMAIL KÈM POSTER VÀ GHI TRẠNG THÁI MAIL VÀO GOOGLE SHEET & TELEGRAM
 * 
 * Tính năng nổi bật:
 *  1. Phân loại ghi dữ liệu vào 3 Tab Google Sheet: "Đăng ký tham gia", "Tài trợ", "Gian hàng".
 *  2. Ghi cột thứ 9: "Trạng Thái Gửi Email" (✅ Đã gửi mail thành công / ⚠️ Không có email / ❌ Lỗi gửi).
 *  3. Gửi Email HTML chuyên nghiệp kèm Poster Banner & Bảng lặp thông tin khách hàng.
 *  4. Trả về trạng thái gửi Email cho Telegram hiển thị thông báo.
 * 
 * BƯỚC 1: Mở file Google Sheet của bạn trên trình duyệt.
 * BƯỚC 2: Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * BƯỚC 3: Xóa hết mã cũ và dán toàn bộ đoạn mã bên dưới vào file Code.gs.
 * BƯỚC 4: Bấm "Triển khai" (Deploy) -> "Tạo bản triển khai mới" (New deployment).
 * BƯỚC 5: 
 *    - Loại triển khai (Select type): Chọn "Ứng dụng web" (Web App).
 *    - Thực thi dưới danh nghĩa (Execute as): Chọn "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone). -> RẤT QUAN TRỌNG!
 * BƯỚC 6: Bấm "Triển khai" (Deploy) -> Cấp quyền gửi Mail nếu Google hỏi -> Copy Web App URL dán vào CMS Admin.
 */

function doGet(e) {
  return doPost(e);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    var data = {};
    try {
      data = JSON.parse(contents);
    } catch (parseErr) {
      data = e.parameter || {};
    }

    // Phân loại ghi vào đúng Tab (Sheet) theo 3 Tab trong file Google Sheet
    var ticketType = (data.registrationType || data.intentTab || data.ticketType || "").toLowerCase();
    var targetSheetName = "Đăng ký tham gia";

    if (ticketType.indexOf("booth") !== -1 || ticketType.indexOf("gian hàng") !== -1 || ticketType.indexOf("gian") !== -1) {
      targetSheetName = "Gian hàng";
    } else if (ticketType.indexOf("sponsor") !== -1 || ticketType.indexOf("tài trợ") !== -1) {
      targetSheetName = "Tài trợ";
    }

    var sheet = ss.getSheetByName(targetSheetName);
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
    }

    // Tự động tạo 9 cột tiêu đề (bao gồm Trạng Thái Gửi Email)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Đăng Ký",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email",
        "Tên Doanh Nghiệp / Đơn Vị",
        "Chức Vụ",
        "Chi Tiết Đăng Ký",
        "Ghi Chú / Nhu Cầu",
        "Trạng Thái Gửi Email"
      ]);
      var headerRange = sheet.getRange("A1:I1");
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#ffffff");
    }

    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    var fullName = data.fullName || data.full_name || "Quý khách";
    var phone = data.phone || "N/A";
    var email = data.email || "";
    var company = data.company || data.company_name || "N/A";
    var position = data.position || "N/A";
    var detailInfo = data.registrationType || data.intentTab || data.ticketType || "N/A";
    var notes = data.notes || data.networkingNeeds || "Không có";
    var customSubject = data.subject || data.emailSubject || data.customSubject || "";
    var customBody = data.emailBody || data.customBody || "";
    var posterImgUrl = data.posterUrl || data.emailPosterUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";

    var emailStatusText = "⚠️ Khách không nhập Email";
    var emailSentSuccess = false;

    // 1. Thử gửi Email Xác Nhận Tự Động tới Email Khách Hàng
    if (email && email.indexOf("@") !== -1) {
      try {
        var regId = data.registrationId || ("SME2026-" + Math.floor(100000 + Math.random() * 900000));
        var isPaid = (data.paymentStatus === "SUCCESS_PAID") || (customSubject && customSubject.indexOf("THANH TOÁN") !== -1);
        var defaultSubject = isPaid 
          ? ("[SME VIỆT NAM 2026] XÁC NHẬN THANH TOÁN THÀNH CÔNG - " + fullName.toUpperCase())
          : ("[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ THÀNH CÔNG - " + fullName.toUpperCase());
        
        var subject = isPaid 
          ? (customSubject && customSubject.indexOf("THANH TOÁN") !== -1 ? customSubject : defaultSubject)
          : (customSubject || defaultSubject);

        if (customBody) {
          customBody = customBody.replace(/\{\{fullName\}\}/g, fullName)
                                 .replace(/\{\{company\}\}/g, company)
                                 .replace(/\{\{phone\}\}/g, phone)
                                 .replace(/\{\{position\}\}/g, position)
                                 .replace(/\{\{email\}\}/g, email);
        }

        var defaultIntro = isPaid
          ? "Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xác nhận đã nhận được khoản thanh toán cho đơn đăng ký tham gia của Quý khách. Vé tham dự của Quý khách đã được kích hoạt thành công!"
          : "Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xin chân thành cảm ơn Quý khách đã đăng ký thông tin tham dự sự kiện. Dưới đây là thông tin chi tiết Ban Tổ Chức đã ghi nhận:";
        var introMessage = customBody || defaultIntro;

        var boxHeaderTitle = isPaid
          ? ("🟢 XÁC NHẬN THANH TOÁN THÀNH CÔNG (MÃ VÉ: " + regId + ")")
          : ("📋 THÔNG TIN XÁC NHẬN ĐĂNG KÝ (MÃ VÉ: " + regId + ")");

        var statusBadgeHtml = isPaid
          ? '<span style="color: #16a34a; font-weight: 800;">🟢 ĐÃ THANH TOÁN THÀNH CÔNG (ĐÃ KÍCH HOẠT VÉ)</span>'
          : '<span style="color: #d97706; font-weight: 800;">⏳ CHỜ THANH TOÁN / XỬ LÝ</span>';

        var htmlTemplate = 
          '<div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">' +
            '<div style="width: 100%; text-align: center; background-color: #0D3B2E;">' +
              '<img src="' + posterImgUrl + '" alt="Poster Diễn Đàn SME Việt Nam 2026" style="width: 100%; max-height: 260px; object-fit: cover; display: block;" />' +
            '</div>' +

            '<div style="background-color: #0D3B2E; color: #ffffff; padding: 20px 24px; text-align: center;">' +
              '<h2 style="margin: 0; font-size: 18px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026</h2>' +
              '<p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0; font-weight: 600;">📍 May Plaza Hotel Thái Nguyên | 18 - 20/09/2026</p>' +
            '</div>' +

            '<div style="padding: 28px; color: #334155; line-height: 1.6; font-size: 14px;">' +
              '<p style="margin-top: 0; font-size: 15px;">Kính gửi Quý khách <b>' + fullName + '</b>,</p>' +
              '<div style="margin-bottom: 20px; line-height: 1.6;">' + introMessage + '</div>' +

              '<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid ' + (isPaid ? '#22c55e' : '#eab308') + '; border-radius: 12px; padding: 20px; margin: 20px 0;">' +
                '<div style="border-bottom: 2px dashed #cbd5e1; padding-bottom: 10px; margin-bottom: 14px;">' +
                  '<h3 style="margin: 0; font-size: 14px; color: #0D3B2E; text-transform: uppercase; font-weight: 800;">' + boxHeaderTitle + '</h3>' +
                '</div>' +

                '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">' +
                  '<tr><td style="padding: 6px 0; color: #64748b; width: 160px; font-weight: 600;">Họ và Tên:</td><td style="padding: 6px 0; font-weight: 800; color: #0f172a;">' + fullName + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Số điện thoại:</td><td style="padding: 6px 0; font-weight: 800; color: #0f172a; font-family: monospace;">' + phone + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Địa chỉ Email:</td><td style="padding: 6px 0; font-weight: 800; color: #0f172a;">' + email + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Doanh nghiệp / Đơn vị:</td><td style="padding: 6px 0; font-weight: 800; color: #0f172a;">' + company + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Chức vụ:</td><td style="padding: 6px 0; font-weight: 800; color: #0f172a;">' + position + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Nội dung đăng ký:</td><td style="padding: 6px 0; font-weight: 800; color: #d97706;">' + detailInfo + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Trạng thái:</td><td style="padding: 6px 0;">' + statusBadgeHtml + '</td></tr>' +
                  '<tr><td style="padding: 6px 0; color: #64748b; font-weight: 600;">Nhu cầu B2B / Ghi chú:</td><td style="padding: 6px 0; font-style: italic; color: #475569;">' + notes + '</td></tr>' +
                '</table>' +
              '</div>' +

              '<div style="background-color: #eff6ff; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; color: #1e40af; border: 1px solid #bfdbfe;">' +
                '<div style="font-weight: bold; font-size: 14px; margin-bottom: 6px; color: #1e3a8a;">📅 THỜI GIAN & ĐỊA ĐIỂM SỰ KIỆN:</div>' +
                '• <b>Thời gian:</b> 18 - 20 tháng 09 năm 2026<br>' +
                '• <b>Địa điểm:</b> Trung tâm Hội nghị May Plaza Hotel Thái Nguyên (Số 668 Phan Đình Phùng, TP. Thái Nguyên)' +
              '</div>' +

              '<p style="margin-top: 24px;">Bộ phận Thư ký Ban Tổ Chức sẽ liên hệ trực tiếp với Quý khách trong vòng <b>24 giờ làm việc</b> để gửi vé mời chính thức và hướng dẫn check-in.</p>' +
              
              '<div style="margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 16px;">' +
                '<p style="margin: 0; font-weight: bold; color: #0D3B2E;">BAN TỔ CHỨC DIỄN ĐÀN SME VIỆT NAM 2026</p>' +
                '<p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Hiệp hội DNNVV tỉnh Thái Nguyên (TASME) & Tập đoàn May Plaza</p>' +
              '</div>' +
            '</div>' +

            '<div style="background-color: #f8fafc; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">' +
              'Email xác nhận tự động từ Hệ thống Đăng ký Diễn đàn SME Việt Nam 2026.<br>Hotline hỗ trợ: <b>0815.340.488</b> | Email: <b>contact@tasmethainguyen.vn</b>' +
            '</div>' +
          '</div>';

        MailApp.sendEmail({
          to: email,
          subject: subject,
          htmlBody: htmlTemplate
        });

        emailStatusText = "✅ Đã gửi mail thành công (" + new Date().toLocaleTimeString("vi-VN") + ")";
        emailSentSuccess = true;
      } catch (mailErr) {
        emailStatusText = "❌ Lỗi gửi mail: " + mailErr.toString();
        Logger.log("Lỗi gửi email: " + mailErr.toString());
      }
    }

    // 2. Ghi 9 cột vào Google Sheet (bao gồm Trạng Thái Gửi Email)
    sheet.appendRow([
      timestamp,
      fullName,
      phone,
      email,
      company,
      position,
      detailInfo,
      notes,
      emailStatusText
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Đã ghi dữ liệu vào tab " + targetSheetName,
        emailStatus: emailStatusText,
        emailSuccess: emailSentSuccess
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
