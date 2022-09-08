import * as Koa from 'koa';
import { verify } from 'jsonwebtoken';
import { Mysql, response } from '@/util';

const getTvList = async (ctx: Koa.Context) => {
  const { authorization } = ctx.header;
  const user = authorization && verify(authorization.replace(/\"/g, ''), ctx.JWT_SECRET_KEY);
  let role: number = 0;
  if (user) {
    // 非VIP
    role = 1;
  }
  const sql = `select * from tb_tv where role <= ${role}`;
  const result = await Mysql.handle(sql, []);
  if (result.code === 500) {
    return response(ctx, 500, { data: null }, '信息查询失败');
  }
  const res: any =
    role === 0
      ? {
          hd: [],
          bq: []
        }
      : {
          hd: [],
          bq: [],
          vip: []
        };
  result.result.map((item: any) => {
    if (role === 0) {
      if (item.is_hd === 1) {
        res.hd.push(item);
      } else if (item.is_hd === 0) {
        res.bq.push(item);
      }
    } else {
      if (item.is_hd === 1) {
        res.hd.push(item);
      } else if (item.is_hd === 0) {
        res.bq.push(item);
      } else {
        res.vip.push(item);
      }
    }
  });
  response(ctx, 200, res);
};

export default getTvList;
