import { createPool, MysqlError, PoolConnection } from 'mysql';
import { mysqlDev, mysqlOnline } from '@/config/mysql';

const { NODE_ENV } = process.env;
const mysqlConfig = NODE_ENV === 'development' ? mysqlDev : mysqlOnline;
/* 使用连接池,开启多sql查询 */
const pool = createPool(Object.assign({ multipleStatements: true }, mysqlConfig));

interface DBRESULT {
  code: number;
  msg?: MysqlError | string;
  result?: any;
}
export default class DB {
  /**
   * @description 数据库操作方法
   * @param {string} sql sql操作语句
   * @param {any[]} query sql查询值
   * @returns {*} Promise<{code:number,msg?:Error,result:any}>
   */
  public static handle(sql: string, query: any[]): Promise<DBRESULT> {
    return new Promise((resolve: (value: DBRESULT) => void) => {
      pool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) {
          resolve({ code: 500, msg: err });
          return false;
        }
        try {
          connection.query(sql, query, (e, response) => {
            if (e) {
              resolve({ code: 500, msg: e });
            } else {
              resolve({ code: 200, result: response });
            }
            connection.release();
          });
        } catch (error) {
          resolve({ code: 500, msg: `程序异常，sql操作失败--->${error}` });
        }
      });
    });
  }
}
