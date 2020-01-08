import React from 'react';
import {Button, ButtonArea} from "react-weui";
import Lang from '../../../lang/Lang';
import UtilsService from '../../../service/UtilsService';
import AuthService from "../../../service/AuthService";
import CartService from '../../../service/CartService';
import Colors from '../../../constants/Colors';

class ProductButtonArea extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            isLogin: this.props.isLogin,
            selectedList: this.props.selectedList,
            callbackChangeView: this.props.callbackChangeView,
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            item: nextProps.item,
            isLogin: nextProps.address,
            selectedList: nextProps.selectedList
        })
    }

    addToCart() {
        if (!this.state.isLogin) {
            let companyId = this.state.item.company_id;
            let params = {items_info: []};
            for (let item of this.state.selectedList) {
                params['items_info'].push({'item_id': item.id, 'qty': item.qty});
            }
            CartService.addCartItems (companyId, params)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });

        } else {
            this.weChatLogin();
        }
    }

    buyNow() {
        if (this.state.isLogin) {
            this.state.callbackChangeView();
        }
        else {
            // this.weChatLogin();
            this.state.callbackChangeView();
        }
    }

    weChatLogin() {
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

    render(){
        return (
            <div style={styles.buttonGroupContainer}>
                <ButtonArea direction="horizontal">
                    <Button onClick={()=>{this.addToCart()}} style={styles.btn}>加入购物车</Button>
                    <Button onClick={()=>{this.buyNow()}} style={styles.btn}>立刻购买</Button>
                </ButtonArea>
            </div>
        );
    }
}


const styles = {
    buttonGroupContainer: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
    },
    btn: {
        backgroundColor: Colors.appThemeColor,
        color: Colors.fontColor,
        fontWeight: 'bold'
    },
};


export default ProductButtonArea;
