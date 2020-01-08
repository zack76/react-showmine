import React, { Component } from 'react';
import './App.css';
import {Button, TextArea, ActionSheet, Switch, Radio, Cells, CellsTitle, Cell, CellHeader, CellBody, CellFooter, Form, FormCell, Input, Label, LoadMore, Toast, Gallery} from 'react-weui';
import ItemService from '../service/ItemService';
import JielongService from '../service/JielongService';
import PaymentService from '../service/PaymentService'
import UtilsService from '../service/UtilsService'
import AuthService from "../service/AuthService";


//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';


//import component
import {Config} from "../Config";
import Router from "next/dist/client/router";
import Footer from "../components/Common/SiteFooter";
import SiteHeader from "../components/Common/SiteHeader";
import {GiStrong} from "react-icons/gi";



class checkoutPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            jielong: 'none',
            payment: 'none',
            processPayment: false,
            showLocation: false,
            ios_show: false,
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            quantity: 0,
            itemId: '',
            name:'',
            contact_number: '',
            address: '',
            notes: '',
            hideAvatar: true,
            payment_method: null,
            pickup_location: '',
            quantityOfChildren: [],
            priceOfChildren: [],
            totalPrice: 0,
            showLoading: false,
            loadingTimer: null,
            is_update: false,
            showVoucher: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.switch = this.switch.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
        this.handleQuantity = this.handleQuantity.bind(this);
    }

    componentDidMount() {
        const isLogin = localStorage.getItem('isLogIn');
        if (isLogin) {
            let itemId = this.props.url.query.itemId;
            if (this.props.url.query.is_update) {
                this.setState({
                    is_update: this.props.url.query.is_update,
                });
            }
            ItemService.getItemDetail(itemId)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        item: responseJson,
                        itemId: responseJson.id,
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            this.weChatLogin();
        }
    }

    weChatLogin() {
        // let origUrl = 'showmine66.com';
        // let origUrl = this.state.item.id;
        let origUrl = window.location.href;
        let authUrl = UtilsService.getWebAddress() + "AuthPage";

        AuthService.wechatLogin(origUrl, authUrl, {})
            .then((response) => response.json())
            .then((responseJson) => {
                window.open(responseJson.auth_url, "_self");
            })
            .catch((error) => {
                alert(error);
            });
    }


    componentWillUnmount() {
        this.state.loadingTimer && clearTimeout(this.state.loadingTimer);
    }

    placeOrder() {
        this.setState({
            processPayment: true,
        });
    }

    addJielong = () => {
        this.setState({showLoading: true});
        let id  = this.state.itemId;
        let configObj = {};
        let params = {
            comments:this.state.notes,
            config: JSON.stringify(configObj),
            item_url: "https://www.showmine66.com/ma/i/" + this.state.item.id,
            location: this.state.item.company.pickup_locations[this.state.locationId].id,
            is_private: this.state.hideAvatar,
            quantity: [
            ],
            state_redirect_obj: {
                url: UtilsService.getWebAddress(),
                // url: "http://localhost:3000",
            },
            voucher_base_url: "https://www.showmine66.com/ma/jl/vci/VOUCHERID",
            wechat_auth_url: "https://www.showmine66.com/a/wu?domain=https%253A%252F%252Fwww.showmine66.com&origurl=https%253A%252F%252Fwww.showmine66.com%252Fma%252Fi%252Fdbfcefa936b4cd6d5709953b5ea12673%2523app-top"
        };
        for (let index = 0; index <= this.state.quantityOfChildren.length; index++) {
            if (this.state.quantityOfChildren[index]!==null && this.state.quantityOfChildren[index]!== undefined) {
                params.quantity.push({
                    item_id: this.state.item.children[index].id,
                    quantity: this.state.quantityOfChildren[index],
                    price: this.state.priceOfChildren[index].toString(),
                });
            }
        }
        if (this.state.is_update) {
            let id = this.props.url.query.jielongId;
            JielongService.updateJielong(params, id)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        jielong: responseJson,
                    });
                    if(this.state.payment_method == "NoPayment") {
                        this.generateVoucher();
                    }
                    else {
                        this.processPayment();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            JielongService.addJielong(params, id)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        jielong: responseJson,
                    });
                    if(this.state.payment_method == "NoPayment") {
                        this.generateVoucher();
                    }
                    else {
                        this.processPayment();
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    processPayment= () => {
        // "redirectUrl": UtilsService.getWebAddress() + "index?itemId=" + this.state.jielong.item_id
        let configObj = {"source":"jielong_payment", "item_comment_id": this.state.jielong.id, "item_id": this.state.jielong.item_id};
        let params = {
            config: JSON.stringify(configObj),
            item_comment_id: this.state.jielong.id,
            payment_method: this.state.payment_method,
            redirectUrl: UtilsService.getWebAddress() + "index?itemId=" + this.state.jielong.item_id
        };
        PaymentService.getToPay(params)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    payment: responseJson,
                });
                window.open(responseJson.pay_url,"_self");
                this.setState({showLoading: false});
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    };

    generateVoucher() {
        let id = this.state.jielong.id;
        let params = {
            is_update: this.state.is_update,
            item_url: "https://www.showmine66.com/ma/i/" + this.state.item.id,
            voucher_base_url: "https://www.showmine66.com/ma/jl/vci/VOUCHERID",
        };
        JielongService.generateVoucher(params, id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    voucher: responseJson,
                    showLoading: false,
                    showVoucher: true
                });
                // window.open(responseJson.url,"_self");
            })
            .catch((error) => {
                console.error(error);
            });
    }



    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleTotalPrice() {
        this.state.totalPrice = 0;
        for(var index = 0; index <= this.state.priceOfChildren.length; index++) {
            if (this.state.priceOfChildren[index]) {
                this.state.totalPrice = this.state.totalPrice + this.state.priceOfChildren[index];
            }
        }
        this.setState({
            totalPrice: this.state.totalPrice,
        })
    }

    handleQuantity(event) {
        this.state.quantityOfChildren[event.target.name] = Number(event.target.value);
        this.state.priceOfChildren[event.target.name] = this.state.quantityOfChildren[event.target.name] * this.state.item.children[event.target.name].price;
        this.setState({
            quantityOfChildren: this.state.quantityOfChildren,
            priceOfChildren: this.state.priceOfChildren,
        })
        this.handleTotalPrice();

    }

    minus(index) {
        if (!this.state.quantityOfChildren[index] || this.state.quantityOfChildren[index]===null || this.state.quantityOfChildren[index]===undefined || this.state.quantityOfChildren[index]===0 )
        {
            console.log('Cannot minus');
        } else {
            this.state.quantityOfChildren[index] = this.state.quantityOfChildren[index] - 1;
            this.state.priceOfChildren[index] = this.state.quantityOfChildren[index] * this.state.item.children[index].price;
            this.setState({
                quantityOfChildren: this.state.quantityOfChildren,
                priceOfChildren: this.state.priceOfChildren,
            })
            this.handleTotalPrice();

        }
    }

    plus(index) {
        if (!this.state.quantityOfChildren[index] || this.state.quantityOfChildren[index]===null || this.state.quantityOfChildren[index]===undefined)
        {
            this.state.quantityOfChildren[index] = 0;
        }
        this.state.quantityOfChildren[index] = this.state.quantityOfChildren[index] + 1;
        this.state.priceOfChildren[index] = this.state.quantityOfChildren[index] * this.state.item.children[index].price;
        this.setState({
            quantityOfChildren: this.state.quantityOfChildren,
            priceOfChildren: this.state.priceOfChildren,
        })
        this.handleTotalPrice();

    }

    handlePayment(event) {
        this.setState({
            payment_method: event.target.value,
            payment_name: event.target.title,
        })
    }

    switch(){
        this.setState({hideAvatar: !this.state.hideAvatar});
    }

    hide(){
        this.setState({
            ios_show: false,
        });
    }



    render() {

        /**
         * Display the pickup locations list
         */

        let locationsList = null;
        if (this.state.item && this.state.item.company && this.state.item.company.pickup_locations) {
            locationsList = this.state.item.company.pickup_locations.map((location, index) =>
                <ActionSheet
                    key={location.id}
                    menus={
                        [{
                            label: location.title,
                            onClick: ()=> {
                                this.setState({
                                        locationId: index,
                                        showLocation: true,
                                    }
                                );
                                this.hide();
                            }
                        },]
                    }
                    actions={this.state.actions}
                    show={this.state.ios_show}
                    type="ios"
                    onRequestClose={e=>this.setState({ios_show: false})}
                />
            );
        }

        /**
         * Display children & handle the quantity for each one
         */
        let listItems = null;
        if (this.state.item && this.state.item.children)
        {
            listItems = this.state.item.children.map((item, index) =>
                <div key={index}>
                    <div className='checkout-info'>
                        {item.images[0] ?
                            ( <div className='checkout-img'>
                                <img height={150} width={150} src={item.images[0].url} role="presentation"/>
                            </div>)
                            :
                            null}

                        <div className='checkout-content'>
                            <div className='checkout-subtitle'>{item.title}</div>
                            <div className='checkout-price'>${item.price}</div>
                            <div className="Number-Picker">
                                <button style={styles.pickerButton} onClick={() => {this.minus(index);}}> － </button>
                                <input style={styles.picker} type="number" min="0" max="1000" name={index}
                                       value={this.state.quantityOfChildren[index]?this.state.quantityOfChildren[index]:0}
                                       onChange={this.handleQuantity}/>
                                <button style={styles.pickerButton} onClick={() => {this.plus(index);}}> ＋ </button>
                            </div>
                        </div>
                    </div>
                    <div className='location-tag'>{item.locations[0].title}</div>
                    <div className='divider'/>
                </div>

            );
        }

        /**
         * Display children & quantity for the checkout
         */
        let checkoutLists = null;
        if (this.state.item && this.state.item.children)
        {
            checkoutLists = this.state.item.children.map((item, index) =>
                <div key={item.id}>
                    {this.state.quantityOfChildren[index] && this.state.quantityOfChildren[index] !== 0 ?
                        <div>
                            <div>{item.title} × {this.state.quantityOfChildren[index]}</div>
                            <div>商品总额：${this.state.priceOfChildren[index]}</div>
                        </div>
                        :
                        null
                    }

                </div>
            );
        }

        /**
         * The page content
         */


        if (this.state.item) {
            return (
                <div className="App">
                    <SiteHeader/>
                    {this.state.processPayment ?
                        <div className='App-body'>
                            <Gallery src={this.state.voucher && this.state.voucher.url ? this.state.voucher.url : undefined} show={this.state.showVoucher}>
                                <div
                                    style={styles.galleryButton}
                                    onClick={e=>{
                                        this.setState({ showVoucher: false, showLoading: true});
                                        Router.push({
                                            pathname: '/index',
                                            query: this.state.itemId,
                                        });
                                    }}
                                >
                                    Cancel
                                </div>
                            </Gallery>
                            <div className='payment-block'>
                                <div
                                    className='payment-block-title'>支付金额<span>总计：${this.state.totalPrice}</span>
                                </div>
                                <div className='payment-block-content'>
                                    {checkoutLists}
                                    <div style={{fontSize: 24}}>总计:<span style={{color: 'red'}}> ${this.state.totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='payment-block'>
                                <div className='payment-block-title'>请选择支付方式:</div>
                                <Form style={{fontSize: 16}} radio>

                                    {this.state.item && this.state.item.online_payment == true ?
                                        (<div>
                                            <FormCell radio>
                                                <CellBody>微信支付</CellBody>
                                                <CellFooter>
                                                    <Radio name='radio1' value="OMIPAY_WECHAT" title="微信支付" onChange={this.handlePayment}/>
                                                </CellFooter>
                                            </FormCell>
                                            {/*<FormCell radio>*/}
                                            {/*    <CellBody>银行卡支付</CellBody>*/}
                                            {/*    <CellFooter>*/}
                                            {/*        <Radio name="radio1" value="银行卡支付" title="银行卡支付" onChange={this.handlePayment}/>*/}
                                            {/*    </CellFooter>*/}
                                            {/*</FormCell>*/}
                                            {/*<FormCell radio>*/}
                                            {/*    <CellBody>PayPal支付</CellBody>*/}
                                            {/*    <CellFooter>*/}
                                            {/*        <Radio name="radio1" value="PayPal支付" title="PayPal支付" onChange={this.handlePayment}/>*/}
                                            {/*    </CellFooter>*/}
                                            {/*</FormCell>*/}
                                        </div>)
                                        :
                                        <FormCell radio>
                                            <CellBody>到店支付</CellBody>
                                            <CellFooter>
                                                <Radio name="radio1" value="NoPayment" title="NoPayment" onChange={this.handlePayment}/>
                                            </CellFooter>
                                        </FormCell>
                                    }

                                    {this.state.payment_method == "NoPayment" ?
                                        <FormCell>
                                            <CellBody>订单已确认，请到店支付。</CellBody>
                                        </FormCell>
                                        :
                                        this.state.payment_name ?
                                            <FormCell>
                                                <CellBody>使用<strong>{this.state.payment_name}</strong>完成交易。（提示：请在<strong>30分钟</strong>内完成支付，否则订单会撤销）</CellBody>
                                            </FormCell>
                                            : null
                                    }

                                </Form>
                            </div>
                            {this.state.showLocation ?
                                <div className='payment-block'>
                                    <div className='payment-block-title'>取货地点</div>
                                    <Form style={{fontSize: 16}} radio>
                                        <FormCell radio>
                                            <CellBody>{this.state.item.children[0].locations[this.state.locationId].title}</CellBody>
                                            <CellFooter>
                                                <Radio name="radio2" defaultChecked/>
                                            </CellFooter>
                                        </FormCell>
                                    </Form>
                                </div>
                                :
                                null
                            }
                            {this.state.notes ?
                                <div className='payment-block'>
                                    <div className='payment-block-title'>备注</div>
                                    <div className='payment-block-content'>
                                        <p>{this.state.notes}</p>
                                    </div>
                                </div>
                                :
                                null
                            }
                            <div className='checkout-button'>
                                <Button type="primary" onClick={() => {
                                    this.addJielong();
                                }}
                                        disabled={this.state.payment_method && this.state.name && this.state.contact_number && this.state.address && this.state.showLocation ? false : true}>
                                    确认订单
                                </Button>
                                <Button type="warn" onClick={() => {this.setState({processPayment: false})}}>
                                    取消
                                </Button>
                                <Toast icon="loading" show={this.state.showLoading}>Loading...</Toast>
                            </div>
                        </div> :
                        <div className='App-body'>
                            <div className='checkout-title'>{this.state.item.title}</div>
                            <div>
                                <CellsTitle>选择产品</CellsTitle>
                                {listItems}
                                <div className='total-price'>总计：<span className='price-number'>${this.state.totalPrice}</span></div>
                            </div>
                            <div>
                                <CellsTitle>取货地点* </CellsTitle>
                                <Cells>
                                    <Cell href="javascript:;" access>
                                        <CellBody onClick={e => this.setState({ios_show: true})}>
                                            当前选择:
                                        </CellBody>
                                        {locationsList}
                                        <CellFooter/>
                                    </Cell>
                                    {
                                        this.state.showLocation ?
                                            <div className='location'>
                                                <div
                                                    className='location-label'>名称：{this.state.item.company.pickup_locations[this.state.locationId].title}</div>
                                                <div
                                                    className='location-label'>位置：{this.state.item.company.pickup_locations[this.state.locationId].address.street}</div>
                                                <div
                                                    className='location-label'>描述：{this.state.item.company.pickup_locations[this.state.locationId].description}</div>
                                            </div>
                                            :
                                            null
                                    }
                                </Cells>
                                <CellsTitle>联系方式* </CellsTitle>
                                <Form>
                                    <FormCell>
                                        <CellHeader>
                                            <Label>姓名</Label>
                                        </CellHeader>
                                        <CellBody>
                                            <Input type="text" placeholder="请输入姓名" name='name' value={this.state.name}
                                                   onChange={this.handleChange}/>
                                        </CellBody>
                                    </FormCell>
                                    <FormCell>
                                        <CellHeader>
                                            <Label>联系方式</Label>
                                        </CellHeader>
                                        <CellBody>
                                            <Input type="text" placeholder="请输入手机号" name='contact_number'
                                                   value={this.state.contact_number} onChange={this.handleChange}/>
                                        </CellBody>
                                    </FormCell>
                                    <FormCell>
                                        <CellHeader>
                                            <Label>地址</Label>
                                        </CellHeader>
                                        <CellBody>
                                            <Input type="text" placeholder="请输入地址" name='address'
                                                   value={this.state.address} onChange={this.handleChange}/>
                                        </CellBody>
                                    </FormCell>
                                </Form>
                                <CellsTitle>备注</CellsTitle>
                                <Form>
                                    <FormCell>
                                        <CellBody>
                                            <TextArea placeholder="请输入文本" rows="5" name='notes' value={this.state.notes}
                                                      onChange={this.handleChange}></TextArea>
                                        </CellBody>
                                    </FormCell>
                                </Form>
                                <CellsTitle>私密参加</CellsTitle>
                                <Form>
                                    <FormCell>
                                        <CellBody>
                                            <FormCell switch>
                                                <CellBody>开启后将隐藏您的头像</CellBody>
                                                <CellFooter>
                                                    <Switch onClick={this.switch}/>
                                                </CellFooter>
                                            </FormCell>
                                        </CellBody>
                                    </FormCell>
                                </Form>
                                <div className='checkout-button'>
                                    <Button type="primary" onClick={() => {this.placeOrder();}}
                                            disabled={this.state.totalPrice !== 0 && this.state.name && this.state.contact_number && this.state.address && this.state.showLocation ? false : true}>
                                        我要下单
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            );
        }
        else {
            return (
                <div className="App">
                    <SiteHeader/>
                    <LoadMore loading></LoadMore>
                </div>
            );
        }
    }
}

const styles = {
    galleryButton: {
        color: 'white',
        fontWeight:'bold',
        padding: '0',
    },
    picker:{
        textAlign: 'center',
        fontSize: '18px',
        height: '28px',
        width: '60px',
        borderRadius: '0',
        border: 'none',
    },
    pickerButton: {
        fontSize: '18px',
        backgroundColor: '#efc929',
        border: 'none',
        width: '28px',
        height: '28px',
        borderRadius: '0',
    }
}

export default checkoutPage;
