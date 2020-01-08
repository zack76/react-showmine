import BaseService from './BaseService';
import {Config} from '../Config';
class CartService {
    getCartItems = companyId => BaseService.get2(Config.webApi + 'api/company/cart/' + companyId);
    addCartItems = (companyId, params) => BaseService.post(Config.webApi + 'api/company/cart/' + companyId, params);
    updateCartItems = (companyId, params) => BaseService.put(Config.webApi + 'api/company/cart/' + companyId, params);
    clearCartItems = companyId => BaseService.delete(Config.webApi + 'api/company/cart/' + companyId);
}
const cartService = new CartService();
export default cartService ;

