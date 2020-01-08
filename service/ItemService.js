import BaseService from './BaseService';
import {Config} from '../Config';
class ItemService {
    getItemDetail = (itemId)=> BaseService.get(Config.webApi + 'item/'+ itemId);
    getItemDetailBySlug = (slug)=> BaseService.get(Config.webApi + 'item/'+ slug + '/slug');
    getRelatedProducts = (companyId, params)=> BaseService.get(Config.webApi + 'item/company/' + companyId, params);
    getCompanyJieLongList = (companyId, params) => BaseService.get(Config.webApi +'item/company/' + companyId + '/jielong', params);
    getCompanyConsultationList = (companyId, params) => BaseService.get(Config.webApi + 'item/company/' + companyId + '/consultation', params);
    getItemNormalCommentList = (itemId, params) => BaseService.get(Config.webApi + 'comment/item/normal/message/' + itemId, params);
    postItemNormalComment = (itemId, params)=> BaseService.post(Config.webApi + 'comment/item/'+ itemId,params);
    updateItemNormalComment = (itemId, params)=> BaseService.delete(Config.webApi + 'comment/'+ itemId,params);
    recordVisitHistory = (params)=> BaseService.get(Config.webApi + 'item/redirect', params);
}
const itemService = new ItemService();
export default itemService;