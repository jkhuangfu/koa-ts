const authId = ['ox5xSuH5ZNfa0AFt5XdB7pFriEM0', 'ox5xSuEo5joUlCN2_tA2FFZ48Qu4'];
const createRandom = (num: number) => {
  const str = '23QWERTYUPASDFGHJKLZXCVBNM456789zxcvbnmasdfghjkqwertyup';
  let res: string = '';
  for (let i = 0; i < num; i++) {
    res += str[Math.floor(Math.random() * str.length)];
  }
  return res;
};
const handleReply = async (xmlJson: any) => {
  const { MsgType, Content, FromUserName, Event } = xmlJson;
  let content = null;
  if (MsgType === 'text') {
    if (Content.indexOf('获取令牌') === 0 && authId.includes(FromUserName)) {
      const code: string = createRandom(4);
      await redisDb.set(FromUserName + '_code', code, 5 * 60);
      content = '您的令牌验证码是:【' + code + '】,5分钟有效哦~';
    } else {
      content = '你说的我还不懂哦~';
    }
  } else if (MsgType === 'event') {
    // 关注或取关
    if (Event === 'subscribe') {
      content = '终于等到你，还好我没放弃!';
    }
  } else {
    LOG4.http.info('不支持的微信接收信息', MsgType);
    content = '暂不支持该类型信息~';
  }
  return content;
};

export default handleReply;
