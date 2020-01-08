import React from 'react';
import ItemService from "../../../service/ItemService";
import SlideableListItem from "../SlideableList/SlideableListItem";
import Colors from '../../../constants/Colors';
import Lang from '../../../lang/Lang';

class SlideableJieLongList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            companyId: this.props.companyId,
            showDivider: !!this.props.showDivider,
            params: this.props.isOngoing ? listType.ongoing : listType.past,
            title: this.props.isOngoing ? Lang.translate('COMPANY.JIELONG.ONGOING') : Lang.translate('COMPANY.JIELONG.PAST')
        };
    }

    componentDidMount() {
        this.getJieLongList();
    }

    getJieLongList() {
        let params = this.state.params;
        ItemService.getCompanyJieLongList(this.state.companyId, params)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    jieLongList: responseJson,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render(){
        const jieLongList = this.state.jieLongList ? this.state.jieLongList : undefined;
        const title = this.state.title;
        const showDivider = this.state.showDivider;
        if (jieLongList && jieLongList.data && jieLongList.data.length > 0) {
            return (
                <div style={styles.horizontalScrollableContainer} className={'custom-font'}>
                    <div style={styles.listTitle}>{title}</div>
                    {
                        jieLongList.data.map(function(product,index) {
                            return (
                                <SlideableListItem product={product} key={index}/>
                            )
                        })
                    }
                    {showDivider ? <div style={Colors.style.bottomDivider}> </div> : null}
                </div>
            );
        }
        else return null;
    }
}

const styles = {
    horizontalScrollableContainer: {
        overflow: 'auto',
        whiteSpace: 'nowrap',
    },
    listTitle: {
        padding: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: Colors.fontColor
    },
};

const listType = {
    ongoing: {
        'page-size':6,
        'is_draft': 0,
        'is_expired': 0,
        'is_sold': 0,
        'is_end': 0,
        'is_sync_to_market': 1
    },
    past: {
        'page-size':6,
        'is_draft': 0,
        'is_past_jie_long': 1,
        'is_sync_to_market': 1
    },
};


export default SlideableJieLongList;
