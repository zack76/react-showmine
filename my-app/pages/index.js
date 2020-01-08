import React, { Component } from 'react';
import './App.css';
import {Button, Cells, Cell, CellBody, CellFooter, ActionSheet, Toast} from 'react-weui';
import CompanyService from '../service/CompanyService';
import UtilsService from '../service/UtilsService';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import { Config } from '../Config';
import Footer from "../components/Common/SiteFooter";
import CompanyBanner from '../components/Company/CompanyBanner';
import SiteHeader from '../components/Common/SiteHeader';
import CompanyTitle from '../components/Company/CompanyTitle';
import SlideableJieLongList from "../components/Company/SlideableList/SlideableJieLongList";
import ConsultationList from "../components/Company/ConsultationList/ConsultationList";
import CompanyInfoSection from "../components/Company/CompanyInfoSection";
import WeChatService from "../service/WeChatService";
import { Row, Col, Container } from 'react-bootstrap';
import AuthService from "../service/AuthService";


class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            company: this.props.company,
            showLoading: false,
            isLogin: false,
        };
    }

    static getInitialProps = async({ res, req, query }) => {
        if (!query.companyId) {
            const homePageUrl = 'https://www.showmine.com'
            if (res) {
                res.writeHead(301, {
                    Location: homePageUrl
                })
                res.end()
            } else {
                window.location = homePageUrl
            }
            return {}
        }
        let resp = await CompanyService.getCompanyDetails(query.companyId);
        const json = await resp.json();
        return {company: UtilsService.formatRawCompany(json)};
        // let params = {domain: req.headers.host};
        // let res = await CompanyService.getCompanyFromDomain(params);
        // const json = await res.json();
        // return {
        //     company: UtilsService.formatRawCompany(json),
        // };
    };


    componentDidMount() {
        this.setState({
            isLogin: localStorage.getItem('isLogIn'),
        }, () => {
            setTimeout(()=>{
                this.weChatShare()
            }, 500);
        });
        this.getCompanyQrCode(this.state.company)
    }

    weChatShare = () => {
        let company = this.state.company;
        let currentUrl = this.state.currentUrl;
        WeChatService.runWhenWXReady(function () {
            wx.onMenuShareAppMessage({
                title: company.name,
                desc: company.description,
                link: currentUrl,
                imgUrl: company.logo_img && company.logo_img.url ? company.logo_img.url : '../static/assets/default_item.png',
            });
            wx.onMenuShareTimeline({
                title: company.name,
                link: currentUrl,
                imgUrl: company.logo_img && company.logo_img.url ? company.logo_img.url : '../static/assets/default_item.png',
            });
        });
    };

    // getCompanyQrCode =  company => {
    //     let params = {};
    //     CompanyService.getCompanyQrCode(company.id, params)
    //         .then(response => response.text())
    //         .then(response => {
    //             this.setState({
    //                 qrUrl: response
    //             })
    //         })
    // }

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

    getLoginStatus = () => {
        if (!UtilsService.openedInWeChat() && !localStorage.getItem('userToken')) {
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
        } else {
            clearInterval(this.state.interval)
        }
    }

    getCompanyQrCode =  company => {
        var getLoginStatus = this.getLoginStatus
        var params = {
            companyId: company.id
        }
        AuthService.getLoginSubscribeQrCode( params)
            .then(response => response.text())
            .then(response => {
                var res = JSON.parse(response)
                let interval = setInterval(getLoginStatus,1000);
                this.setState({
                    qrUrl: res.qrcode,
                    subscribeLoginLogId: res.subscribeLoginLogId,
                    interval: interval
                })
            })
    }

    render() {
        const company = this.state.company ? this.state.company : undefined;
        return (
            <div style={styles.companyWrapper} className={'custom-font'}>
                <Container>
                    <Row>
                        <Col sm={12} md={8} className="col-md-offset-2">
                            <SiteHeader company={company} show={false}/>
                            <CompanyBanner companyId={company.id}/>
                            <CompanyTitle company={company}/>
                            <CompanyInfoSection company={company} showDivider={true}/>
                            <SlideableJieLongList companyId={company.id} isOngoing={true} showDivider={true}/>
                            <SlideableJieLongList companyId={company.id} isOngoing={false} showDivider={true}/>
                            <ConsultationList companyId={company.id} showDivider={true}/>
                            <Footer/>
                        </Col>
                        <Col sm={12} md={2} className='sticky'>
                            <div style={styles.qrTitle}>扫码关注该公司</div>
                            <div style={styles.qrTitle}><small>将更及时的收到推送</small></div>
                            <img style={styles.qrcode} src={this.state.qrUrl}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}


const styles = {
    companyWrapper: {
        width: '100%'
    },
    qrcode: {
        width: '100%',
    },
    qrTitle: {
        width: '100%',
        textAlign: 'center'
    },
};


export default App;
