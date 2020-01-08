import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

class ItemBanner extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            item: this.props.item,
            defaultImage: '../static/assets/default_item.png'
        };
    }

    render(){
        const item = this.state.item;
        const imageList = item.images && item.images.length !== 0 ? item.images : [{url:this.state.defaultImage}];
        return (
            <div>
                <Carousel showThumbs={false} showStatus={false}>
                    {
                        imageList.map((image, index) => {
                            return (
                                <div key={index}>
                                    <img  src={image.url} style={styles.bannerImg}/>
                                </div>
                            )
                        })
                    }
                </Carousel>
            </div>
        );
    }
}


const styles = {
    // swiperContainer: {
    //     border: '1px solid #eee',
    //     backgroundColor: '#f8f8f8'
    // },
    bannerImg: {
        width: '100%',
        height: '70vw',
        objectFit: 'contain'
    }
};


export default ItemBanner;
