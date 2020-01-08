import React from 'react';
import {Button} from "react-weui";
import Lang from '../../../lang/Lang';
import Router from "next/dist/client/router";

class JieLongButtonArea extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            isLogin: this.props.isLogin,
            userJieLongInfo: this.props.userJieLongInfo,
            loadingJieLong: this.props.loadingJieLong,
            showHideMenu: this.props.showHideMenu
        };
    }

    componentWillReceiveProps(object, nextProps) {
        this.setState({
            item: object.item,
            isLogin: object.isLogin,
            userJieLongInfo: object.userJieLongInfo,
            loadingJieLong: object.loadingJieLong
        })
    }

    goCheckout() {
        Router.push({
            pathname: '/checkoutPage',
            query: {itemId: this.state.item.id}
        })
    }

    render(){
        const userJieLongInfo = this.state.userJieLongInfo;
        const loadingJieLong = this.state.loadingJieLong;
        const canEdit = userJieLongInfo && !userJieLongInfo.is_paid;
        return (
            <div style={styles.buttonGroupContainer}>
                {
                    canEdit
                        ?
                        <Button type="primary" onClick={()=>{this.state.showHideMenu()}}>{Lang.translate('ITEM.EDIT.JIELONG')}</Button>
                        :
                        <Button type="primary" disabled={loadingJieLong} onClick={()=>{this.goCheckout()}}>{Lang.translate('ITEM.BUY_NOW')}</Button>
                }
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
        backgroundColor: '#fff',
        color: '#fff',
        textAlign: 'center',
    }
};


export default JieLongButtonArea;
