import BaseService from './BaseService';
import {Config} from '../Config';
import jQuery from 'jquery';
import md5 from 'md5';

const local_storage_key = 'wx';
const js_expires_in_seconds = 7000;
class WeChatService {

    getWeChatJsConf = params => BaseService.get(Config.webApi + 'wechat/js/conf', params);

    initWeChatJsConfig (url, jsConfigs) {
        if (wx && typeof(wx.config) === 'function') {
            wx.config(jsConfigs);
            this.setCachedJsConfig(url, jsConfigs);
        }
    };

    getJsCacheKey (url) {
        return this.md5Hash(url);
    };

    setJsCache (url, value) {
        let cached = localStorage.getItem(local_storage_key);
        let jsonCached = JSON.parse(cached);
        if (!cached) {
            cached = {};
        }
        if (!jsonCached) {
            jsonCached = {};
        }
        jsonCached[this.getJsCacheKey(url)] = value;
        localStorage.setItem(local_storage_key, JSON.stringify(jsonCached));
        return this;
    };

    getJsCache (url) {
        let cached = localStorage.getItem(local_storage_key);
        let jsonCached = JSON.parse(cached);
        return jsonCached ? jsonCached[this.getJsCacheKey(url)] : null;
    };

    getCachedJsConfig (url) {
        let tmp = {};
        tmp.stored_config = this.getJsCache(url);
        if (typeof(tmp.stored_config) === 'object' && tmp.stored_config && tmp.stored_config.timestamp !== '') {
            tmp.now_unix_timestamp = Math.floor(Date.now() / 1000);
            // cache expired
            if (((tmp.now_unix_timestamp * 1) - (tmp.stored_config.timestamp * 1)) <= js_expires_in_seconds) {
                return tmp.stored_config;
            }
        }
        return undefined;
    };

    setCachedJsConfig (url, jsConfigs) {
        this.setJsCache(url, jsConfigs);
        return this;
    };

    loadWeChatJsConf (url, configs) {
        let cachedConfig = this.getCachedJsConfig(url);
        if (cachedConfig) {
            this.initWeChatJsConfig(url, cachedConfig);
            if (configs && configs.loaded) {
                configs.loaded();
            }
            return this;
        }

        this.getWeChatJsConf({'url': url})
            .then((response) => response.json())
            .then((resp) => {
                if (resp.js) {
                    this.initWeChatJsConfig(url, resp.js);
                    if (configs !== undefined) {
                        this.runJs(configs);
                    }
                }
            });
        return this;
    };

    runWhenWXReady (func) {
        if (wx && typeof(wx.ready) === 'function' && typeof(func) === 'function') {
            wx.ready(function () {
                func();
            });
        }
    };

    runJs (configs) {
        jQuery(document).ready(function () {
            // delay 500 ms to execute wx.ready
            setTimeout(() => {
                wx.ready(function (res) {
                    if (configs.menuShareAppMessage) {
                        wx.onMenuShareAppMessage(configs.menuShareAppMessage);
                    }
                    if (configs.menuShareTimeline) {
                        wx.onMenuShareTimeline(configs.menuShareTimeline);
                    }
                    if (configs.getLocation) {
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: function (res) {
                                if (typeof(configs.getLocation.success) === 'function') {
                                    configs.getLocation.success(res);
                                }
                            },
                            fail: function (res) {
                                if (typeof(configs.getLocation.fail) === 'function') {
                                    configs.getLocation.fail(res);
                                }
                            }
                        });
                    }
                    if (configs.loaded && typeof (configs.loaded) === 'function') {
                        configs.loaded(res);
                    }
                });
            }, 1000);
        });
    };

    md5Hash (string) {
        return md5(string);
    };
}
const weChatService = new WeChatService();
export default weChatService;
