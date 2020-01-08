import React from 'react';
import {
    Swiper,
} from 'react-weui';

class Swipe extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            demoIndex: 0,
            image: this.props.image,
        };
    }


    componentWillReceiveProps(object, nextProps) {
        this.setState({
            image: object.image,
            demoIndex: 0,
        })
    }

    render(){
        return (
            <div style={styles.swiperContainer}>
                <Swiper
                    interval={2000}
                    auto={true}
                    height={350}
                    onChange={ (prev, next) => this.setState({demoIndex: next}) }
                >
                    {
                        this.state.image.map((item) => {
                            return (<img key={item.url} src={item.url} role="presentation" />)
                        })
                    }
                </Swiper>
            </div>
        );
    }
}


const styles = {
    swiperContainer: {
        border: '1px solid #eee',
        backgroundColor: '#f8f8f8'
    }
};


export default Swipe;
