import React, {Component} from 'react';
import Layout from '../../constants/Layout';
import UtilsService from '../../service/UtilsService';
import Link from 'next/link';

class ProductCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            product: this.props.product,
            defaultImage: '../static/assets/default_item.png'
        };
    }



    render(){
        const product = this.props.product;
        let imageSize = 'SMALL';
        const imgUrl = UtilsService.getItemImgUrlWithSize(product, imageSize);
        return (
            <Link href={{ pathname: '/itemDetails', query: { itemId: product.id} }}>
                <a>
                    <img style={styles.img} src={imgUrl}/>
                    <div style={styles.productTitle}>{product.title}</div>
                </a>
            </Link>
        );
    }
}

const styles = {
    productTitle: {
        padding: '5%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '90%',
        fontSize: '12px',
        color: '#000'
    },
    img: {
        width: '100%',
        height: '30vw',
        objectFit: 'contain'
    },
};

export default ProductCard;
