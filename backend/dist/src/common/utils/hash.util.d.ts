export declare class HashUtil {
    static hashPassword(password: string, rounds?: number): Promise<string>;
    static comparePassword(plainText: string, hashed: string): Promise<boolean>;
}
