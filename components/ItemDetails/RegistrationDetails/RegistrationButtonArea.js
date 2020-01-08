import React from 'react'
import { Dialog,} from "react-weui"
import UtilsService from '../../../service/UtilsService'
import Colors from '../../../constants/Colors'
import JielongService from "../../../service/JielongService"

import Btn from "../../Common/form/Btn"

class RegistrationButtonArea extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            item: this.props.item,
            formValues: this.props.formValues,
            isLoading: false,
            isLogin: this.props.isLogin,
            isParticipated: this.props.isParticipated,
            registrationId: this.props.registrationId,
            showConfirmDialog: false,
            currentJieLong: {},
            isValidForm: this.props.isValidForm,
            isEditing: this.props.isEditing,
            callbackUpdateIsEditing: this.props.callbackUpdateIsEditing
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            item: nextProps.item,
            isLogin: nextProps.isLogin,
            formValues: nextProps.formValues,
            isParticipated: nextProps.isParticipated,
            registrationId: nextProps.registrationId,
            isValidForm: nextProps.isValidForm,
            isEditing: nextProps.isEditing
        })
    }

    createJielongComment = () => {
        this.setState({ isLoading: true })
        let itemId = this.state.item.id
        let params = {
            'config': JSON.stringify(this.state.formValues),
            'comments': '',
            'quantity': 1,
            'state_redirect_obj': {
                url: UtilsService.getWebAddress(),
            },
            'wechat_auth_url': "https://www.showmine66.com/a/wu?domain=https%253A%252F%252Fwww.showmine66.com&origurl=https%253A%252F%252Fwww.showmine66.com%252Fma%252Fi%252Fdbfcefa936b4cd6d5709953b5ea12673%2523app-top",
            'item_url': "https://react.showmine66.com/itemDetails?itemId=" + itemId,
            // 'item_url': "https://www.showmine66.com/ma/i/" + itemId,
            'voucher_base_url': "https://www.showmine66.com/ma/jl/vci/VOUCHERID",
            'is_private': false
        }

        JielongService.createJielongComment(itemId, params)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ currentJieLong: responseJson })
                this.generateVoucher(responseJson.id, this.state.item)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    updateJielongComment = () => {
        this.setState({ isLoading: true })
        // TODO change to jieLongId
        let jieLongId = this.state.registrationId
        let params = {
            'config': JSON.stringify(this.state.formValues),
            'comments': '',
            'quantity': 1,
            'state_redirect_obj': {
                url: UtilsService.getWebAddress(),
            },
            'wechat_auth_url': "https://www.showmine66.com/a/wu?domain=https%253A%252F%252Fwww.showmine66.com&origurl=https%253A%252F%252Fwww.showmine66.com%252Fma%252Fi%252Fdbfcefa936b4cd6d5709953b5ea12673%2523app-top",
            'item_url': "https://www.showmine66.com/ma/i/" + this.state.item.id,
            'voucher_base_url': "https://www.showmine66.com/ma/jl/vci/VOUCHERID",
            'is_private': false
        }

        JielongService.updateJielongComment(jieLongId, params)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ currentJieLong: responseJson })
                this.generateVoucher(responseJson.id, this.state.item)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    cancelJielong() {
        this.showHideConfirmDialog()
        this.setState({ isLoading: true })
        let jieLongId = this.state.registrationId
        let url = "https://www.showmine66.com/ma/i/" + this.state.item.id
        JielongService.cancelJielong(jieLongId, url, {})
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({showLoading: false
                }, () =>{ window.location.reload()
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    generateVoucher = (jieLongId, item) => {
        let itemUrl = "https://www.showmine66.com/ma/i/" + item.id
        let params = {
            is_update: false,
            item_url: itemUrl,
            voucher_base_url: "https://www.showmine66.com/ma/jl/vci/VOUCHERID",
        }
        JielongService.generateVoucher(params, jieLongId)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    voucher: responseJson,
                    isLoading: false,
                }, () => {
                    window.location.reload()
                })
            })
            .catch((error) => {
                console.error(error)
            })
    }

    showHideConfirmDialog = () => {
        this.setState((prevState) => (
            {
                showConfirmDialog: !prevState.showConfirmDialog
            })
        )
    }

    updateIsEditingStatus = () => {
        this.state.callbackUpdateIsEditing()
    }

    render(){
        const { isParticipated, isEditing, isValidForm, isLoading, showConfirmDialog } = this.state
        const confirmClearButtons= {
            title: '取消报名',
            buttons: [
                {
                    type: 'default',
                    label: '再想想',
                    onClick: () => this.showHideConfirmDialog()
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: ()=>this.cancelJielong()
                }
            ]
        }

        if (isParticipated) {
            if (isEditing) {
                return (
                    <div style={styles.buttonGroupContainer}>
                        <div style={styles.buttonArea}>
                            <Btn onClick={()=>this.updateIsEditingStatus()} title='取消修改' loading={isLoading} />
                            <Btn onClick={()=>this.updateJielongComment()} disabled={!isValidForm} title='确认修改' loading={isLoading} />
                        </div>
                        <Dialog style={styles.dialog} type="ios" title={confirmClearButtons.title} buttons={confirmClearButtons.buttons} show={showConfirmDialog}>确定取消报名？</Dialog>
                    </div>
                )
            }
            else {
                return (
                    <div style={styles.buttonGroupContainer}>
                        <div style={styles.buttonArea}>
                            <Btn onClick={()=>this.showHideConfirmDialog()} title='取消报名' loading={isLoading} />
                            <Btn onClick={()=>this.updateIsEditingStatus()} title='修改报名' loading={isLoading} />
                        </div>
                        <Dialog style={styles.dialog} type="ios" title={confirmClearButtons.title} buttons={confirmClearButtons.buttons} show={showConfirmDialog}>确定取消报名？</Dialog>
                    </div>
                )
            }
        }
        else {
            return (
                <div style={ styles.buttonGroupContainer }>
                    <Btn onClick={()=>{ this.createJielongComment() }} disabled={ !isValidForm } title='立刻报名' loading={isLoading}/>
                </div>
            )
        }
    }
}

const styles = {
    buttonGroupContainer: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        color: '#fff',
        textAlign: 'center',
    },
    dialog: {
        color: Colors.fontColor
    },
    buttonArea: {
        display:'flex',
        flexDirection: 'row',
    }
}


export default RegistrationButtonArea
