import React, {Component} from 'react';
import Colors from "../../../constants/Colors";
import JielongService from "../../../service/JielongService";
import ItemBanner from "../ItemBanner";
import ItemContent from "../ItemContent";
import JieLongChildrenList from "./JieLongChildrenList";
import JieLongRelatedProducts from "./JieLongRelatedProducts";
import JieLongButtonArea from "./JieLongButtonArea";
import JieLongPopUpMenu from "./JieLongPopUpMenu";
import {Cells, Cell, CellBody, CellFooter, Gallery} from 'react-weui';


class JieLongDetailComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLogin: this.props.isLogin,
            showVoucher: false,
            item: this.props.item
        };
    }

    componentDidMount() {
        this.state.isLogin ? this.getAllJielong() : null;
    }

    getAllJielong() {
        let id = this.state.item.id;
        JielongService.getAllJielong(id)
            .then((response) => response.json())
            .then((responseJson) => {
                let currentId = responseJson.length - 1;
                this.setState({
                    allJielongInfo: responseJson,
                    processAllJieLong: true,
                    userJieLongInfo : responseJson[currentId],
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
        const isLogin = this.state.isLogin;
        const allJielongInfo = this.state.allJielongInfo ? this.state.allJielongInfo : undefined;
        const showLoading = this.state.showLoading ? this.state.showLoading : false;
        const userJieLongInfo = this.state.userJieLongInfo ? this.state.userJieLongInfo : '';
        const loadingJieLong = this.state.processAllJieLong;
        const showMenu = typeof this.state.showMenu !== 'undefined' ? this.state.showMenu : false;

        return (
            <div className='App-body' key={item.id}>
                <ItemBanner item={item}/>

                <ItemContent jieLongDetail={item}/>

                <Cells>
                    {allJielongInfo ?
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
                        : null
                    }
                </Cells>

                <JieLongChildrenList children={item.children ? item.children : undefined}/>

                <JieLongRelatedProducts companyId={item.company_id}/>

                <JieLongButtonArea
                    item={item}
                    isLogin={isLogin}
                    userJieLongInfo={userJieLongInfo}
                    loadingJieLong={loadingJieLong}
                    showHideJieLongMenu={()=>this.showHideJieLongMenu()}/>

                <JieLongPopUpMenu
                    item={item}
                    showHideJieLongMenu={()=>{this.showHideJieLongMenu()}}
                    showLoading={showLoading}
                    showMenu={showMenu}
                    userJieLongInfo={userJieLongInfo}/>

            </div>
        )
    }
}

const styles = {

};

export default JieLongDetailComponent;

