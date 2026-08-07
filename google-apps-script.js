/**
 * HƯỚNG DẪN TỰ ĐỘNG ĐẨY ĐĂNG KÝ VÀO 3 TAB SHEET & GỬI EMAIL XÁC NHẬN TỰ ĐỘNG CHO KHÁCH HÀNG
 * 
 * Tính năng chính:
 *  1. Phân loại ghi dữ liệu vào 3 Tab Google Sheet: "Đại biểu", "Tài trợ", "Gian hàng".
 *  2. TỰ ĐỘNG GỬI 1 EMAIL XÁC NHẬN GIAO DIỆN CHUYÊN NGHIỆP TỚI EMAIL NGƯỜI ĐIỀN FORM!
 * 
 * BƯỚC 1: Mở file Google Sheet của bạn trên trình duyệt.
 * BƯỚC 2: Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * BƯỚC 3: Xóa hết mã cũ và dán toàn bộ đoạn mã bên dưới vào file Code.gs.
 * BƯỚC 4: Bấm nút "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Quản lý bản triển khai" hoặc "Tạo bản triển khai mới" (New deployment).
 * BƯỚC 5: 
 *    - Loại triển khai (Select type): Chọn "Ứng dụng web" (Web App).
 *    - Thực thi dưới danh nghĩa (Execute as): Chọn "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone). -> RẤT QUAN TRỌNG!
 * BƯỚC 6: Bấm "Triển khai" (Deploy) -> Cấp quyền gửi Mail nếu Google hỏi -> Copy Web App URL dán vào CMS Admin.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Phân loại ghi vào đúng Tab (Sheet) theo 3 Tab trong file Google Sheet
    var ticketType = (data.registrationType || data.intentTab || "").toLowerCase();
    var targetSheetName = "Đại biểu";

    if (ticketType.indexOf("booth") !== -1 || ticketType.indexOf("gian hàng") !== -1 || ticketType.indexOf("gian") !== -1) {
      targetSheetName = "Gian hàng";
    } else if (ticketType.indexOf("sponsor") !== -1 || ticketType.indexOf("tài trợ") !== -1) {
      targetSheetName = "Tài trợ";
    }

    var sheet = ss.getSheetByName(targetSheetName);
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Đăng Ký",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email",
        "Tên Doanh Nghiệp / Đơn Vị",
        "Chức Vụ",
        "Chi Tiết Đăng Ký",
        "Ghi Chú / Nhu Cầu"
      ]);
      var headerRange = sheet.getRange("A1:H1");
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
    var detailInfo = data.registrationType || data.intentTab || "N/A";
    var notes = data.notes || data.networkingNeeds || "Không có";

    // 1. Ghi vào Google Sheet
    sheet.appendRow([
      timestamp,
      fullName,
      phone,
      email,
      company,
      position,
      detailInfo,
      notes
    ]);

    // 2. Gửi Email Tự Động Xác Nhận tới Email Khách Hàng (Dùng dịch vụ Gmail có sẵn)
    if (email && email.indexOf("@") !== -1) {
      try {
        var regId = "SME2026-" + Math.floor(100000 + Math.random() * 900000);
        var subject = "[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ THÀNH CÔNG - " + fullName.toUpperCase();
        
        var htmlTemplate = 
          '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">' +
            '<div style="background-color: #0D3B2E; color: #ffffff; padding: 24px; text-align: center;">' +
              '<h1 style="margin: 0; font-size: 18px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026</h1>' +
              '<p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0;">May Plaza Hotel Thái Nguyên | 18 - 20/09/2026</p>' +
            '</div>' +

            '<div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 14px;">' +
              '<p>Kính gửi <b>' + fullName + '</b>,</p>' +
              '<p>Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xin chân thành cảm ơn Quý khách đã đăng ký thông tin tham dự sự kiện.</p>' +

              '<div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #22c55e; border-radius: 8px; padding: 16px; margin: 20px 0;">' +
                '<h3 style="margin: 0 0 12px 0; font-size: 14px; color: #0f172a; text-transform: uppercase;">📋 THÔNG TIN ĐĂNG KÝ CỦA QUÝ KHÁCH:</h3>' +
                '<table style="width: 100%; border-collapse: collapse; font-size: 13px;">' +
                  '<tr><td style="padding: 4px 0; color: #64748b; width: 150px;">Mã xác nhận:</td><td style="padding: 4px 0; font-weight: bold; color: #0D3B2E;">' + regId + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Họ và Tên:</td><td style="padding: 4px 0; font-weight: bold;">' + fullName + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Số điện thoại:</td><td style="padding: 4px 0; font-weight: bold;">' + phone + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Email:</td><td style="padding: 4px 0; font-weight: bold;">' + email + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Doanh nghiệp:</td><td style="padding: 4px 0; font-weight: bold;">' + company + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Chức vụ:</td><td style="padding: 4px 0; font-weight: bold;">' + position + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Chi tiết đăng ký:</td><td style="padding: 4px 0; font-weight: bold; color: #d97706;">' + detailInfo + '</td></tr>' +
                  '<tr><td style="padding: 4px 0; color: #64748b;">Nhu cầu / Ghi chú:</td><td style="padding: 4px 0; font-style: italic;">' + notes + '</td></tr>' +
                '</table>' +
              '</div>' +

              '<div style="background-color: #eff6ff; border-radius: 8px; padding: 14px; margin: 16px 0; font-size: 13px; color: #1e40af;">' +
                '📍 <b>THỜI GIAN & ĐỊA ĐIỂM SỰ KIỆN:</b><br>' +
                '• <b>Thời gian:</b> 18 - 20 tháng 09 năm 2026<br>' +
                '• <b>Địa điểm:</b> Trung tâm Hội nghị May Plaza Hotel Thái Nguyên (Số 668 Phan Đình Phùng, TP. Thái Nguyên)' +
              '</div>' +

              '<p>Bộ phận Thư ký Ban Tổ Chức sẽ liên hệ với Quý khách trong vòng <b>24 giờ làm việc</b> để hỗ trợ hoàn tất thủ tục.</p>' +
              '<p>Trân trọng,<br><b>BAN TỔ CHỨC DIỄN ĐÀN SME VIỆT NAM 2026</b></p>' +
            '</div>' +

            '<div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">' +
              'Email này được gửi tự động từ Hệ thống Đăng ký Diễn đàn SME Việt Nam 2026.' +
            '</div>' +
          '</div>';

        MailApp.sendEmail({
          to: email,
          subject: subject,
          htmlBody: htmlTemplate
        });
      } catch (mailErr) {
        Logger.log("Lỗi gửi email: " + mailErr.toString());
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Đã ghi dữ liệu vào tab " + targetSheetName + " & gửi email xác nhận!" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
