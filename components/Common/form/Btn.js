import React, {Component} from 'react';
import {Button, LoadMore, Toast} from "react-weui";
import Colors from "../../../constants/Colors";

class Btn extends Component {
    constructor(props){
        super(props);

        this.state = {
            style: this.props.style,
            disabled: this.props.disabled,
            loading: this.props.loading,
            title: this.props.title,
            onClick: this.props.onClick,
        };
    }

    componentWillReceiveProps(object, nextProps) {
        this.setState({
            style: object.style,
            disabled: object.disabled,
            loading: object.loading,
            title: object.title,
            onClick: object.onClick,
        })
    }

    render(){
        const { onClick, disabled, loading, title } = this.state
        return (
            <div style={styles.dialog}>
                <Button style={styles.btn} onClick={ onClick } disabled={ disabled || loading }>
                    {loading ? <LoadMore loading/> : title}
                </Button>
                <Toast icon="loading" show={loading}>请稍后...</Toast>
            </div>
        );
    }
}

const styles = {
    btn: {
        backgroundColor: Colors.appThemeColor,
        color: Colors.fontColor,
        fontWeight: 'bold',
        width:'100%',
        height:'10vw',
        fontSize:'18px',
    },
    dialog: {
        width:'100%',
        height:'10vw',
    }
};

export default Btn;
