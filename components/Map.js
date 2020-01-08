import React, {Component} from 'react';
import Iframe from 'react-iframe';

class Map extends Component {
    constructor(props){
        super(props);

        this.state = {
            address: this.props.address,
        };
    }

    componentWillReceiveProps(object, nextProps) {
        this.setState({
            address: object.address,
        })
    }

    render(){
        let url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyC54M7x-ybIYncE4hLfAMIzkDAiCKhfQ6M&q=" + this.state.address + "\n";
        return (
            <div style={styles.mapWrapper} className={'google-map-fix'}>
                <Iframe url= {url}
                        height='100%'
                        width='100%'
                        style={styles.mapIframe}
                        id="myId"
                        className="myClassname"
                        display="initial"
                        allowFullScreen/>
            </div>
        );
    }
}

const styles = {
    mapWrapper: {
        width: '90%',
        height: '50vw',
        padding: '5%'
    },
    mapIframe: {
        border: 'none'
    }
};

export default Map;
