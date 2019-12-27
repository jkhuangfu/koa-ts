interface RedisConfig {
  ip: string;
  port: number;
  db: number;
}

export const configDev: RedisConfig = {
  ip: '127.0.0.1',
  port: 6379,
  db: 0
};
export const configProd: RedisConfig = {
  ip: '127.0.0.1',
  port: 6379,
  db: 0
};
