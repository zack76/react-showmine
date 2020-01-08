import React, {useState} from 'react';
import {Button} from 'react-weui';
import ReactHtmlParser from 'react-html-parser';
import Lang from '../../lang/Lang';
import Colors from '../../constants/Colors';
import {IoIosCall} from 'react-icons/io';
import Map from "../Map";

export default function CompanyInfoSection(props) {
    const [company, setCompany] = useState(props.company);
    const styles = {
        listTitle: {
            padding: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: Colors.fontColor
        },
        mapWrapper: {
            borderBottom: '1px solid',
            borderColor: Colors.borderColor
        },
        addressText: {
            textAlign: 'center',
            fontSize: '12px',
            color: '#828a92',
            paddingBottom: '10px'
        },
        contactWrapper: {
            display: 'flex',
            borderBottom: '1px solid',
            borderColor: Colors.borderColor,
            padding: '20px',
            alignItems: 'stretch',
            justifyContent: 'center'
        },
        phoneNum: {
            flex: '9',
            color: Colors.fontColor
        },
        phoneIcon: {
            flex: '1',
            fontSize: '20px',
            marginTop: '-2px'
        },
        descriptionWrapper: {
            padding: '20px',
            paddingBottom: '0',
            color: Colors.fontColor
        },
        descriptionText: {
            color: Colors.fontColor,
            fontSize: '0.8rem',
            padding: '5px',
            textAlign: 'justify'
        },
    };
    let address = company.config.address ? company.config.address : undefined;
    let contact = company.contact_number && company.contact_number.replace(/\s/g,'') !== '' ? company.contact_number : undefined;
    let description = company.description && company.description.replace(/\s/g,'') !== '' ? company.description : undefined;
    return (
        <div>
            <div style={styles.listTitle}>{Lang.translate('COMPANY.INFORMATION')}</div>
            {
                address ?
                    <div style={styles.mapWrapper}>
                        <Map address={address}/><p style={styles.addressText}>{address}</p>
                    </div> : null
            }
            {
                contact ?
                    <div style={styles.contactWrapper}>
                        <div style={styles.phoneNum}><strong>{Lang.translate('COMPANY.CONTACT')}：{contact}</strong></div>
                        <div style={styles.phoneIcon}>
                            <a href={'tel:' + contact}><IoIosCall/></a>
                        </div>
                    </div> : null
            }
            {
                description ?
                    <div style={styles.descriptionWrapper}>
                        <p><strong>{Lang.translate('COMPANY.DESCRIPTION')}</strong></p>
                        <div style={styles.descriptionText}>
                            {ReactHtmlParser(description)}
                        </div>
                    </div> : null
            }
            <div style={Colors.style.bottomDivider}> </div>
        </div>
    );

};
