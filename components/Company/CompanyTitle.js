import React, {useState} from 'react';
import {Button} from 'react-weui';
import {IoIosHeart} from 'react-icons/io';
import Lang from '../../lang/Lang';
import Colors from '../../constants/Colors';
import SubscribeBtn from "../Common/SubscribeBtn";


export default function CompanyTitle(props) {
    const [company, setCompany] = useState(props.company);

    const styles = {
        titleWrapper: {
            borderBottom: '1px solid',
            borderBottomColor: Colors.borderColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        companyName: {
            fontSize: '22px',
            padding: '3vw',
            color: Colors.fontColor,
            flex: 2
        },
        companyFavorite: {
            flex: 1,
        },
        buttonColor: {
            color: '#e64340',
            borderColor: '#e64340'
        }
    };

    return (
        <div style={styles.titleWrapper} className={'custom-font'}>
            <span style={styles.companyName}>{company.name}</span>
            <div style={styles.companyFavorite}>

                {/*<Button type="primary" size={'small'} plain style={styles.buttonColor}>*/}
                {/*    <span className={'icon-position-fix'}>*/}
                {/*        <IoIosHeart/> {company.followers} {Lang.translate('COMPANY.FAVORITE')}*/}
                {/*    </span>*/}
                {/*</Button>*/}
                <SubscribeBtn company={company}/>
            </div>
        </div>
    );

};
