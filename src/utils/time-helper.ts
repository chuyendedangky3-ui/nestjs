export const ms = (timeStr: string): number => {
    const value = parseInt(timeStr);
    const unit = timeStr.slice(-1).toLowerCase();

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return value;
    }
};
