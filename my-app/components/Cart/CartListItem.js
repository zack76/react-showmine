import React from 'react';
import Colors from "../../constants/Colors";


class CartListItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
            defaultImage: '../static/assets/default_item.png',
            quantity: this.props.item.qty,
            // unitPrice: this.props.item.item.price,
            unitPrice: 8,
            subtotalPrice: 0,
            isSelected: true,
            callbackUpdate: this.props.callbackUpdate ? this.props.callbackUpdate : undefined,
        };
    }

    handleQtyChange(event) {
        this.setState({
            quantity: Number(event.target.value)}
            , ()=> {
            this.state.callbackUpdate(this.state.item.id, this.state.quantity, this.state.isSelected);
        });
    }

    handleQuantity(operation) {
        if(operation === '+') {
            this.setState({
                quantity: this.state.quantity + 1,
            }, ()=>{
                this.state.callbackUpdate(this.state.item.id, this.state.quantity, this.state.isSelected);
            })
        }
        else {
            this.setState({
                quantity: this.state.quantity - 1,
            }, ()=> {
                this.state.callbackUpdate(this.state.item.id, this.state.quantity, this.state.isSelected);
            })

        }
    }

    handleCheckboxChange = (event) => {
        this.setState({
            isSelected: event.target.checked
        }, ()=>{
            this.state.callbackUpdate(this.state.item.id, this.state.quantity, this.state.isSelected);
        });
    };

    render(){
        const item = this.state.item;
        const imageList = item.images_in_diff_sizes && item.images_in_diff_sizes.smallImages.length !== 0 ? item.images_in_diff_sizes.smallImages : item.images_in_diff_sizes.origImages;
        const imageArray = Object.keys(imageList).map(i => imageList[i]);
        const imageUrl = imageArray[0] ? imageArray[0].url : this.state.defaultImage;

        return (
            <div>
                <div style={styles.itemWrapper}>
                    <div style={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            onChange={this.handleCheckboxChange}
                            style={styles.checkbox}
                            defaultChecked={item.isSelected}
                        />
                    </div>
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
    checkbox: {
        borderColor: Colors.borderColor,
        color: Colors.appThemeColor,
        fontSize: '14px',
        textAlign: 'center',
        height: '20px',
        width: '20px',
        backgroundColor:Colors.appThemeColor
    },

    checkboxWrapper: {
        flex: '1',
        alignItems:'center',
        justifyContent:'center',
        alignSelf: 'center',
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


export default CartListItem;
