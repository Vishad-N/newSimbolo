export declare class DateUtil {
    static nowIso(): string;
    static addDays(days: number, fromDate?: Date): Date;
    static addMinutes(minutes: number, fromDate?: Date): Date;
    static isExpired(expirationDate: Date): boolean;
}
