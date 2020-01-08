import React from 'react';
import CartService from "../../service/CartService";
import CartListItem from "../../components/Cart/CartListItem";

class CartList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            companyId: this.props.companyId,
        };
    }

    componentDidMount() {
        this.getCartItems();
    }

    getCartItems() {
        let companyId = this.state.companyId;
        CartService.getCartItems(companyId)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    cartItems: responseJson && responseJson[0] && responseJson[0].cartitems ? responseJson[0].cartitems : []
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    updateTotalPrice = (price) => {
        console.log(price);
    };

    render(){
        const cartItems = this.state.cartItems;
        const updateTotalPrice = this.updateTotalPrice;
        if (cartItems) {
            return (
                <div style={styles.listWrapper}>
                    {
                        cartItems.map(function(item,index){
                            return (
                                <CartListItem item={item} key={index} callbackUpdatePrice={updateTotalPrice}/>
                            )})
                    }
                </div>
            )
        }
        else return null;
    }
}

const styles = {
    listWrapper: {
        width: '100%'
    },
};


export default CartList;
