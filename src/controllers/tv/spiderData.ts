import * as http from 'http';
import * as cheerio from 'cheerio';
import Axios from 'axios';

const getData = async () => {
  const html: any = await Axios.get('http://ivi.bupt.edu.cn/');
  const $ = cheerio.load(html);
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

  return result;
};

export default getData;
