import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  try {
    // Chỉ admin đã đăng nhập mới được duyệt thanh toán (route dùng service role, bỏ qua RLS)
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json(
        { success: false, message: "Không có quyền truy cập. Vui lòng đăng nhập CMS." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, record: clientRecord } = body;

    if (!id && !clientRecord?.id) {
      return NextResponse.json({ success: false, message: "Thiếu ID bản ghi đăng ký" }, { status: 400 });
    }

    const regId = id || clientRecord?.id;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl) {
      return NextResponse.json({ success: false, message: "Thiếu cấu hình Supabase" }, { status: 500 });
    }

    // 1. Initialize Supabase client
    let supabase: any;
    if (serviceRoleKey) {
      supabase = createClient(supabaseUrl, serviceRoleKey);
    } else {
      try {
        const cookieStore = await cookies();
        supabase = createServerSupabaseClient(cookieStore);
      } catch {
        supabase = createClient(supabaseUrl, anonKey || "");
      }
    }

    // 2. Fetch or use registration details
    let record = clientRecord;
    if (!record) {
      const { data: dbRecord } = await supabase
        .from("registrations")
        .select("*")
        .eq("id", regId)
        .single();
      if (dbRecord) record = dbRecord;
    }

    if (!record && anonKey) {
      const { data: anonRecord } = await createClient(supabaseUrl, anonKey)
        .from("registrations")
        .select("*")
        .eq("id", regId)
        .single();
      if (anonRecord) record = anonRecord;
    }

    if (!record) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy thông tin đăng ký (ID: ${regId})` },
        { status: 404 }
      );
    }

    // 3. Update status to completed in database
    await supabase
      .from("registrations")
      .update({ status: "completed" })
      .eq("id", regId);

    // 4. Fetch CMS Settings & Registration Email templates
    const { data: sections } = await supabase
      .from("site_sections")
      .select("id, content");

    let googleSheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || process.env.GOOGLE_SCRIPT_URL || "";
    let googleSheetEnabled = true;
    let telegramToken = process.env.TELEGRAM_BOT_TOKEN || "";
    let telegramChatId = process.env.TELEGRAM_CHAT_ID || "";
    let telegramEnabled = true;
    let registrationContent: any = {};

    if (sections && sections.length > 0) {
      sections.forEach((sec: any) => {
        if (sec.id === "site_config") {
          const cfg = sec.content || {};
          if (cfg.googleSheetScriptUrl) googleSheetUrl = cfg.googleSheetScriptUrl;
          if (cfg.googleSheetEnabled !== undefined) googleSheetEnabled = cfg.googleSheetEnabled;
          // Bot token chỉ lấy từ biến môi trường (không lưu trong config public-read)
          if (cfg.telegramChatId) telegramChatId = cfg.telegramChatId;
          if (cfg.telegramEnabled !== undefined) telegramEnabled = cfg.telegramEnabled;
        } else if (sec.id === "registration") {
          registrationContent = sec.content || {};
        }
      });
    }

    const fullName = record.full_name || "N/A";
    const email = record.email || "";
    const phone = record.phone || "N/A";
    const company = record.company_name || "N/A";
    const position = record.position || "N/A";
    const ticketType = record.ticket_type || "Vé tham dự";
    // Helper to extract canonical registration code (Mã đăng ký = Nội dung CK = Mã vé)
    function getCanonicalRegistrationCode(rec: any, fallbackId: string): string {
      if (rec?.registrationId) return rec.registrationId;
      if (rec?.clientRegId) return rec.clientRegId;
      if (rec?.registrationCode) return rec.registrationCode;
      
      const notes = rec?.notes || "";
      const match = notes.match(/SME2026-[A-Z0-9]+/i);
      if (match) return match[0].toUpperCase();

      if (rec?.id) return `SME2026-${rec.id.slice(0, 6).toUpperCase()}`;
      return fallbackId ? `SME2026-${fallbackId.slice(0, 6).toUpperCase()}` : `SME2026-123456`;
    }

    const registrationCode = getCanonicalRegistrationCode(record || clientRecord, regId);

    // Helper to identify form category
    function getFormCategory(tType: string): "delegate" | "sponsor" | "booth" {
      const t = (tType || "").toLowerCase();
      if (t.includes("sponsor") || t.includes("tài trợ") || t.includes("gói tài trợ")) return "sponsor";
      if (t.includes("booth") || t.includes("gian hàng") || t.includes("gian")) return "booth";
      return "delegate";
    }

    const category = getFormCategory(ticketType);
    let emailSubject = "";
    let paymentBody = "";
    let posterUrl = "";

    if (category === "sponsor") {
      emailSubject = registrationContent.sponsorEmailSubject || `[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ NHÀ TÀI TRỢ & ĐỐI TÁC - ${registrationCode}`;
      paymentBody = registrationContent.sponsorEmailBody || "Trân trọng cảm ơn Quý Doanh nghiệp đã đăng ký đồng hành cùng Diễn đàn SME Việt Nam 2026. Ban Thư ký sẽ liên hệ trao đổi chi tiết về các quyền lợi tài trợ & hiện diện thương hiệu.";
      posterUrl = registrationContent.sponsorPosterUrl || "";
    } else if (category === "booth") {
      emailSubject = registrationContent.boothEmailSubject || `[SME VIỆT NAM 2026] XÁC NHẬN ĐĂNG KÝ GIAN HÀNG TRIỂN LÃM - ${registrationCode}`;
      paymentBody = registrationContent.boothEmailBody || "Cảm ơn Quý đơn vị đã đăng ký gian hàng triển lãm tại May Plaza Hotel Thái Nguyên. Bộ phận tư vấn sơ đồ gian hàng sẽ liên hệ xác nhận vị trí gian hàng của Quý đơn vị.";
      posterUrl = registrationContent.boothPosterUrl || "";
    } else {
      const customSub = registrationContent.delegateEmailSubject;
      emailSubject = (customSub && customSub.includes("THANH TOÁN")) 
        ? customSub 
        : `[SME VIỆT NAM 2026] XÁC NHẬN THANH TOÁN THÀNH CÔNG - ${registrationCode}`;

      const customText = registrationContent.delegateEmailBody;
      paymentBody = (customText && customText.includes("thanh toán")) 
        ? customText 
        : `Ban Tổ Chức Diễn đàn SME Việt Nam 2026 xác nhận đã nhận được khoản thanh toán cho đơn đăng ký của Quý đại biểu {{fullName}}. Vé tham dự của Quý khách đã được kích hoạt thành công!`;
      posterUrl = registrationContent.delegatePosterUrl || "";
    }

    let emailSent = false;
    let emailStatusText = "";

    if (!googleSheetUrl || googleSheetUrl === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      emailStatusText = "Chưa cấu hình Google Apps Script Web App URL trong CMS (Cấu hình chung -> Google Sheets URL).";
    } else if (!email || !email.includes("@")) {
      emailStatusText = "Đơn đăng ký này không có địa chỉ Email hợp lệ.";
    } else if (!googleSheetEnabled) {
      emailStatusText = "Tính năng tự động gửi qua Google Apps Script đang bị Tắt trong Cấu hình chung.";
    }

    // 5. Send Confirmation Email via Google Apps Script
    if (email && email.includes("@") && googleSheetEnabled && googleSheetUrl && googleSheetUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
      try {
        const gsRes = await fetch(googleSheetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            full_name: fullName,
            email,
            phone,
            company,
            company_name: company,
            position,
            ticketType,
            registrationType: ticketType,
            registrationId: registrationCode,
            paymentStatus: "SUCCESS_PAID",
            subject: emailSubject,
            emailSubject: emailSubject,
            customSubject: emailSubject,
            emailBody: paymentBody,
            customBody: paymentBody,
            posterUrl: posterUrl,
            emailPosterUrl: posterUrl,
            timestamp: new Date().toISOString(),
          }),
        });

        const gsData = await gsRes.json().catch(() => ({}));

        if (gsData.status === "success" || gsData.emailSuccess || gsData.emailStatus?.includes("thành công") || gsRes.ok) {
          emailSent = true;
          emailStatusText = gsData.emailStatus || "✅ Đã gửi Email xác nhận thành công!";
        } else {
          emailStatusText = gsData.emailStatus || gsData.message || "Google Apps Script phản hồi nhưng chưa gửi được mail. Hãy kiểm tra Cấp quyền Apps Script!";
        }
      } catch (gsErr: any) {
        console.warn("Failed to dispatch payment confirmation email via Google Apps Script:", gsErr);
        emailStatusText = `Không thể kết nối tới Google Apps Script URL: ${gsErr?.message || "Lỗi mạng"}`;
      }
    }

    // 6. Send Telegram alert to BTC
    if (telegramEnabled && telegramToken && telegramChatId) {
      try {
        const tgMsg =
          `🟢 <b>XÁC NHẬN THÀNH CÔNG (CMS)</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `🎟️ <b>Mã ĐK:</b> ${registrationCode}\n` +
          `👤 <b>Họ tên:</b> ${fullName}\n` +
          `🏢 <b>Công ty:</b> ${company}\n` +
          `💼 <b>Chức vụ:</b> ${position}\n` +
          `📞 <b>Số điện thoại:</b> ${phone}\n` +
          `📧 <b>Email:</b> ${email}\n` +
          `📋 <b>Hạng vé/Gian:</b> ${ticketType}\n` +
          `✉️ <b>Trạng thái Mail:</b> ${emailSent ? "✅ Đã gửi Email xác nhận" : "⚠️ " + emailStatusText}\n` +
          `⏰ <i>Thời gian duyệt: ${new Date().toLocaleString("vi-VN")}</i>`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: tgMsg,
            parse_mode: "HTML",
          }),
        }).catch(() => {});
      } catch (tgErr) {
        console.warn("Failed to send Telegram alert for manual payment confirmation:", tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      emailStatusText,
      message: emailSent
        ? `Đã xác nhận thành công cho ${fullName} & ✅ Đã gửi Email xác nhận!`
        : `Đã cập nhật trạng thái cho ${fullName}. ⚠️ (${emailStatusText})`,
      record: { ...record, status: "completed" },
    });
  } catch (err: any) {
    console.error("Manual Payment Confirmation Error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
