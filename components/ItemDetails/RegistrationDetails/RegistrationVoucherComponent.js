import React, {Component} from 'react';
import Colors from "../../../constants/Colors";
import {Cell, CellBody, CellFooter, Cells, Gallery} from "react-weui";
import JielongService from "../../../service/JielongService"


class RegistrationVoucherComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: this.props.isLogin,
            showVoucher: false,
            item: this.props.item,
            callbackUpdateIsParticipated: this.props.callbackUpdateIsParticipated
        };
    }

    componentDidMount() {
        this.getAllJielong()
    }

    getAllJielong() {
        let id = this.state.item.id;
        JielongService.getAllJielong(id)
            .then((response) => response.json())
            .then((responseJson) => {
                let currentJielong = responseJson[responseJson.length - 1] && responseJson[responseJson.length - 1].id ?
                    responseJson[responseJson.length - 1] : undefined;
                this.setState({
                    allJielongInfo: responseJson,
                    processAllJieLong: true,
                }, () => {
                    this.state.callbackUpdateIsParticipated(responseJson && responseJson.length > 0, currentJielong )
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    showHideJieLongMenu() {
        this.setState((prevState) => ({
            showMenu: !prevState.showMenu
        }));
    };

    render(){
        const item = this.state.item ? this.state.item : undefined;
        const allJielongInfo = this.state.allJielongInfo ? this.state.allJielongInfo : undefined;
        const showDivider = !!this.props.showDivider
        if (allJielongInfo) {
            return (
                <div key={item.id} style={styles.cellWrapper}>
                    {
                        allJielongInfo.map((jieLong) =>
                            <div key={jieLong.id}>
                                <Cell href={undefined} onClick={e=>this.setState({ showVoucher: true})} access>
                                    <CellBody>
                                        {
                                            jieLong && jieLong.is_paid && jieLong.voucher && jieLong.voucher.receipt && jieLong.voucher.receipt.amount && jieLong.voucher.refnum && jieLong.is_paid?
                                                <div className='allJielongInfo'>
                                                    <div><span className='paidAmount-icon'>已支付：${jieLong.voucher.receipt.amount}</span> 回执码：<span className='Ref-num'>{jieLong.voucher.refnum}</span></div>
                                                </div>
                                                :
                                                <div className='isInJielong-row'>
                                                    {
                                                        jieLong.voucher && jieLong.voucher.refnum ?
                                                            <div><span className='tag-icon'>参加成功</span> 回执码：<span className='Ref-num'>{jieLong.voucher.refnum}</span></div>
                                                            :
                                                            <div>提示：您有订单未完成，请在30分钟内完成支付。</div>
                                                    }
                                                </div>
                                        }
                                    </CellBody>
                                    <CellFooter/>
                                </Cell>
                                <Gallery src={jieLong.voucher && jieLong.voucher.img_url ? jieLong.voucher.img_url : undefined} show={this.state.showVoucher}>
                                    <div style={styles.galleryButton} onClick={e=>this.setState({ showVoucher: false})}>Cancel</div>
                                </Gallery>
                            </div>
                        )
                    }
                    {showDivider ? <div style={Colors.style.bottomDivider}> </div> : null}
                </div>
            )
        } else return null

    }
}

const styles = {
    cellWrapper: {
        backgroundColor: '#fff'
    }
};

export default RegistrationVoucherComponent;

