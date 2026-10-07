// Event Module Configuration
export const ADMIN_PASSWORD = "C3ADMIN.2025";
export const REGISTRATION_DEADLINE = "2026-10-07T15:00:00+05:30";
export const EVENT_ENABLED = true;

export function isValidRoll(roll) {
    if (typeof roll !== 'string') return false;
    if (!roll.startsWith('256')) return false;
    const numStr = roll.substring(3);
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return false;

    if (num >= 1 && num <= 99) {
        return numStr.length === 2; // must be exactly 2 digits (e.g., '01' to '99')
    } else if (num >= 100 && num <= 120) {
        return numStr.length === 3; // must be exactly 3 digits (e.g., '100' to '120')
    }
    return false;
}
