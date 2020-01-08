import BaseService from './BaseService';
import {Config} from '../Config';
class AuthService {
    login = params => BaseService.post(Config.webApi + 'login', params);
    register = (params) => BaseService.post(Config.webApi + 'register', params);
    // wechatLogin = (origUrl, authUrl, params) => BaseService.get(Config.webApi + '/wechat/authUrl?apiUrl=http://192.168.2.219:8888/api&origUrl=' + origUrl + '&authUrl=' + authUrl, params);
    wechatLogin = (origUrl, authUrl, params) => BaseService.get2(Config.webApi + '/wechat/authUrl?apiUrl=' + Config.webApi.slice(0, -1) + '&origUrl=' + origUrl + '&authUrl=' + authUrl, params);
    getMe = (params) => BaseService.get2(Config.webApi + '/user/me', params);
    getLoginSubscribeQrCode = (params) => BaseService.post(Config.webApi + 'user/generateLoginSubscribeQr', params);
    checkLoginStatus = (loginLogId, params) => BaseService.get(Config.webApi + 'user/checkSubscribeLoginLog/' + loginLogId, params);
    loginWithTempCode = (code) => BaseService.post(Config.webApi + 'user/validateLoginCode', {login_code: code});

}
const authService = new AuthService();
export default authService;


