import * as cheerio from 'cheerio';
import * as Koa from 'koa';

const spiderData = async (ctx: Koa.Context) => {
  const html: any = await $http.get('http://ivi.bupt.edu.cn/');
  const $ = cheerio.load(html);
  const clear = 'truncate table tb_tv';
  let insert: string = 'INSERT INTO  tb_tv (tv_name,tv_url,is_hd,role) values ';
  const result: Array<{ name: any; url: string | undefined; type: number }> = [];
  $('.2u').each((i: number) => {
    const tvName: any = $('.2u').eq(i).find('p').eq(0).html();
    const unName: any = unescape(tvName.replace(/&#x/g, '%u').replace(/;/g, ''));
    const url = $('.2u').eq(i).find('.icon1').eq(1).attr('href');
    result.push({
      name: unName,
      url: 'http://ivi.bupt.edu.cn' + url,
      type: unName.indexOf('高清') > 0 ? 1 : 0
    });
  });

  result.map((item: any, index: number) => {
    const { name, url, type } = item;
    insert += `('${name}','${url}','${type}',1)${index < result.length - 1 ? ',' : ''}`;
  });
  await DB.handle(clear, []);
  await DB.handle(insert, []);

  response(ctx, 200, { data: result });
};

export default spiderData;
