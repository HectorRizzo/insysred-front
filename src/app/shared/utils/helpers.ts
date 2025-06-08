
export function timestampToDateTime(timestamp: number): Date {
    const date = new Date(timestamp * 1000);
    return date;
}

export function dateTimeToTimestamp(date: Date): number {
    return date.getTime() / 1000;
}