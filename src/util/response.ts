import * as Koa from 'koa';

/**
 * 返回值封装
 *
 * @export
 * @param {Koa.Context} ctx
 * @param {number} status
 * @param {any} data
 * @param {string} msg
 */

export interface Response {
  data?: any;
}

const response = (
  ctx: Koa.Context,
  status: number = 200,
  result: Response = { data: null },
  msg: string = 'success'
) => {
  ctx.body = {
    code: status,
    result,
    msg,
    timestamp: Date.now()
  };
};
export default response;
