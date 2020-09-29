import * as Koa from 'koa';
import { dev, prod } from '@/config/auth';
const { NODE_ENV } = process.env;
const {
  ding: { appkey, appsecret, loginAppId, loginAppSecret }
} = NODE_ENV === 'development' ? dev : prod;

/**
 * @API https://ding-doc.dingtalk.com/doc#/serverapi2/kymkv6
 * @description 通过临时授权码获取个人信息
 * @param  {string} code
 * @retutn  {nick: '',unionid: '',dingId: '',openid: '',}
 */

export const getUserInfoByTmpAuthCode = async (ctx: Koa.Context) => {
  const { code } = getParams(ctx);
  const timestamp = Date.now();
  const signature = encryption.hmac(timestamp.toString(), 'sha256', loginAppSecret);
  const baseUrl = 'https://oapi.dingtalk.com/sns/getuserinfo_bycode';
  const params = `?accessKey=${loginAppId}&timestamp=${timestamp}&signature=${encodeURIComponent(signature)}`;
  const data: any = await $http.post(baseUrl + params, { tmp_auth_code: code });
  LOG4.http.info('通过临时授权码获取个人信息:', JSON.stringify(data));
  return data?.user_info;
};

/**
 * @description 获取钉钉access_token
 * @return {string} access_token
 */
export const getAccessToken = async () => {
  const requestUrl = 'https://oapi.dingtalk.com/gettoken';
  const data: any = await $http.get(requestUrl, { params: { appkey, appsecret } });
  LOG4.http.info('获取access_tokeen', JSON.stringify(data));
  const { access_token } = data;
  return access_token || '';
};

/**
 * @API https://ding-doc.dingtalk.com/doc#/serverapi2/ege851#602f4b15
 * @description 根据unionid获取userid
 * @return {string} userid 用户id
 */
export const getUseridByUnionId = async (accessToken: string, unionid: string) => {
  const requestUrl = 'https://oapi.dingtalk.com/user/getUseridByUnionid';
  const data: any = await $http.get(requestUrl, { params: { access_token: accessToken, unionid } });
  // 返回样例 {"errcode": 0,"errmsg": "ok","contactType": 0,"userid": "userid1"}
  LOG4.http.info('根据unionid获取userid', JSON.stringify(data));
  const { userid } = data;
  return userid || 0;
};

/**
 * @API https://ding-doc.dingtalk.com/doc#/serverapi2/ege851/AaRQe
 * @description 根据userid获取用户信息
 * @return {string} userid 用户id
 */
export const getUserDetailByUserid = async (ctx: Koa.Context) => {
  const url = 'https://oapi.dingtalk.com/user/get';
  const accessToken = await getAccessToken();
  const { unionid } = await getUserInfoByTmpAuthCode(ctx);
  const userid = await getUseridByUnionId(accessToken, unionid);
  const data: any = await $http.get(url, { params: { access_token: accessToken, userid } });
  const { errcode } = data;
  if (errcode === 60121) {
    // 用户不属于当前企业
  } else if (errcode === 0) {
    // 返回正常信息
  }
  LOG4.http.debug('根据userid获取用户信息', JSON.stringify(data));

  // console.log(data);
};
