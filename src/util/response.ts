import * as Koa from 'koa';

/**
 * 返回值封装
 *
 * @export
 * @param {Koa.Context} ctx
 * @param {Number} status
 * @param {any} data
 */

export interface Response {
    msg?: string;
    data?: any;
}

const response = (ctx: Koa.ExtendableContext, status: number = 200, result: Response = {msg: 'success'}) => {
    ctx.body = {
        code: status,
        result,
        timestamp: Date.now()
    };
};
export default response;
