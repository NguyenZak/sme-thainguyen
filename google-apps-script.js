/**
 * HƯỚNG DẪN TỰ ĐỘNG ĐẨY ĐĂNG KÝ VÀO 3 TAB SHEET TƯƠNG ỨNG: "Đại biểu", "Tài trợ", "Gian hàng"
 * 
 * Mã Script này tự động phân loại và ghi dữ liệu vào 3 Tab trong file Google Sheet của bạn:
 *  - Form Đăng Ký Đại Biểu   -> Ghi vào Tab: "Đại biểu"
 *  - Form Đăng Ký Tài Trợ    -> Ghi vào Tab: "Tài trợ"
 *  - Form Đăng Ký Gian Hàng  -> Ghi vào Tab: "Gian hàng"
 * 
 * BƯỚC 1: Mở file Google Sheet của bạn trên trình duyệt.
 * BƯỚC 2: Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * BƯỚC 3: Xóa hết mã cũ và dán toàn bộ đoạn mã bên dưới vào file Code.gs.
 * BƯỚC 4: Bấm nút "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Quản lý bản triển khai" hoặc "Tạo bản triển khai mới" (New deployment).
 * BƯỚC 5: 
 *    - Loại triển khai (Select type): Chọn "Ứng dụng web" (Web App).
 *    - Thực thi dưới danh nghĩa (Execute as): Chọn "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): Chọn "Bất kỳ ai" (Anyone). -> RẤT QUAN TRỌNG!
 * BƯỚC 6: Bấm "Triển khai" (Deploy) -> Copy đường dẫn Web App URL dán vào CMS Admin phần "Cấu hình chung, Telegram & Google Sheets".
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Phân loại ghi vào đúng Tab (Sheet) theo tên 3 Tab trong file Google Sheet
    var ticketType = (data.registrationType || data.intentTab || "").toLowerCase();
    var targetSheetName = "Đại biểu"; // Mặc định Form 1

    if (ticketType.indexOf("booth") !== -1 || ticketType.indexOf("gian hàng") !== -1 || ticketType.indexOf("gian") !== -1) {
      targetSheetName = "Gian hàng"; // Tab Form 3
    } else if (ticketType.indexOf("sponsor") !== -1 || ticketType.indexOf("tài trợ") !== -1) {
      targetSheetName = "Tài trợ"; // Tab Form 2
    }

    // Tìm sheet theo tên, nếu chưa có thì tự tạo mới
    var sheet = ss.getSheetByName(targetSheetName);
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
    }

    // Tự động thêm dòng tiêu đề màu đẹp nếu Sheet còn trống
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
    var fullName = data.fullName || data.full_name || "N/A";
    var phone = data.phone || "N/A";
    var email = data.email || "N/A";
    var company = data.company || data.company_name || "N/A";
    var position = data.position || "N/A";
    var detailInfo = data.registrationType || data.intentTab || "N/A";
    var notes = data.notes || data.networkingNeeds || "";

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

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Đã ghi dữ liệu vào tab: " + targetSheetName })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
