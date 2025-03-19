import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 500, // Limit each IP to 300 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  headers: true,
});

export const strictRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: { error: "Too many requests, slow down!" },
  headers: true,
});
