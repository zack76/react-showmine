import React, {Component} from 'react';
import Colors from "../../../constants/Colors";
import RegistrationFields from "./RegistrationFields";
import RegistrationButtonArea from "./RegistrationButtonArea";
import RegistrationVoucherComponent from "./RegistrationVoucherComponent";
import ItemBanner from "../ItemBanner";
import ItemContent from "../ItemContent";
import AuthService from "../../../service/AuthService";
import {Config} from "../../../Config";


class RegistrationDetailComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: this.props.isLogin,
            item: this.props.item,
            isParticipated: false,
            isEditing: false,
            registrationObj: undefined,
            registrationId: undefined,
            formValues: {},
            isValidForm: false,
        };
    }

    componentDidMount() {
        this.setState({
            isLogin: localStorage.getItem('isLogIn'),
        }, () => {
            if (!this.state.isLogin) {
                this.weChatLogin();
            }
        });
    }

    updateFormValues = (formValues, isValidForm) => {
        this.setState({
            formValues: formValues,
            isValidForm: isValidForm
        })
    }

    updateIsParticipatedInfo = (isParticipated , registrationObj)=> {
        this.setState({
            isParticipated: isParticipated,
            registrationId: registrationObj && registrationObj.id ? registrationObj.id : undefined,
            registrationObj: registrationObj
        })
    }

    weChatLogin() {
        let origUrl = window.location.href;
        let authUrl = Config.webAddress +'AuthPage';
        AuthService.wechatLogin(origUrl, authUrl, {})
            .then((response) => response.json())
            .then((responseJson) => {
                window.open(responseJson.auth_url, "_self");
            })
            .catch((error) => {
                alert(error);
            });
    }

    updateIsEditing = () => {
        this.setState((prevState) => (
            {
                isEditing: !prevState.isEditing
            })
        )
    }


    render(){
        const { item, isLogin, isParticipated, registrationId, registrationObj, isValidForm, isEditing } = this.state
        return (
            <div className='App-body' key={ item.id } style={ styles.pageBackground }>

                <ItemBanner item={ item }/>

                <RegistrationVoucherComponent item={ item } isLogin={ isLogin } callbackUpdateIsParticipated={this.updateIsParticipatedInfo} />

                <ItemContent itemDetail={ item ? item : undefined } showDivider={ false }/>

                <RegistrationFields item={ item } callbackUpdateForm={this.updateFormValues}
                                    isParticipated={ isParticipated } isEditing={isEditing} registrationObj={ registrationObj }/>

                <RegistrationButtonArea item={ item } isLogin={ isLogin } formValues={ this.state.formValues }
                                        isParticipated={ isParticipated } registrationId={ registrationId } isValidForm={isValidForm}
                                        callbackUpdateIsEditing={this.updateIsEditing} isEditing={isEditing} />
            </div>
        )
    }
}

const styles = {
    pageBackground: {
        backgroundColor: Colors.formBackground
    }
};

export default RegistrationDetailComponent;

