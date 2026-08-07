/**
 * HƯỚNG DẪN TỰ ĐỘNG ĐẨY ĐĂNG KÝ TỪ WEBSITE SỰ KIỆN SME VIỆT NAM 2026 VÀO GOOGLE SHEET
 * 
 * BƯỚC 1: Mở file Google Sheet của bạn trên trình duyệt.
 * BƯỚC 2: Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * BƯỚC 3: Xóa hết mã cũ và dán toàn bộ đoạn code bên dưới vào file `Code.gs`.
 * BƯỚC 4: Bấm nút "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Tạo bản triển khai mới" (New deployment).
 * BƯỚC 5: 
 *    - Loại triển khai (Select type): Chọn "Ứng dụng web" (Web App).
 *    - Mô tả: Nhập "SME 2026 Registration Webhook".
 *    - Thực thi dưới danh nghĩa (Execute as): Chọn "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone). -> RẤT QUAN TRỌNG!
 * BƯỚC 6: Bấm "Triển khai" (Deploy) -> Cấp quyền truy cập nếu Google yêu cầu -> Copy đường dẫn URL Web App (có dạng https://script.google.com/macros/s/.../exec).
 * BƯỚC 7: Dán URL đó vào CMS Admin phần "Cấu hình chung, Telegram & Google Sheets" -> Bấm "Gửi Thử Nghiệm".
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Tự động tạo hàng tiêu đề màu đẹp nếu Sheet còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Đăng Ký",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email",
        "Tên Doanh Nghiệp / Đơn Vị",
        "Chức Vụ",
        "Loại Form / Chi Tiết Đăng Ký",
        "Ghi Chú / Nhu Cầu"
      ]);
      var headerRange = sheet.getRange("A1:H1");
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#ffffff");
    }

    var timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    var fullName = data.fullName || data.full_name || "N/A";
    var phone = data.phone || "N/A";
    var email = data.email || "N/A";
    var company = data.company || data.company_name || "N/A";
    var position = data.position || "N/A";
    var ticketType = data.registrationType || data.intentTab || "N/A";
    var notes = data.notes || data.networkingNeeds || "";

    sheet.appendRow([
      timestamp,
      fullName,
      phone,
      email,
      company,
      position,
      ticketType,
      notes
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Ghi dữ liệu thành công!" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
