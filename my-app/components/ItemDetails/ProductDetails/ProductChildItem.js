import React from 'react';
import Colors from "../../../constants/Colors";


class ProductChildItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            defaultImage: '../static/assets/default_item.png',
            quantity: 0,
            callbackUpdateItem: this.props.callbackUpdateItem ? this.props.callbackUpdateItem : undefined,
        };
    }

    handleQtyChange(event) {
        this.setState({
            quantity: Number(event.target.value)}
            , ()=> {
            this.state.callbackUpdateItem(this.state.item.id, this.state.quantity);
        });
    }

    handleQuantity(operation) {
        if(operation === '+') {
            this.setState({
                quantity: this.state.quantity + 1,
            }, ()=>{
                this.state.callbackUpdateItem(this.state.item.id, this.state.quantity);
            })
        }
        else {
            this.setState({
                quantity: this.state.quantity - 1,
            }, ()=> {
                this.state.callbackUpdateItem(this.state.item.id, this.state.quantity);
            })

        }
    }

    render(){
        const item = this.state.item;
        const imageList = item.images_in_diff_sizes && item.images_in_diff_sizes.smallImages.length !== 0 ? item.images_in_diff_sizes.smallImages : item.images_in_diff_sizes.origImages;
        const imageArray = Object.keys(imageList).map(i => imageList[i]);
        const imageUrl = imageArray[0] ? imageArray[0].url : this.state.defaultImage;

        return (
            <div>
                <div style={styles.itemWrapper}>
                    <div style={styles.imgWrapper}>
                        <img style={styles.img} src={imageUrl}/>
                    </div>
                    <div style={styles.contentWrapper}>
                        <div style={styles.itemTitle}>{item.title}</div>
                        <div style={styles.itemPrice}>${item.price}</div>

                        <div className="Number-Picker">
                            <button style={styles.pickerButton} onClick={() => {this.handleQuantity('-')}}> － </button>
                            <input style={styles.picker}
                                   type="number"
                                   min="0" max="1000"
                                   value={this.state.quantity}
                                   onChange={(event)=>{this.handleQtyChange(event)}}
                            />
                            <button style={styles.pickerButton} onClick={() => {this.handleQuantity('+')}}> ＋ </button>
                        </div>

                    </div>
                </div>
                <div style={Colors.style.bottomDivider}> </div>
            </div>

        );
    }
}

const styles = {
    cartItemWrapper: {

    },
    itemWrapper: {
        flexDirection: 'row',
        flex: '1',
        display:'flex',
        borderBottom: '1px solid',
        borderColor: Colors.borderColor,
        padding: '15px',
    },
    imgWrapper: {
        flex: "3",
    },

    contentWrapper: {
        flex: "6",
        alignItems:'-end',
    },

    itemTitle: {
        fontSize: '18px',
        textAlign: 'right',
    },
    itemPrice: {
        color: 'red',
        fontSize: '18px',
        textAlign: 'right',
    },
    picker:{
        textAlign: 'center',
        fontSize: '18px',
        height: '28px',
        width: '60px',
        borderRadius: '0',
        border: 'none',
    },
    pickerButton: {
        fontSize: '18px',
        backgroundColor: '#efc929',
        border: 'none',
        width: '28px',
        height: '28px',
        borderRadius: '0',
    },
    img: {
        width: '100%',
        height: '25vw',
        objectFit: 'cover'
    },


};


export default ProductChildItem;
