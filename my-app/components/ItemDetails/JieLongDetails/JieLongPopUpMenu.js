import React from 'react';
import {ActionSheet, Toast} from "react-weui";
import Lang from '../../../lang/Lang';
import Router from "next/dist/client/router";
import JielongService from "../../../service/JielongService";

class JieLongPopUpMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            showHideMenu: this.props.showHideMenu,
            showLoading: this.props.showLoading,
            showMenu: this.props.showMenu,
            userJieLongInfo: this.props.userJieLongInfo,
        };
    }

    componentWillReceiveProps(object, nextProps) {
        this.setState({
            showLoading: object.showLoading,
            item: object.item,
            showMenu: object.showMenu,
            userJieLongInfo: object.userJieLongInfo,
        })
    }

    updateJielong() {
        this.state.showHideMenu();
        let params = { itemId: this.state.item.id, is_update: true, jielongId: this.state.userJieLongInfo.id};
        Router.push({
            pathname: '/checkoutPage',
            query: params,
        });
    }

    cancelJielong() {
        this.state.showHideMenu();
        this.setState({showLoading: true});
        let id = this.state.userJieLongInfo.id;
        let url = "https://www.showmine66.com/ma/i/" + this.state.item.id;
        JielongService.cancelJielong(id, url, {})
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({showLoading: false});
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render(){
        const showLoading = this.state.showLoading;
        const actions = [{
            label: Lang.translate('CANCEL'),
            onClick: ()=>{this.state.showHideMenu()}
        }];
        return (
            <div>
                <ActionSheet
                    menus={[{
                        label: Lang.translate('ITEM.EDIT.JIELONG'),
                        onClick: ()=> {this.updateJielong()}
                    }, {
                        label: Lang.translate('ITEM.CANCEL.JIELONG'),
                        onClick: ()=> {this.cancelJielong()}
                    }]}
                    actions={actions}
                    show={this.state.showMenu === true}
                    type="ios"
                    onRequestClose={ ()=>{this.state.showHideMenu()} }
                    style={styles.menuFont}
                />
                <Toast icon="loading" show={showLoading}>{Lang.translate('LOADING')}...</Toast>
            </div>
        );
    }
}


const styles = {
    menuFont: {
        color: '#000'
    }
};

export default JieLongPopUpMenu;
