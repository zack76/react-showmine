import BaseService from './BaseService';
import {Config} from '../Config';
class PaymentService {
    getToPay = (params) => BaseService.post(Config.webApi + 'payment/paymentUrl', params);
    createOrder = params => BaseService.post(Config.webApi + 'order', params);

}
const paymentService = new PaymentService();
export default paymentService;
