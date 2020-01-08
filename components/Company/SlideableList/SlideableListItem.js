import React, {Component} from 'react';
import Link from 'next/link';
import {IoMdHeartEmpty} from 'react-icons/io';
import UtilsService from '../../../service/UtilsService'

class SlideableListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            product: this.props.product,
        };
    }

    render(){
        let imageSize = 'MEDIUM';
        const product = this.props.product;
        const imageUrl = UtilsService.getItemImgUrlWithSize(product, imageSize);
        return (
            <div style={styles.cardWrapper}>
                <Link href={{ pathname: '/itemDetails', query: { itemId: product.id} }} replace>
                    <a>
                        <div style={styles.imageWrapper}>
                            <img style={styles.img} src={imageUrl}/>
                            <div style={styles.subscriberContainer}>
                                <span style={styles.textWrapper} className={'icon-position-fix'}>
                                    <IoMdHeartEmpty/> {product.fav_count}</span>
                            </div>
                        </div>
                        <div style={styles.productTitle}>{product.title}</div>
                    </a>
                </Link>
            </div>
        );
    }
}

const styles = {
    productTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
        fontSize: '12px',
        color: '#000',
        marginTop: '-5px'
    },
    img: {
        width: '100%',
        height: '30vw',
        objectFit: 'cover'
    },
    cardWrapper: {
        width: '37%',
        display:'inline-block',
        padding: '0 5px'
    },
    subscriberContainer: {
        position: 'absolute',
        bottom: '6px',
        left: 0,
        width: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        fontSize: '12px'
    },
    imageWrapper: {
        position: 'relative'
    },
    textWrapper: {
        padding: '0.1rem 1rem'
    }
};

export default SlideableListItem;
