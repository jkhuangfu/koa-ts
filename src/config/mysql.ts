export interface SQL {
    host: string;
    user: string;
    password: string | number;
    database: string;
    port: number;
}

export const mysqlDev: SQL = {
    host: '127.0.0.1',
    user: 'root',
    password: 'huangfu@1993',
    database: 'blog',
    port: 3306
};
export const mysqlOnline: SQL = {
    host: '127.0.0.1',
    user: 'root',
    password: 'Huangfu@1993!',
    database: 'blog',
    port: 3306
};
