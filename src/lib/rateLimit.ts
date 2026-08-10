/**
 * Rate limiter cơ bản (in-memory, fixed window) chống spam/abuse.
 *
 * Lưu ý: bộ nhớ theo từng instance server. Trên môi trường serverless nhiều
 * instance, giới hạn chỉ mang tính tương đối. Nếu cần chặt chẽ, dùng Redis/
 * Upstash. Đủ để chặn spam cơ bản cho form đăng ký & tracking.
 */
type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Dọn định kỳ để tránh Map phình vô hạn
  if (store.size > 10000) {
    for (const [k, b] of store) {
      if (now >= b.resetAt) store.delete(k);
    }
  }

  const bucket = store.get(key);
  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  return { ok: true, retryAfter: 0 };
}

/** Lấy IP client từ header proxy (x-forwarded-for / x-real-ip). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
