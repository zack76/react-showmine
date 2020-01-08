import React, {Component} from 'react';
import Link from 'next/link';
import Colors from '../../../constants/Colors';
import UtilsService from '../../../service/UtilsService'

class ConsultationListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
        };
    }

    render(){
        const item = this.props.item;
        const imageSize = 'SMALL';
        const imageUrl = UtilsService.getItemImgUrlWithSize(item, imageSize);
        return (
            <div style={styles.cardWrapper}>
                <div style={styles.imageWrapper}>
                    <Link href={{ pathname: '/itemDetails', query: { itemId: item.id} }} replace>
                        <a>
                            <img style={styles.img} src={imageUrl}/>
                        </a>
                    </Link>
                </div>
                <div style={styles.textContainer}>
                    <Link href={{ pathname: '/itemDetails', query: { itemId: item.id} }}>
                        <a>
                            <p style={styles.itemTitle} className={'truncate'}>{item.title}</p>
                            <p style={styles.itemTime}>{item.date_publish}</p>
                        </a>
                    </Link>
                </div>
            </div>
        );
    }
}

const styles = {
    img: {
        width: '100%',
        height: '22vw',
        objectFit: 'cover'
    },
    cardWrapper: {
        width: '100%',
        display: 'flex',
        borderBottom: '2px solid',
        borderColor: Colors.borderColor,
        marginBottom: '10px',
        paddingBottom: '5px'
    },
    imageWrapper: {
        flex: '8',
        paddingLeft:'5px'
    },
    textContainer: {
        flex: '13',
        padding: '0px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: '17px',
        color: Colors.fontColor,
        fontWeight: 'bold',
        flex: '5'
    },
    itemTime: {
        fontSize: '11px',
        color: '#828a92',
        flex: '3',
        paddingTop:'10px'
    }
};

export default ConsultationListItem;
