import * as Koa from 'koa';

/**
 * 返回值封装
 *
 * @export
 * @param {Koa.ExtendableContext} ctx
 * @param {Number} status
 * @param {any} data
 * @param {String} msg
 */

export interface Response {
  data?: any;
}

const response = (
  ctx: Koa.ExtendableContext,
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
