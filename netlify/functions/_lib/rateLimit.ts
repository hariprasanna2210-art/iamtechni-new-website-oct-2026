interface RateLimitEntry {
  timestamps: number[];
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function getClientIp(
  headers?: Record<string, string | string[] | undefined> | null
): string {
  if (!headers) return 'unknown';

  const lookup = (key: string): string | undefined => {
    const val = headers[key] ?? headers[key.toLowerCase()];
    if (Array.isArray(val)) return val[0];
    return val;
  };

  const netlifyIp = lookup('x-nf-client-connection-ip');
  if (netlifyIp) return netlifyIp.trim();

  const forwardedFor = lookup('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = lookup('x-real-ip') || lookup('client-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

export function checkRateLimit(
  clientIp: string,
  bucket = 'default',
  maxRequests = 20,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  let bucketMap = stores.get(bucket);
  if (!bucketMap) {
    bucketMap = new Map<string, RateLimitEntry>();
    stores.set(bucket, bucketMap);
  }

  const key = clientIp || 'unknown';
  const entry = bucketMap.get(key) || { timestamps: [] };

  // Remove expired timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldestInWindow)) / 1000));
    bucketMap.set(key, entry);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  entry.timestamps.push(now);
  bucketMap.set(key, entry);

  // Periodic cleanup to avoid unbounded memory growth
  if (bucketMap.size > 2_000) {
    for (const [ipKey, val] of bucketMap.entries()) {
      const active = val.timestamps.filter((ts) => now - ts < windowMs);
      if (active.length === 0) {
        bucketMap.delete(ipKey);
      } else {
        val.timestamps = active;
      }
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - entry.timestamps.length),
    retryAfterSeconds: 0,
  };
}
