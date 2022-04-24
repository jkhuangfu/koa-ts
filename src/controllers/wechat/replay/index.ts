import * as ejs from 'ejs';
import * as Koa from 'koa';
import { parseXML } from '../utils';
import wx_xml_template from './template';
import handleReply from './handleReply';

// 接收消息 返回 JSON对象
const getXML = async (ctx: Koa.Context) => {
  return await parseXML(getParams(ctx));
};

// 创建消息模板
const createReplyXml = (content: any, fromUsername: string, toUsername: string) => {
  const info: any = {};
  // let type = 'text';
  info.content = content || '';
  // // 判断消息类型
  // if (Array.isArray(content)) {
  //   type = 'news';
  // } else if (typeof content === 'object') {
  //   if (content.hasOwnProperty('type')) {
  //     type = content.type;
  //     info.content = content.content;
  //   } else {
  //     type = 'music';
  //   }
  // }
  info.msgType = 'text';
  info.createTime = Date.now();
  info.toUsername = toUsername;
  info.fromUsername = fromUsername;
  return ejs.compile(wx_xml_template)(info);
};

// 创建回复内容 XML格式
const reply = async (ctx: Koa.Context) => {
  // 根据接收消息类型进行回复
  const xmlJson: any = await getXML(ctx);
  LOG4.http.info('接收到消息', xmlJson);
  const { ToUserName, FromUserName } = xmlJson;
  const content = await handleReply(xmlJson);
  LOG4.http.info('返回xml--->', createReplyXml(content, ToUserName, FromUserName));
  return createReplyXml(content, ToUserName, FromUserName);
};

export default reply;
