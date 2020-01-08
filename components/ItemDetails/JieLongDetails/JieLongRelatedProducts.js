import React, {Component} from 'react';
import ItemService from "../../../service/ItemService";
import ProductCardGrid from "../../ProductCards/ProductCardGrid";


class JieLongRelatedProducts extends Component {
    constructor(props){
        super(props);
        this.state = {
            companyId: this.props.companyId ? this.props.companyId : undefined,
            params: this.props.params ? this.props.params : {
                is_draft: '0',
                is_sync_to_market: '1',
                page: '1',
                'page-size': '6'
            },
        };
    }

    componentDidMount() {
        this.getRelatedProducts();
    }

    getRelatedProducts() {
        ItemService.getRelatedProducts(this.state.companyId, this.state.params)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    productList: responseJson.data
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render(){
        const productList = this.state.productList ? this.state.productList : undefined;
        if (productList) {
            return (
                <div style={styles.relatedProductWrapper}>
                    <ProductCardGrid productList={productList}/>
                </div>
            )
        }
        else {
            return null;
        }
    }
}

const styles = {
    relatedProductWrapper: {
        backgroundColor: '#fff',
        padding: '4vmin'
    },
};

export default JieLongRelatedProducts;
