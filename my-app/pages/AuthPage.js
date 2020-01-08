import React, { Component } from 'react';
import './App.css';
import { Toast} from'react-weui';
import Router from 'next/router';

//import component
import SiteHeader from "../components/Common/SiteHeader";
import AuthService from '../service/AuthService';
import {withRouter} from "next/router";


class AuthPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            showToast: true,
        };
    }

    componentDidMount() {
        localStorage.setItem('userToken', this.props.router.query.token);
        localStorage.setItem('authString', this.props.router.query.authString);
        localStorage.setItem('isLogIn', true);
        this.getMe();
    }

    getMe() {
        let params ={};
        AuthService.getMe(params)
            .then((response) => response.json())
            .then((responseJson) => {
                localStorage.setItem('userObject', JSON.stringify(responseJson));
            })
            .then(() => {
                window.open(this.props.router.query.origUrl,"_self");
            })
            .catch((error) => {
                console.error(error);
            });
    }


    render() {
        return (
            <div className="App-body">
                <SiteHeader/>
                <div className='App-body'>
                    <Toast icon="loading" show={this.state.showToast}>微信登录中...</Toast>
                </div>

            </div>

        );
    }
}

export default withRouter(AuthPage);
