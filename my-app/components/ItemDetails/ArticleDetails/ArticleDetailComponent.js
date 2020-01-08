import React, {Component} from 'react';
import ArticleContent from "./ArticleContent";
import ArticleComments from "./ArticleComments";
import UtilsService from "../../../service/UtilsService";
import AuthService from "../../../service/AuthService";
import {Config} from "../../../Config";
import EditButton from "../../../components/ItemDetails/ArticleDetails/EditButton"
import {Button, Toast} from "react-weui";
import Lang from "../../../lang/Lang";
import Modal from "react-modal";

const styles = {
    loginButton: {
        width: '100%'
    }

};

class ArticleDetailComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: this.props.isLogin ? this.props.isLogin : undefined,
            item: this.props.item
        };
    }

    componentDidMount() {
        this.setState({
            isLogin: localStorage.getItem('isLogIn'),
        }, () => {
            if (this.state.isLogin) {
                let user = JSON.parse(localStorage.getItem('userObject'));
                this.setState({
                    isAdmin:  UtilsService.getIsCompanyAdmin(user, this.state.item.company_id)
                });
            }
        });
    }

    weChatLogin() {
        let origUrl = window.location.href;
        let authUrl = Config.webAddress +'AuthPage';
        AuthService.wechatLogin(origUrl, authUrl, {})
            .then((response) => response.json())
            .then((responseJson) => {
                window.open(responseJson.auth_url, "_self");
            })
            .catch((error) => {
                alert(error);
            });
    }

    componentWillUnmount(){
        clearInterval(this.state.interval)
    }

    getLoginStatus= () => {
        if(this.state.subscribeLoginLogId) {
            AuthService.checkLoginStatus(this.state.subscribeLoginLogId || null)
                .then(response => response.text())
                .then(resp => {
                    var res = JSON.parse(resp)
                    if (res.log && res.log.tmp_token && res.log.tmp_token.trim() !== '') {
                        this.setState({
                            loading: true
                        })
                        this.loginWithTempCode(res.log.tmp_token.trim())
                    }
                })
        }
    }

    loginWithTempCode = (tmpToken) => {
        AuthService.loginWithTempCode(tmpToken)
            .then(response => response.text())
            .then(resp => {
                var res = JSON.parse(resp)
                if (res.return_code){
                    localStorage.setItem('userToken', res.return_code);
                    localStorage.setItem('isLogIn', true);
                }
                let params ={};
                AuthService.getMe(params)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        localStorage.setItem('userObject', JSON.stringify(responseJson));
                    })
                    .then(() => {location.reload();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
    }

    handleLogin =(item) => {
        if (UtilsService.openedInWeChat()) {
            this.weChatLogin()
        } else {
            let getLoginStatus = this.getLoginStatus
            var params = {
                companyId: item && item.company && item.company.id,
                itemId: item && item.id
            }
            AuthService.getLoginSubscribeQrCode(params)
                .then(response => response.text())
                .then(resp => {
                    var res = JSON.parse(resp)
                    let interval = setInterval(getLoginStatus,1000);
                    this.setState({
                        qrUrl: res.qrcode,
                        subscribeLoginLogId: res.subscribeLoginLogId,
                        showModal: true,
                        interval: interval
                    })
                })
        }
    }

    render() {

        const item = this.state.item ? this.state.item : undefined;
        const isLogin = this.state.isLogin ? this.state.isLogin : false;
        const isAdmin = this.state.isAdmin ? this.state.isAdmin : false;
        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
        };
        if (item && item.is_draft === 0 || (item.is_draft === 1 && isLogin)) {
            if (item.is_draft === 1 && !isAdmin) {
                return (
                    <div key={item.id}>
                        No Access to view this article.
                    </div>
                )
            } else {
                if (isLogin){
                    return (
                        <div key={item.id}>
                            <EditButton item={item} show={isAdmin} />
                            <ArticleContent articleDetail={item} isAdmin={isAdmin} isLogin={isLogin}/>
                            <EditButton item={item} show={isAdmin} />
                            <ArticleComments item={item} isLogin={isLogin} isAdmin={isAdmin}/>
                        </div>
                    )
                }
                else
                {
                    return (
                        <div key={item.id}>
                            <EditButton item={item} show={isAdmin} />
                            <ArticleContent articleDetail={item} isAdmin={isAdmin} isLogin={isLogin}/>
                            <EditButton item={item} show={isAdmin} />
                            <div key={item.id} style={styles.editButton}>
                                <Button
                                    onClick={()=> this.handleLogin(item)}
                                    plain
                                >
                                    {Lang.translate('LOGIN')}
                                </Button>
                            </div>
                            <ArticleComments item={item} isLogin={isLogin} isAdmin={isAdmin}/>
                            <Modal
                                isOpen={this.state.showModal}
                                // onAfterOpen={() => {this.getQrCode(item)}}
                                onRequestClose={()=>{this.setState({showModal: false})}}
                                style={customStyles}
                                contentLabel="Example Modal"
                            >
                                <div style={styles.qrTitle}>扫码关注该公司</div>
                                <div style={styles.qrTitle}><small>将更及时的收到推送</small></div>
                                <img style={styles.qrcode} src={this.state.qrUrl}/>
                            </Modal>
                            <Toast icon="success-no-circle" show={this.state.success}>Success</Toast>
                            <Toast icon="loading" show={this.state.loading}>Loading...</Toast>
                        </div>
                    )
                }

            }
        }
        else return null;
    }
}

export default ArticleDetailComponent;
