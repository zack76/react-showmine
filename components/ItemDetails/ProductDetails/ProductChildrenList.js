import React, {Component} from 'react';
import Colors from "../../../constants/Colors";
import ProductChildItem from "./ProductChildItem";

class ProductChildrenList extends Component {
    constructor(props){
        super(props);
        this.state = {
            callbackUpdateItem: this.props.callbackUpdateItem,
            tmpChildren: this.props.children
        }
    }

    callbackUpdateItem = (itemId, quantity) => {
        let tmpChildren = this.state.tmpChildren;
        let tmpList = [];
        for (let i = 0; i < tmpChildren.length; i++) {
            if (tmpChildren[i].id === itemId) {
                tmpChildren[i].qty = quantity;
            }
        }
        for (let tmpChild of tmpChildren) {
            if (tmpChild && tmpChild.qty > 0) {
                tmpList.push(tmpChild);
            }
        }
        this.setState({
            tmpChildren: tmpChildren,
            selectedChildren: tmpList
        }, () => {
            this.state.callbackUpdateItem(tmpList);
        })
    };

    render(){
        const children = this.props.children ? this.props.children : undefined;
        if (children) {
            return children.map((child) => {
                return (
                    <div key={child.id}>
                        <ProductChildItem item={child} key={child.id} callbackUpdateItem={this.callbackUpdateItem}/>
                        <div style={Colors.style.bottomDivider}> </div>
                    </div>
                )
            });
        }
        else {
            return null;
        }
    }
}

const styles = {

};

export default ProductChildrenList;

