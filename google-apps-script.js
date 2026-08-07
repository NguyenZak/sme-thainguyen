/**
 * GOOGLE APPS SCRIPT FOR SME VIETNAM 2026 LANDING PAGE
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Create column headers in Row 1:
 *    Timestamp | Registration Type | Full Name | Company | Position | Phone | Email | Province | Sector | Networking Needs | Notes | Status
 * 3. Extensions -> Apps Script -> Paste this code
 * 4. Deploy -> New Deployment -> Select type: "Web app"
 * 5. Execute as: "Me", Who has access: "Anyone"
 * 6. Copy Web App URL and set as NEXT_PUBLIC_GOOGLE_SCRIPT_URL in Vercel / .env
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var timestamp = data.timestamp || new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    var regType = data.registrationType || "Đại biểu tham dự";
    var fullName = data.fullName || "";
    var company = data.company || "";
    var position = data.position || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var province = data.province || "";
    var sector = data.sector || "";
    var networkingNeeds = data.networkingNeeds || "";
    var notes = data.notes || "";
    var status = "Đã nhận đăng ký";

    // Append row to Google Sheet
    sheet.appendRow([
      timestamp,
      regType,
      fullName,
      company,
      position,
      "'" + phone,
      email,
      province,
      sector,
      networkingNeeds,
      notes,
      status
    ]);

    // Send Confirmation Email if Email is provided
    if (email && email.indexOf("@") !== -1) {
      sendConfirmationEmail(email, fullName, company, regType, phone);
    }

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Đăng ký thành công",
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirmationEmail(recipientEmail, fullName, company, regType, phone) {
  var subject = "[TASME 2026] XÁC NHẬN ĐĂNG KÝ THAM DỰ DIỄN ĐÀN SME VIỆT NAM 2026";
  
  var htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
      <div style="background-color: #0B5ED7; padding: 24px; text-align: center; color: #FFFFFF;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase;">DIỄN ĐÀN KẾT NỐI GIAO THƯƠNG SME VIỆT NAM 2026</h1>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #F4B400; font-weight: bold;">TASME THÁI NGUYÊN • 18–20/09/2026</p>
      </div>
      
      <div style="padding: 24px; color: #1A1A1A;">
        <p style="font-size: 15px; font-weight: bold;">Kính gửi Ông/Bà: ${fullName},</p>
        <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
          Ban tổ chức <strong>Hiệp hội Doanh nghiệp nhỏ và vừa tỉnh Thái Nguyên (TASME)</strong> trân trọng cảm ơn Ông/Bà và <strong>${company}</strong> đã đăng ký tham dự Diễn đàn Kết nối Giao thương SME Việt Nam 2026.
        </p>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <h3 style="margin-top: 0; font-size: 14px; color: #1D3557; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px;">THÔNG TIN ĐĂNG KÝ:</h3>
          <table style="width: 100%; font-size: 13px; color: #374151;" cellpadding="4">
            <tr><td><strong>Họ và tên:</strong></td><td>${fullName}</td></tr>
            <tr><td><strong>Doanh nghiệp:</strong></td><td>${company}</td></tr>
            <tr><td><strong>Số điện thoại:</strong></td><td>${phone}</td></tr>
            <tr><td><strong>Hình thức:</strong></td><td style="color: #0B5ED7; font-weight: bold;">${regType}</td></tr>
            <tr><td><strong>Trạng thái:</strong></td><td style="color: #059669; font-weight: bold;">Đã tiếp nhận</td></tr>
          </table>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; padding: 12px; background: #FFFFFF; border: 1px border-dashed #CBD5E1; border-radius: 12px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullName + '-' + phone)}" alt="QR Code Checkin" width="130" height="130" style="display: block; margin: 0 auto;" />
            <span style="font-size: 11px; color: #64748B; font-weight: bold; margin-top: 6px; display: block;">MÃ QR CHECK-IN SỰ KIỆN</span>
          </div>
        </div>
        
        <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; font-size: 13px; color: #78350F;">
          <p style="margin: 0; font-weight: bold;">📍 ĐỊA ĐIỂM & THỜI GIAN SỰ KIỆN:</p>
          <p style="margin: 6px 0 0 0;">• <strong>Thời gian:</strong> 18 – 20 tháng 09 năm 2026</p>
          <p style="margin: 4px 0 0 0;">• <strong>Địa điểm:</strong> Khách sạn May Plaza Hotel, Số 668 Phan Đình Phùng, TP. Thái Nguyên</p>
        </div>

        <p style="font-size: 13px; color: #4B5563; margin-top: 24px;">
          Bộ phận thư ký sự kiện sẽ liên hệ trực tiếp với Ông/Bà để hướng dẫn hoàn tất thủ tục vé và công tác hậu cần.
        </p>
      </div>

      <div style="background-color: #1E293B; padding: 16px; text-align: center; color: #94A3B8; font-size: 12px;">
        <p style="margin: 0;"><strong>BAN TỔ CHỨC DIỄN ĐÀN SME VIỆT NAM 2026</strong></p>
        <p style="margin: 4px 0 0 0;">Hotline: 0815 340 488 | Email: contact@tasmethainguyen.vn</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: recipientEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}
