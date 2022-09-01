import { createPool, MysqlError, PoolConnection } from 'mysql';
import { mysqlDev, mysqlOnline } from '@/config/mysql';
import LOG4 from './log4js';

const { NODE_ENV } = process.env;
const mysqlConfig = NODE_ENV === 'development' ? mysqlDev : mysqlOnline;
/* 使用连接池,开启多sql查询 */
const pool = createPool(Object.assign({ multipleStatements: true }, mysqlConfig));

interface DbResult {
  code: number;
  msg?: MysqlError | string;
  result?: any;
}

interface DB {
  /**
   * @description 数据库操作方法
   * @param {string} sql sql操作语句
   * @param {any[]} query sql查询值
   * @returns {*} Promise<{code:number,msg?:Error,result:any}>
   */
  handle: (sql: string, query: any[]) => Promise<DbResult>;
}

export class MysqlImpl implements DB {
  handle(sql: string, query: any[]): Promise<DbResult> {
    return new Promise((resolve: (value: DbResult) => void) => {
      pool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) {
          LOG4.http.error('数据库错误', err);
          resolve({ code: 500, msg: err });
          return false;
        }
        try {
          connection.query(sql, query, (e, response) => {
            if (e) {
              LOG4.http.error('数据库错误', e);
              resolve({ code: 500, msg: e });
            } else {
              resolve({ code: 200, result: response });
            }
            connection.release();
          });
        } catch (error) {
          LOG4.http.error('数据库错误', error);
          resolve({ code: 500, msg: `程序异常，sql操作失败--->${error}` });
        }
      });
    });
  }
}

export default new MysqlImpl();
