import React, { Component } from 'react';
import '../App.css';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import ItemService from '../../service/ItemService';
import SiteHeader from '../../components/Common/SiteHeader';
import SiteFooter from "../../components/Common/SiteFooter";
import JieLongDetailComponent from "../../components/ItemDetails/JieLongDetails/JieLongDetailComponent";
import ProductDetailComponent from "../../components/ItemDetails/ProductDetails/ProductDetailComponent";
import ArticleDetailComponent from "../../components/ItemDetails/ArticleDetails/ArticleDetailComponent";
import RegistrationDetailComponent from "../../components/ItemDetails/RegistrationDetails/RegistrationDetailComponent";
import WeChatService from '../../service/WeChatService';
import UtilsService from "../../service/UtilsService";
import { Row, Col, Container } from 'react-bootstrap';
import AuthService from "../../service/AuthService";
import {withRouter} from "next/router";
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';



class itemDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            isLogin: false,
            itemType: this.props.item.predefinedTags['1']
        };
    }

    static getInitialProps = async({ req, query }) => {
        let slug = encodeURIComponent(query.id);
        let res = await ItemService.getItemDetailBySlug(slug);
        const json = await res.json();
        return {item: json};
    };

    initializeReactGA() {
        ReactGA.initialize('UA-101510131-7');
        // ReactGA.initialize('UA-154886136-1');
        ReactGA.pageview('/itemDetails');
        ReactGA.event({
            category: 'ItemDetails',
            action: 'View item details'
        });
    }

    componentDidMount() {
        this.getCompanyQrCode(this.state.item);
        this.setState({
            isLogin: localStorage.getItem('isLogIn'),
            currentUrl: window.location.href
        }, () => { setTimeout(()=>{
            this.weChatShare()
        }, 300);
        });
        this.recordVisitHistory();
        this.initializeReactGA();
    }

    componentWillReceiveProps(object, nextProps) {
        this.setState({
            item: object.item,
            currentUrl: window.location.href,
            itemType: object.item.predefinedTags['1']
        }, () => { setTimeout(()=>{
            this.weChatShare()
        }, 500);
        });
    }

    recordVisitHistory = async () => {
        if (this.props.router && this.props.router.query && this.props.router.query.from && this.props.item) {
            let itemId = this.props.item.id;
            let from = this.props.router.query.from;
            let sharerId = this.props.router.query.sharerId;
            let params = {
                itemId,
                from,
                sharerId,
                fromWeChat: true
            }
            await ItemService.recordVisitHistory(params)
        }
    }

    weChatShare = () => {
        let item = this.state.item;
        let currentUrl = this.state.currentUrl;
        if (localStorage.getItem('userObject')) {
            var currentUserId = JSON.parse(localStorage.getItem('userObject')).id;
            var url = new URL(currentUrl)
            var query_string = url.search;
            var search_params = new URLSearchParams(query_string);
            if (search_params.has('sharerId')) {
                search_params.set('sharerId', currentUserId);
                url.search = search_params.toString();
                currentUrl = url.toString();
            } else {
                currentUrl = currentUrl + '&sharerId=' + currentUserId
            }
        }
        let imageSize = 'SMALL';
        let descWithoutHtml = UtilsService.stripHtmlTags(item.description);
        WeChatService.runWhenWXReady(function () {
            wx.onMenuShareAppMessage({
                title: item.title,
                desc: descWithoutHtml,
                link: currentUrl,
                imgUrl: UtilsService.getItemImgUrlWithSize(item, imageSize)
            });
            wx.onMenuShareTimeline({
                title: item.title,
                link: currentUrl,
                imgUrl: UtilsService.getItemImgUrlWithSize(item, imageSize)
            });
        });
    };

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

    getCompanyQrCode =  item => {
        // let params = {
        //     itemId: item.id
        // };
        var getLoginStatus = this.getLoginStatus
        var params = {
            companyId: item && item.company && item.company.id,
            itemId: item && item.id
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

    extractContent = (desc) => {
        var span = document.createElement('span');
        span.innerHTML = desc;
        return span.textContent || span.innerText;
    };

    render() {
        const item = this.state.item ? this.state.item : undefined;
        const isLogin = this.state.isLogin;
        if (item) {
            const itemView = () => {
                switch(this.state.itemType) {
                    case 'JIE LONG':
                        return <JieLongDetailComponent isLogin={isLogin} item={item} />;

                    case 'product':
                        return <ProductDetailComponent isLogin={isLogin} item={item} />;

                    case 'CONSULTATION':
                        return <ArticleDetailComponent isLogin={isLogin} item={item} />;

                    case 'REGISTRATION':
                        return <RegistrationDetailComponent isLogin={isLogin} item={item} />;

                    default:
                        return <ProductDetailComponent isLogin={isLogin} item={item} />;
                }
            };

            return (
                <div className="App" key={item.id}>
                    <Helmet>
                        <title>{item.title}</title>
                        <meta name="description" content={item.description.replace(/<[^>]+>/g, '')}/>
                    </Helmet>
                    <Container>
                        <Row>
                            {/*<Col sm="12" lg={{ span: 8, offset: 2 }}>*/}
                            {/*    <SiteHeader show={this.state.itemType !== 'CONSULTATION'} company={item.company ? item.company : undefined}/>*/}
                            {/*    { itemView() }*/}
                            {/*    <SiteFooter show={this.state.itemType !== 'CONSULTATION'}/>*/}
                            {/*</Col>*/}
                            <Col sm={12} md={8} className="col-md-offset-2">
                                <SiteHeader show={this.state.itemType !== 'CONSULTATION'} company={item.company ? item.company : undefined} item={item}/>
                                { itemView() }
                                <SiteFooter show={this.state.itemType !== 'CONSULTATION'}/>
                            </Col>
                            <Col sm={12} md={2} className="sticky">
                                <div style={styles.qrTitle}>扫码关注该公司</div>
                                <div style={styles.qrTitle}><small>将更及时的收到推送</small></div>
                                <img style={styles.qrcode} src={this.state.qrUrl}/>
                            </Col>
                        </Row>
                    </Container>
                </div>

            );
        }
        else return null;
    }
}

const styles = {
    qrcode: {
        width: '100%',
    },
    qrTitle: {
        width: '100%',
        textAlign: 'center'
    },
};

export default withRouter(itemDetail);
