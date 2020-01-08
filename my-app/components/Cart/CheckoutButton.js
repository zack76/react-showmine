import React from 'react';
import Lang from '../../lang/Lang';
import Router from "next/dist/client/router";
import Colors from "../../constants/Colors";
import {Button} from "react-weui";


class CheckoutButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            totalCost: this.props.totalCost,
            callbackChangeView: this.props.callbackChangeView
        };
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            totalCost: nextProps.totalCost
        })
    }

    render(){
        return (
            <div style={styles.wrapper}>
                <div style={styles.subWrapper}>
                    <div style={styles.title}>
                        总计：<span style={styles.price}>${this.state.totalCost}</span>
                    </div>
                    <button type="primary" style={styles.button} onClick={()=>{this.state.callbackChangeView()}}>
                        {Lang.translate('CHECKOUT')}
                    </button>
                </div>
            </div>
        );
    }
}

const styles = {
    wrapper: {
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%',
        borderTop: '1px solid',
        borderTopColor: Colors.borderColor,
        textAlign: 'center',
        backgroundColor: "white",
        height: "40px",
    },
    subWrapper: {
        display: "flex",
        flex: "1",
        flexDirection: "row",
        color: Colors.fontColor,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        flex: '5',
        fontWeight:"bold",
        fontSize: "18px",
    },
    button: {
        flex: '2',
        fontWeight: "bold",
        backgroundColor: Colors.appThemeColor,
        fontSize: "18px",
        height: "40px",
        borderWidth: "0",
    },
    price: {
        color:"red",
    }
};


export default CheckoutButton;
