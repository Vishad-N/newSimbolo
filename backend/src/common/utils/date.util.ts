export class DateUtil {
  static nowIso(): string {
    return new Date().toISOString();
  }

  static addDays(days: number, fromDate: Date = new Date()): Date {
    const result = new Date(fromDate);
    result.setDate(result.getDate() + days);
    return result;
  }

  static addMinutes(minutes: number, fromDate: Date = new Date()): Date {
    const result = new Date(fromDate);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  static isExpired(expirationDate: Date): boolean {
    return new Date() > new Date(expirationDate);
  }
}
