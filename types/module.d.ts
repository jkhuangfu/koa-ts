import {BaseContext} from 'koa';

declare module "koa-body";

declare module 'koa' {
    interface BaseContext {
        render(viewPath: string, locals?: any): Promise<void>;

        session: {
            user: {[index: string]: any};
            verify: string | number;
        };
    }
}
