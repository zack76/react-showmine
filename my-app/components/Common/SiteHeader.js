import React from 'react';
import Lang from '../../lang/Lang';
import Head from "../head";
import Router from "next/dist/client/router";
import SiteHeaderCompanyInfo from './SiteHeaderCompanyInfo';
import WeChatService from "../../service/WeChatService";


class SiteHeader extends React.Component {

    componentDidMount(props) {
        this.setState({
            company: this.props.company,
            item: this.props.item,
        }, () => {
            WeChatService.loadWeChatJsConf(window.location.href);
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            item: nextProps.item,
        }, () => {
            WeChatService.loadWeChatJsConf(window.location.href);
        });
    }

    render(){
        const show = this.props.show !== false;
        const company = this.props.company;

        return (
            <div>
                <Head description={this.props.item && this.props.item.description && this.props.item.description.replace(/<[^>]+>/g, '')}
                      title={this.props.item && this.props.item.title}>
                    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no" />
                </Head>
                {
                    show ?
                        <header>
                            <SiteHeaderCompanyInfo company={company}/>
                        </header>
                        : null
                }
            </div>

        );
    }
}

const styles = {
    // appHeader: {
    //     backgroundColor: '#efc929',
    //     display: 'flex',
    //     minHeight: '15vmin',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     fontSize: '20px',
    //     fontWeight: 'bold',
    //     color: 'black',
    // }
};


export default SiteHeader;
