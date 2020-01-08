import React, {Component} from 'react';
import Colors from "../../constants/Colors";

class CheckoutItemList extends Component {
    constructor(props){
        super(props);
        this.state = {
            defaultImage: '../../../static/assets/default_item.png'
        };
    }

    render(){
        const children = this.props.children ? this.props.children : undefined;
        if (children) {
            return children.map((child) => {
                const imageList = child.images_in_diff_sizes && child.images_in_diff_sizes.smallImages.length !== 0 ? child.images_in_diff_sizes.smallImages : child.images_in_diff_sizes.origImages;
                const imageArray = Object.keys(imageList).map(i => imageList[i]);
                const imageUrl =imageArray[0] ? imageArray[0].url : this.state.defaultImage;
                return (
                    <div key={child.id}>
                        <div key={child.id} style={styles.childContainer}>
                            <div style={styles.childrenImgContainer}>
                                <img src={imageUrl} style={styles.childrenImg}/>
                            </div>
                            <div style={styles.childrenContent}>
                                <p style={styles.childrenDesc}>{child.title}</p>
                                <p style={styles.childrenPrice}>${child.price}</p>
                            </div>
                            <div style={styles.childrenQty}>
                                <p>x {child.qty}</p>
                            </div>
                        </div>
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
    childContainer: {
        display: 'flex',
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: '5vmin',
        paddingTop: '2vw',
        paddingBottom: '2vw'
    },
    childrenImgContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: '2',
        width: '100px'
    },
    childrenImg: {
        width: '100%',
        height: '13vw'
    },
    childrenContent: {
        marginLeft: '3vmin',
        flex: '10',
        fontSize: '12px'
    },
    childrenPrice: {
        color: '#9f0000',
    },
    childrenDesc: {
        color: Colors.fontColor,
    },
    childrenQty: {
        flex: '1'
    },
    bottomDivider: {
        padding: '3px 0',
        backgroundColor: Colors.borderColor,
    }
};

export default CheckoutItemList;

