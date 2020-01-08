import md5 from 'md5';
class UtilsService {
    formatRawCompany (company) {
        if (company.config) {
            company.config = JSON.parse(company.config);

        } else {
            company.config = {};
        }
        if (company.admin_config) {
            company.admin_config = JSON.parse(company.admin_config)
        } else {
            company.admin_config = {};
        }
        return company;
    }
    getWebAddress(){
        return window.location.hostname + '/';
    }

    getItemImgUrlWithSize (item = undefined, size = 'MEDIUM') {
        let defaultUrl = '../static/assets/default_item.png';
        if (item) {
            switch (size) {
                case 'SMALL':
                    let smallImgs = item.images_in_diff_sizes && item.images_in_diff_sizes.smallImages ?
                        Object.values(item.images_in_diff_sizes.smallImages) : undefined;
                    if (smallImgs && smallImgs[0])
                        return smallImgs[0].url;
                    else return defaultUrl;
                case 'MEDIUM':
                    let mediumImages = item.images_in_diff_sizes && item.images_in_diff_sizes.midImages ?
                        Object.values(item.images_in_diff_sizes.midImages) : undefined;
                    if (mediumImages && mediumImages[0])
                        return mediumImages[0].url;
                    else return defaultUrl;
                case 'LARGE':
                    let largeImages = item.images_in_diff_sizes && item.images_in_diff_sizes.origImages ?
                        Object.values(item.images_in_diff_sizes.origImages) : undefined;
                    if (largeImages && largeImages[0])
                        return largeImages[0].url;
                    else return defaultUrl;
                default:
                    return '../static/assets/default_item.png';
            }
        }
        else return defaultUrl;
    }

    getIsCompanyAdmin (user, targetCompanyId) {
        if (user && user.adminOfCompanyIds && user.adminOfCompanyIds.length > 0 && targetCompanyId) {
            if (user.is_admin) {
                return true;
            }
            for (let adminOfCompanyId of user.adminOfCompanyIds) {
                if (adminOfCompanyId === targetCompanyId) {
                    return true;
                }
            }
        }
        return false;
    }

    stripHtmlTags (text) {
        var styleRegex = /((<style>)|(<style type=.+))((\s+)|(\S+)|(\r+)|(\n+))(.+)((\s+)|(\S+)|(\r+)|(\n+))(<\/style>)/g;
        return  text ? String(text).replace(styleRegex, '').replace(/&nbsp;/gi,'').replace(/<[^>]+>/gm, '') : '';
    }

    openedInWeChat() {
        var tmp = {};
        tmp.userAgent = window.navigator.userAgent.toLowerCase();
        if (tmp.userAgent.match(/MicroMessenger/i)) {
            return true;
        }
        return false;
    };
}

const utilsService = new UtilsService();
export default utilsService;
