import React, { Component } from 'react';
import './App.css';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import Colors from "../constants/Colors";
import Lang from '../lang/Lang';
//import component
import SiteHeader from '../components/Common/SiteHeader';
import CartClearSection from "../components/Cart/CartClearSection";
import Footer from "../components/Common/SiteFooter";
import CartService from "../service/CartService";
import CartListItem from "../components/Cart/CartListItem";
import CheckoutView from "../components/Cart/CheckoutView";
import CheckoutButton from "../components/Cart/CheckoutButton";


class cartPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            companyId: '8e26b6edb2ce7416f71a82ed78e08984',
            cartItems: [],
            selectedItemList: [],
            totalCost: 0,
            isCheckingOut: false
        };
    }

    componentDidMount() {
        this.getCartItems();
    }

    formatCartItems(rawItems) {
        let formattedItems = [];
        for (let rawItem of rawItems) {
            let tmpItem = rawItem.item;
            tmpItem.qty = rawItem.qty;
            tmpItem.isSelected = true;
            formattedItems.push(tmpItem);
        }
        return formattedItems;
    }

    getCartItems() {
        let companyId = this.state.companyId;
        CartService.getCartItems(companyId)
            .then((response) => response.json())
            .then((responseJson) => {
                let tmpCartItems = responseJson && responseJson[0] && responseJson[0].cartitems.length > 0 ? responseJson[0].cartitems : [];
                let cartItems = this.formatCartItems(tmpCartItems);
                this.setState({
                    cartItems: cartItems,
                    selectedItemList: cartItems
                }, () => {
                    this.CalculateTotalCost(cartItems)
                });
            }).catch((error) => {
                console.error(error);
            });
    }

    clearUserCart = () => {
        CartService.clearCartItems (this.state.companyId)
            .then((response) => {
                this.setState({cartItems: [], totalCost: 0,});
            }).catch((error) => {
                console.error(error);
            });
    };

    editSelectedCartItems = (itemId, qty, isSelected) => {
        let selectedList = [];
        for (let cartItem of this.state.cartItems) {
            if (cartItem.id === itemId ){
                cartItem.qty = qty;
                isSelected ? selectedList.push(cartItem) : null;
            }
        }
        this.setState({ selectedItemList: selectedList }, () => {
            this.CalculateTotalCost(selectedList);
            this.updateUserCart(itemId, qty);
        });
    };

    CalculateTotalCost = (selectedList) => {
        let initCost = 0;
        for (let selectedItem of selectedList) {
            initCost += parseInt(selectedItem.qty) * 8; // initCost + parseInt(selectedItem.qty) * parseInt(selectedItem.item.price)
        }
        this.setState({totalCost: initCost});
    };

    updateUserCart = (itemId, qty) => {
        let params = {
            item_id: itemId,
            qty: qty
        };
        CartService.updateCartItems (this.state.companyId, params)
            .then((response) => {}).catch((error) => {console.error(error);});
    };

    showHideCheckoutView = () => {
        this.setState((prevState) => ({
            isCheckingOut: !prevState.isCheckingOut
        }));
    };

    render() {
        const editSelectedCartItems = this.editSelectedCartItems;
        return (
            <div className="App">
                <SiteHeader/>

                { !this.state.isCheckingOut ?
                    <div>
                        <div style={styles.pageTitle}>{Lang.translate('CART')}</div>

                        <CartClearSection callbackClearCart={this.clearUserCart}/>

                        {this.state.cartItems.map (function (item,index) {return (<CartListItem item={item} key={index} callbackUpdate={editSelectedCartItems}/>)})}

                        <CheckoutButton totalCost={this.state.totalCost} callbackChangeView={this.showHideCheckoutView}/>
                    </div>
                    : <CheckoutView itemList={this.state.selectedItemList}/> }

                <Footer/>
            </div>
        );
    }
}
const styles = {
    pageTitle: {
        fontSize: '22px',
        color: Colors.fontColor,
        textAlign: 'center',
        padding: '10px',
    },
};

export default cartPage;










