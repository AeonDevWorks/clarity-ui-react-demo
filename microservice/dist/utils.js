"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskPII = maskPII;
function maskPII(html) {
    // Simple regex-based masking for demo purposes.
    // NOTE: This is not a comprehensive PII solution.
    let masked = html;
    // Mask Emails (simplify regex for performance and safety)
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    masked = masked.replace(emailRegex, '__MASKED_EMAIL__');
    // Mask Phone Numbers (Generic 10-digit patterns)
    // Matches (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g;
    masked = masked.replace(phoneRegex, '__MASKED_PHONE__');
    return masked;
}
