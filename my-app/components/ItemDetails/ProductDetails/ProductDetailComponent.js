import React, {Component} from 'react';
import Colors from "../../../constants/Colors";
import ProductChildrenList from "./ProductChildrenList";
import ProductButtonArea from "./ProductButtonArea";
import CheckoutView from "../../Cart/CheckoutView";
import ItemBanner from "../ItemBanner";
import ItemContent from "../ItemContent";


class ProductDetailComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: this.props.isLogin,
            item: this.props.item
        };
    }

    showHideCheckoutView = () => {
        this.setState((prevState) => ({
            isCheckingOut: !prevState.isCheckingOut
        }));
    };

    updateSelectedItems = (selectedList) => {
        this.setState({
            selectedList: selectedList && selectedList.length > 0 ? selectedList : false
        })
    };

    render(){
        const item = this.state.item ? this.state.item : undefined;
        const isLogin = this.state.isLogIn;
        const isCheckingOut = this.state.isCheckingOut;

        return (
            <div className='App-body' key={item.id}>

                { isCheckingOut ?
                    <CheckoutView selectedList={this.state.selectedList} parentItem={item}/>
                    :
                    <div>
                        <ItemBanner item={item}/>

                        <ItemContent jieLongDetail={item ? item : undefined}/>

                        <ProductChildrenList children={item.children ? item.children : undefined} callbackUpdateItem={this.updateSelectedItems}/>

                        <ProductButtonArea item={item} isLogin={isLogin} selectedList={this.state.selectedList} callbackChangeView={this.showHideCheckoutView}/>
                    </div>
                }
            </div>

        )
    }
}

const styles = {

};

export default ProductDetailComponent;

