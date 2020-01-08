import React from 'react';
import Colors from "../../constants/Colors";
import {Button, TextArea, ActionSheet, Switch, Radio, Cells, CellsTitle, Cell, CellHeader, CellBody, CellFooter, Form, FormCell, Input, Label, LoadMore, Toast,} from 'react-weui';
import CheckoutItemList from "./CheckoutItemList";
import PaymentService from '../../service/PaymentService';
import Lang from "../../lang/Lang";
import CartService from "../../service/CartService";


class CheckoutView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            parentItem: this.props.parentItem,
            selectedList: this.props.selectedList,
            company: this.props.parentItem.company ? this.props.parentItem.company : undefined,
            params: {
                name: '',
                contactNum: '',
                notes: '',
                address: '',
                location: {}
            },
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            selectedList: nextProps.selectedList
        })
    }
    componentDidMount() {
        this.getCompanyPickupLocations();
    }

    getCompanyPickupLocations = () => {
        let tmpLocations = false;
        if (this.state.company.pickup_locations && this.state.company.pickup_locations.length > 0) {
            this.setState({
                pickupLocationList: this.state.company.pickup_locations
            });
        } else {
            this.setState({
                pickupLocationList: tmpLocations
            })
        }
    };

    handleInputFieldChange = (event) => {
        let params = this.state.params;
        params[event.target.name] = event.target.value;
        this.setState({
            params: params
            }, () => {console.log(this.state);});
    };

    showHideLocationMenu = () => {
        this.setState(
            (prevState) => ({
                showLocationPopup: !prevState.showLocationPopup
            })
        )
    };

    updatePickupLocation = (location) => {
        let params = this.state.params;
        params.location = location;
        this.setState({
            params: params
        }, () => {
            this.showHideLocationMenu();
        })
    };

    createOrder = () => {
        PaymentService.createOrder(params)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    cartItems: cartItems,
                    selectedItemList: cartItems
                }, () => {
                    this.CalculateTotalCost(cartItems)
                });
            }).catch((error) => {
            console.error(error);
        });
    };

    render(){
        const selectedList = this.state.selectedList;
        console.log(selectedList);
        const pickupLocationList = this.state.pickupLocationList;
        let locationMenu = undefined;
        if (pickupLocationList) {
            locationMenu = pickupLocationList.map((location) =>
                <ActionSheet
                    key={location.id}
                    menus={
                        [{
                            label: location.title,
                            onClick: ()=> {this.updatePickupLocation(location)}
                        }]
                    }
                    actions={
                        [{
                            label: '关闭',
                            onClick: ()=> this.showHideLocationMenu()
                        }]
                    }
                    show={this.state.showLocationPopup}
                    type="ios"
                    onRequestClose={()=>this.showHideLocationMenu()}
                />
            );
        }

        return (
            <div style={styles.viewWrapper}>

                <CellsTitle>取货地点*</CellsTitle>
                <Cells>
                    <Cell access>
                        <CellBody onClick={()=>{this.showHideLocationMenu()}}>
                            {this.state.params.location.id ?
                                this.state.params.location.title : <span>请选择取货地点</span>
                            }
                        </CellBody>
                        <CellFooter/>
                    </Cell>
                </Cells>

                <CellsTitle>联系方式*</CellsTitle>
                <Form>
                    <FormCell>
                        <CellHeader>
                            <Label>姓名</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="text" placeholder="请输入姓名" name='name' value={this.state.contactName}
                                   onChange={this.handleInputFieldChange}/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>联系电话</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="number" placeholder="请输入手机号" name='contactNum' value={this.state.contactNum}
                                   onChange={this.handleInputFieldChange}/>
                        </CellBody>
                    </FormCell>
                    <FormCell>
                        <CellHeader>
                            <Label>地址</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="text" placeholder="请输入地址" name='address'
                                   value={this.state.contactAddress} onChange={this.handleInputFieldChange}/>
                        </CellBody>
                    </FormCell>
                </Form>
                <CellsTitle>备注</CellsTitle>
                <Form>
                    <FormCell>
                        <CellBody>
                            <TextArea placeholder="请输入文本" rows="3" name='notes' value={this.state.notes} onChange={this.handleInputFieldChange}></TextArea>
                        </CellBody>
                    </FormCell>
                </Form>

                <CellsTitle>共{selectedList.length}件商品</CellsTitle>
                <Cells>
                    <CheckoutItemList children={selectedList}/>
                </Cells>
                <div style={styles.buttonGroupContainer}>
                    <Button type="primary"
                            onClick={()=>{this.checkLoginStatus()}}>
                        确认订单</Button>

                </div>
                {locationMenu}
            </div>
        );
    }
}

const styles = {
    viewWrapper: {
        backgroundColor: Colors.formBackground,
        paddingTop: '1vw'
    },
    buttonGroupContainer: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        color: '#fff',
        textAlign: 'center',
    }
};


export default CheckoutView;
