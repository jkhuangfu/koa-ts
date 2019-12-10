export interface RConfig {
    ip: string;
    port: number;
    db: number;
}

export const configDev:RConfig = {
    ip: '127.0.0.1',
    port: 6379,
    db: 0
};
export const configProd:RConfig = {
    ip: '127.0.0.1',
    port: 6379,
    db: 0
};
