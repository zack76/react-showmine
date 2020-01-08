import fetch from 'isomorphic-unfetch'

class BaseService {
    get(url, params = null) {
        if (params) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + this.queryParams(params);
        }
        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });
    }

    get2(url) {
        const userToken = localStorage.getItem('userToken');
        // const userToken = 'a95f6b7e569038cb2dfac8302d6d378e';
        const authString = localStorage.getItem('authString');
        return fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'X-Auth-Token ' + userToken,
                'Wechat-Browser-Acc': authString,
            },
        });
    }

    post(url, params = null) {
        const userToken = localStorage.getItem('userToken');
        const authString = localStorage.getItem('authString');
        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'X-Auth-Token ' + userToken,
                'Wechat-Browser-Acc': authString,
            },
            body: JSON.stringify(params),
        });
    }

    serverPost(url, params = null) {
        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(params),
        });
    }

    put(url, params = null) {
        const userToken = 'a95f6b7e569038cb2dfac8302d6d378e';
        // const userToken = localStorage.getItem('userToken');
        const authString = localStorage.getItem('authString');
        return fetch(url, {
            method: 'PUT',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'X-Auth-Token ' + userToken,
                'Wechat-Browser-Acc': authString,
            },
            body: JSON.stringify(params),
        });
    }

    delete(url, params = null) {
        const userToken = localStorage.getItem('userToken');
        // const userToken = 'a95f6b7e569038cb2dfac8302d6d378e';
        const authString = localStorage.getItem('authString');
        return fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization' : 'X-Auth-Token ' + userToken,
                'Wechat-Browser-Acc': authString,
            },
            body: JSON.stringify(params),
        });
    }
    queryParams(params) {
        return Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
    }

}

const baseService = new BaseService();
export default baseService;
