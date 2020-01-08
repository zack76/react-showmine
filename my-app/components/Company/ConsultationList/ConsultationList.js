import React from 'react';
import ItemService from "../../../service/ItemService";
import ConsultationListItem from "../ConsultationList/ConsultationListItem";
import Colors from '../../../constants/Colors';
import Lang from '../../../lang/Lang';
import {Button, LoadMore} from 'react-weui';


class ConsultationList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            companyId: this.props.companyId,
            showDivider: !!this.props.showDivider,
            params: {'page': 1, 'page-size': 4}
        };
    }

    componentDidMount() {
        this.getConsultations();
    }

    getConsultations(loadingMore = false) {
        let params = this.state.params;
        this.setState({
            loading: true,
            loadingMore: loadingMore
        });
        ItemService.getCompanyConsultationList(this.state.companyId, params)
            .then((response) => response.json())
            .then((responseJson) => {
                if (this.state.params.page !== 1) {
                    let previousData = this.state.consultationList.data;
                    responseJson.data = previousData.concat(responseJson.data);
                }
                this.setState({
                    consultationList: responseJson,
                    params: {'page': parseInt(responseJson.current_page) + 1, 'page-size': 4},
                    hasMore: responseJson.current_page < responseJson.last_page
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                    loadingMore: false
                })
            });
    };

    render(){
        const consultationList = this.state.consultationList ? this.state.consultationList : undefined;
        const title = Lang.translate('COMPANY.CONSULTATION.TITLE');
        const showDivider = this.state.showDivider;
        const hasMore = this.state.hasMore;
        let loading = this.state.loading;
        let loadingMore = this.state.loadingMore;
        if (consultationList) {
            return (
                <div style={styles.listWrapper}>
                    <div style={styles.listTitle}>{title}</div>
                    {
                        consultationList.data.map(function(item,index){
                        return (<ConsultationListItem item={item} key={index}/>)})
                    }
                    {
                        hasMore ?
                        (
                            loadingMore ?
                                <LoadMore loading>Loading</LoadMore>
                            :
                                (<Button type="primary" plain style={styles.buttonGap} onClick={()=>{this.getConsultations(true)}}>
                                {Lang.translate('COMPANY.CONSULTATION.SHOW_MORE')}</Button>))
                        :
                            null
                    }
                    {showDivider ? <div style={Colors.style.bottomDivider}> </div> : null}
                </div>
            );
        }
        else return null;
    }
}

const styles = {
    listWrapper: {
        width: '100%'
    },
    listTitle: {
        padding: '10px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: Colors.fontColor
    },
    buttonGap: {
        marginBottom: '10px'
    }
};

export default ConsultationList;
