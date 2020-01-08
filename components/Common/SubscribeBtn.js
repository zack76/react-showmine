import { Button, Toast } from "react-weui";
import Lang from "../../lang/Lang";
import React from "react";
import {IoIosStar} from "react-icons/io";
import {Config} from "../../Config";
import AuthService from "../../service/AuthService";
import Modal from 'react-modal';
import CompanyService from "../../service/CompanyService";
import UtilsService from "../../service/UtilsService";



class SubscribeBtn extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            showModal: false
        }
    }
    componentDidMount(props) {
        // this.getQrCode(this.props.item, this.props.company)
    }

    componentWillReceiveProps(nextProps, nextContext) {
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


    subscribe = (company, item) => {
        let user = JSON.parse(localStorage.getItem('userObject'));
        // user = {
        //     wechat_is_subscriber: true
        // }
        if (!user) {
            if (UtilsService.openedInWeChat()) {
                this.weChatLogin()
            } else {
                let getLoginStatus = this.getLoginStatus
                var params = {
                    companyId: company.id,
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
        } else {
            if (user.wechat_is_subscriber) {
                this.setState({
                    loading: true
                }, () => {
                    CompanyService.subscribeCompany(company.id)
                        .then(res => {
                            this.setState({
                                loading: false,
                                success: true
                            })
                            this.state.toastTimer = setTimeout(()=> {
                                this.setState({success: false});
                            }, 2000);
                        })
                    ;
                })
            } else {
                this.getQrCode(item, company)
                // this.setState({
                //     showModal: true
                // })
            }
        }
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

    getQrCode(item, company) {
        let params = {};
        if (item && item.id) {
            params = {
                itemId: item.id
            }
        }
        let companyId = company.id
        CompanyService.getCompanyQrCode(companyId, params)
            .then(response => response.text())
            .then(response => {
                this.setState({
                    qrUrl: response,
                    showModal: true
                })
            })
    }

    render(){
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
        // const company = this.props.company;

        return (
            <div>
                <Button
                    size='small'
                    style={styles.subsButton}
                    onClick={()=>{this.subscribe(this.props.company, this.props.item)}}
                    plain
                >
                    <IoIosStar/>
                    {Lang.translate('SUBSCRIBE')}
                </Button>
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

        );
    }
}

const styles = {
    subsButton: {
        borderColor: 'red',
        color: 'red',
        marginTop: 5
        // padding: '2vw',
    },
    qrcode: {
        width: '100%',
    },
    qrTitle: {
        width: '100%',
        textAlign: 'center'
    },
};


export default SubscribeBtn;

