import BaseService from './BaseService';
import {Config} from '../Config';
class UserService {
    getUser = params => BaseService.get(Config.webApi + 'user/'+ params);
}
const userService = new UserService();
export default userService;
