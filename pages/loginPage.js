import React, { Component } from 'react';
import './App.css';
import { Button, CellHeader, CellBody, Form, FormCell, Input, Label} from'react-weui';
import Router from 'next/router';
import Map from '../components/Map';



//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';


//import component
import Head from "../components/head";
import AuthService from "../service/AuthService";



class loginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    login = () => {
        localStorage.setItem('userToken', "769eb289606972ccc499d33b478c092c");
        localStorage.setItem('isLogIn', true);
    };

    wechatlogin() {
        let origUrl ="http://localhost:3000/index";
        let authUrl ="http://localhost:3000/AuthPage";

        let params ={};
        AuthService.wechatLogin(origUrl, authUrl, params)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                window.open(responseJson.auth_url, "_self");
            })
            .catch((error) => {
                console.error(error);
            });
    }


    showVoucher() {
        Router.push('/index');
    }




    render() {

        return (
            <div className="App-body">
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <header className="App-header">
                    <div>
                        ShowMine
                    </div>
                </header>
                <div className='App-body'>
                    <div style={{padding: 20}}>
                        <h1 style={{textAlign: 'center'}}>微信登录</h1>
                        <div style={{textAlign: 'center'}}>
                            <img height={300} src='../static/assets/qrcode-new.jpg' role="presentation" />
                        </div>
                        <Form>
                            <FormCell>
                                <CellHeader>
                                    <Label>Email</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="email" placeholder="username@abc.com" onClick={(text)=>{this.handleEmail(text)}}/>
                                </CellBody>
                            </FormCell>
                            <FormCell>
                                <CellHeader>
                                    <Label>Password</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input type="password" placeholder="123456" onClick={(text)=>{this.handlePsw(text)}}/>
                                </CellBody>
                            </FormCell>
                        </Form>
                        <br/>
                        <Button type="primary" className='button' onClick={()=>{this.login();}}>Log in</Button>
                        <Button type="primary" className='button' onClick={()=>{this.wechatlogin();}}>Wechat Login</Button>
                        <Button plain className='button' style={styles.test} onClick={()=>{this.showVoucher();}}>Show Voucher</Button>
                    </div>
                    <Map address='Factory 108/45 Gilby Rd, Mount Waverley VIC 3149'/>
                </div>
            </div>

        );
    }
}const styles = {
    test: {
        color: 'red',
        border: 'solid',
        borderWidth: '1px',
        borderColor: 'red'
    },
    img: {
        width: '100%',
        height: '30vw',
        objectFit: 'cover'
    },
};

export default loginPage;










