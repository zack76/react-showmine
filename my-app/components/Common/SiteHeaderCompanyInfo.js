import React from 'react';
import Lang from '../../lang/Lang';
import Colors from '../../constants/Colors';
import Link from 'next/link';

class SiteHeaderCompanyInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            company: this.props.company,
        };
    }

    componentWillReceiveProps(object, nextProps) {
        this.setState({
            company: object.company,
        })
    }

    render(){
        const company = this.state.company ? this.state.company : undefined;
        if (company) {
            return (
                    <Link href={{ pathname: '/index', query: { companyId: company.id} }}>
                        <a>
                            <div style={styles.companyWrapper}>
                                <div style={styles.companyLogoContainer}>
                                    <img style={styles.companyLogo} src={company.logo_img.url} role="presentation" />
                                </div>
                                <div style={styles.companyContent}>
                                    <div style={styles.companyTitle}>{company.name}</div>
                                    {/*<div style={styles.followers}>{Lang.translate('ITEM.COMPANY.FOLLOWERS')}：{company.followers}</div>*/}
                                </div>
                            </div>
                        </a>
                    </Link>
            )
        }
        else return null;
    }
}


const styles = {
    appHeader: {
        backgroundColor: '#efc929',
        display: 'flex',
        minHeight: '15vmin',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'black',
    },
    companyWrapper: {
        display: 'flex',
        flexDirection: 'row',
        padding: '2vmin',
        flex: '1',
        color: Colors.fontColor,
        backgroundColor: Colors.appThemeColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    companyLogoContainer: {
        flex:1
    },
    companyLogo: {
        width: '10vw',
        height: '10vw',
        display: 'block',
        margin: '0 auto'
    },
    companyContent: {
        // display: 'flex',
        // flexDirection: 'column',
        flex: '3'
    },
    companyTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        // color: '#107fc4',
        color: Colors.fontColor,
        textAlign: 'left'
    },
    // followers: {
    //     fontSize: '12px',
    //     textAlign: 'end',
    //     fontWeight: 'bold',
    //     paddingRight: '10vw'
    // },
};


export default SiteHeaderCompanyInfo;
