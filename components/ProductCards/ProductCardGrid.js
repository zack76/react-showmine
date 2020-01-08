import React, {Component} from 'react';
import ProductCard from "./ProductCard";

class ProductCardGrid extends Component {

    render(){
        const productList = this.props.productList ? this.props.productList : undefined;
        if (productList) {
            return productList.map((product, index) => {
                return (
                    <div key={product.id} style={styles.productList}>
                        <ProductCard product={product}/>
                    </div>
                )
            });
        }
        else {
            return null;
        }
    }
}

const styles = {
    productList: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        width: '45%',
        display: 'inline-block',
        margin: '2vmin',
    }
};

export default ProductCardGrid;
