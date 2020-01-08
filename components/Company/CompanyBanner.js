import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import CompanyService from '../../service/CompanyService';
import UtilsService from '../../service/UtilsService';

class CompanyBanner extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            companyId: this.props.companyId,
            defaultImg: '../static/assets/company-default.jpg'
        };
    }

    componentDidMount() {
        this.getCompanyBannerImages();
        this.setState({
            isLogin: localStorage.getItem('isLogIn'),
        });
    }

    getCompanyBannerImages() {
        CompanyService.getCompanyBannerImages(this.props.companyId)
            .then((response) => response.json())
            .then((responseJson) => {

                //TODO check if has images, otherwise put a default banner image for none-banner companies.

                this.setState({
                    images: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render(){
        const images = this.state.images ? this.state.images : [];
        if (images.length > 0 ) {
            return (
                <div style={styles.swiperContainer}>
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                    >
                        {
                            images.map((image, index) => {
                                return (
                                    <div key={index}>
                                        <img  src={image.asset.url} style={styles.bannerImg}/>
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </div>
            );
        }
        else {
            return (
                <div style={styles.swiperContainer}>
                    <img  src={this.state.defaultImg} style={styles.bannerImg}/>
                </div>
            )
        }
    }
}


const styles = {
    swiperContainer: {
        border: '1px solid #eee',
        backgroundColor: '#f8f8f8'
    },
    bannerImg: {
        width: '100%',
        height: '56vw',
        objectFit: 'contain'
    }
};


export default CompanyBanner;
