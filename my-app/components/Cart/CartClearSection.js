import React from 'react';
import Lang from '../../lang/Lang';
import Colors from "../../constants/Colors";
import {IoIosTrash} from "react-icons/io";
import {Dialog} from 'react-weui';


class CartClearSection extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            callbackClearCart : this.props.callbackClearCart,
            showConfirmDialog: false
        };
    }
    showHideConfirmDialog = () => {
        this.setState({
            showConfirmDialog: !this.state.showConfirmDialog
        })
    };

    callbackClearCart = () => {
        this.showHideConfirmDialog();
        this.state.callbackClearCart();
    };

    render(){
        const confirmClearButtons= {
            title: '确定要清除？',
            buttons: [
                {
                    type: 'default',
                    label: '再想想',
                    onClick: () => this.showHideConfirmDialog()
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: ()=>this.callbackClearCart.bind()
                }
                ]
        };
        return (
            <div style={styles.wrapper}>
                <div style={styles.subWrapper}>
                    <div style={styles.title}>{Lang.translate('CART.ITEM')}</div>
                </div>
                <div>
                    <span style={styles.clearButton} onClick={()=>{this.showHideConfirmDialog()}}>
                        <IoIosTrash/> <span style={{fontSize: 17}}>{Lang.translate('CART.CLEAR')}</span>
                    </span>
                </div>
                <Dialog type="ios" title={confirmClearButtons.title} buttons={confirmClearButtons.buttons} show={this.state.showConfirmDialog}> </Dialog>
            </div>
        );
    }
}

const styles = {
    wrapper: {
        display: "flex",
        flex: "1",
        flexDirection: "row",
        backgroundColor: 'white',
        padding: '15px',
    },
    subWrapper: {
        flex: '1',
    },
    title: {
        fontSize:'17px',
        color: '#797979',
        marginBottom: '-6px',
    },
    clearButton: {
        fontSize:'15px',
        color: '#797979',
        textAlign:'right',
        marginBottom: '-2px'
    }
};


export default CartClearSection;
