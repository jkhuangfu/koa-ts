import * as mysql from 'mysql';
import { mysqlDev, mysqlOnline } from '../config/mysql';

const { NODE_ENV } = process.env;
const mysqlConfig = NODE_ENV === 'development' ? mysqlDev : mysqlOnline;
/* 使用连接池,开启多sql查询 */
const pool = mysql.createPool(Object.assign({ multipleStatements: true }, mysqlConfig));

interface DBRESULT {
  code: number;
  msg?: mysql.MysqlError | string;
  result?: any;
}
export default class DB {
  public static handle(sql: string, query: any[]): any {
    return new Promise((resolve: (value: DBRESULT) => void) => {
      pool.getConnection((err: mysql.MysqlError, connection: mysql.PoolConnection) => {
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
