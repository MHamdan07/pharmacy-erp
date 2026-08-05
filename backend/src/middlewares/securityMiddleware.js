// Custom Security Middleware: Rate Limiter, Input Sanitizer, Security Headers

// In-memory rate limiting map
const ipRequestMap = new Map();

export const rateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 5000 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!ipRequestMap.has(ip)) {
      ipRequestMap.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    const record = ipRequestMap.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + options.windowMs;
      return next();
    }

    record.count += 1;
    if (record.count > options.max) {
      return res.status(429).json({
        message: 'Too many requests from this IP address. Please try again later.'
      });
    }

    next();
  };
};

export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};
