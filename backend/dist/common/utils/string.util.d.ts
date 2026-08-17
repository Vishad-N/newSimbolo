export declare class StringUtil {
    static slugify(text: string): string;
    static generateRandomToken(bytes?: number): string;
    static generateOrderNumber(prefix?: string): string;
    static sanitizeHtml(text: string): string;
}
