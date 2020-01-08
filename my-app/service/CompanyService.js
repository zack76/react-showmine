import BaseService from './BaseService';
import {Config} from '../Config';
class CompanyService {
    getCompanyDetails = companyId => BaseService.get(Config.webApi + 'company/' + companyId);
    getCompanyBannerImages = companyId => BaseService.get(Config.webApi + 'banner/company/' + companyId);
    getCompanyFromDomain = params => BaseService.serverPost(Config.webApi + 'domain', params);
    getCompanyQrCode = (companyId, params) => BaseService.get(Config.webApi + 'company/' + companyId + '/genSubscriptionQrCode', params);
    subscribeCompany = companyId => BaseService.post(Config.webApi + 'company/' + companyId + '/subscribe');
}
const companyService = new CompanyService();
export default companyService ;
