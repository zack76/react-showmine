import BaseService from './BaseService';
import {Config} from '../Config';
class JielongService {
    addJielong = (params, id) => BaseService.post(Config.webApi + 'jielong/'+ id +'/subitems', params);
    generateVoucher = (params, id) => BaseService.post(Config.webApi + 'jielong/voucher/'+ id, params);
    getIsInCurrentJieLong = (id) => BaseService.get2(Config.webApi + 'jielong/isInJielong/'+ id);
    cancelJielong = (id, url, params) => BaseService.delete(Config.webApi + 'comment/'+ id + '?item_url=' + url, params);
    updateJielong = (params, id) => BaseService.put(Config.webApi + 'jielong/'+ id +'/subitems', params);
    getAllJielong = (id) => BaseService.get2(Config.webApi + 'jielong/getAllJielong/'+ id);
    createJielongComment = (itemId, params) => BaseService.post(Config.webApi + 'comment/item/' + itemId, params);
    updateJielongComment = (jieLongId, params) => BaseService.put(Config.webApi + 'comment/' + jieLongId, params);

}

const jielongService = new JielongService();
export default jielongService;
