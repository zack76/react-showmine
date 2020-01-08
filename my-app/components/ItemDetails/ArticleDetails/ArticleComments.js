import React, { Component } from "react";
import Colors from "../../../constants/Colors";
import ItemService from "../../../service/ItemService";
import "weui";
import "react-weui/build/packages/react-weui.css";
import {
    Button,
    Popup,
    Article,
    CellsTitle,
    Form,
    FormCell,
    CellBody,
    TextArea,
    Dialog,
    Toast
} from "react-weui/build/packages";
import UtilsService from "../../../service/UtilsService";
import { Config } from "../../../Config";
import AuthService from "../../../service/AuthService";
import Modal from "react-modal";
class ArticleComments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            item: this.props.item,
            defaultImage: "../../../static/assets/default_item.png",
            newComment: false,
            showDialog: false,
            dialog: {
                title: "确认删除此条留言？",
                buttons: [
                    {
                        type: "default",
                        label: "取消",
                        onClick: this.hideDialog.bind(this)
                    },
                    {
                        type: "warn",
                        label: "确认",
                        onClick: this.deleteComment.bind(this)
                    }
                ]
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.showToast = this.showToast.bind(this);
    }
    hideDialog() {
        this.setState({
            showDialog: false
        });
    }
    handleChange(e) {
        this.setState({ newComment: e.target.value });
    }
    deleteComment() {
        this.setState({ showLoading: true });
        this.hideDialog();
        let params = {
            item_url: "https://www.showmine66.com/ma/i/" + this.state.item.id
        };
        ItemService.updateItemNormalComment(this.state.targetComment, params)
            .then(response => response.json())
            .then(responseJson => {
                this.setState(
                    {
                        showLoading: false,
                        res: responseJson
                    },
                    () => {
                        this.showToast();
                    }
                );
                this.getItemNormalCommentList();
            })
            .catch(error => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.getItemNormalCommentList();
    }
    componentWillUnmount() {
        this.state.loadingTimer && clearTimeout(this.state.loadingTimer);
        this.state.toastTimer && clearTimeout(this.state.toastTimer);
        clearInterval(this.state.interval)

    }
    showToast() {
        this.setState({ showToast: true });

        this.state.toastTimer = setTimeout(() => {
            this.setState({ showToast: false });
        }, 1500);
    }
    getItemNormalCommentList = () => {
        let params = {};
        ItemService.getItemNormalCommentList(this.state.item.id, params)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    commentList: responseJson.data
                });
            })
            .catch(error => {
                console.error(error);
            });
    };
    postItemNormalComment = () => {
        this.setState({ disabled: true, showLoading: true });
        let params = {
            comments: this.state.newComment,
            item_url: "https://react.showmine66.com/itemDetails?itemId=" + this.state.item.id,
            is_broadcast: false,
            is_private: false,
            state_redirect_obj: {
                url: UtilsService.getWebAddress()
                // url: "http://localhost:3000",
            },
            wechat_auth_url:
                "http://localhost:8888/a/wu?domain=http%253A%252F%252Flocalhost%253A8888&origurl=http%253A%252F%252Flocalhost%253A8888%252Fma%252Fi%252Ff187861730fbfe9cf62b110013bcfc4d%252F%2523app-top"
        };
        ItemService.postItemNormalComment(this.state.item.id, params)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    res: responseJson,
                    newComment: false
                });
                this.state.loadingTimer = setTimeout(() => {
                    this.setState({ showLoading: false }, () => {
                        this.setState({ fullpage_show: false, disabled: false }, () => {
                            this.showToast();
                        });
                    });
                }, 1000);
                this.getItemNormalCommentList();
            })
            .catch(error => {
                console.error(error);
            });
    };
    weChatLogin() {
        let origUrl = window.location.href;
        let authUrl = Config.webAddress + "AuthPage";
        AuthService.wechatLogin(origUrl, authUrl, {})
            .then(response => response.json())
            .then(responseJson => {
                window.open(responseJson.auth_url, "_self");
            })
            .catch(error => {
                alert(error);
            });
    }

    getLoginStatus= () => {
        if(this.state.subscribeLoginLogId) {
            AuthService.checkLoginStatus(this.state.subscribeLoginLogId || null)
                .then(response => response.text())
                .then(resp => {
                    var res = JSON.parse(resp)
                    if (res.log && res.log.tmp_token && res.log.tmp_token.trim() !== '') {
                        this.setState({
                            loading: true
                        })
                        this.loginWithTempCode(res.log.tmp_token.trim())
                    }
                })
        }
    }

    loginWithTempCode = (tmpToken) => {
        AuthService.loginWithTempCode(tmpToken)
            .then(response => response.text())
            .then(resp => {
                var res = JSON.parse(resp)
                if (res.return_code){
                    localStorage.setItem('userToken', res.return_code);
                    localStorage.setItem('isLogIn', true);
                }
                let params ={};
                AuthService.getMe(params)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        localStorage.setItem('userObject', JSON.stringify(responseJson));
                    })
                    .then(() => {location.reload();
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
    }

    handleLogin =() => {
        let item = this.props.item
        if (UtilsService.openedInWeChat()) {
            this.weChatLogin()
        } else {
            let getLoginStatus = this.getLoginStatus
            var params = {
                companyId: item && item.company && item.company.id,
                itemId: item && item.id
            }
            AuthService.getLoginSubscribeQrCode(params)
                .then(response => response.text())
                .then(resp => {
                    var res = JSON.parse(resp)
                    let interval = setInterval(getLoginStatus,1000);
                    this.setState({
                        qrUrl: res.qrcode,
                        subscribeLoginLogId: res.subscribeLoginLogId,
                        showModal: true,
                        interval: interval
                    })
                })
        }
    }
    handleClick = () => {
        if (this.props.isLogin) {
            this.setState({ fullpage_show: true });
        } else {
            this.handleLogin()
        }
    };
    render() {
        const isAdmin = this.props.isAdmin ? this.props.isAdmin : false;
        const commentList = this.state.commentList;
        let commentListComponent = undefined;
        if (commentList && commentList.length > 0) {
            commentListComponent = commentList.map((comment, id) => {
                let user = comment.created_by;
                let imageUrl =
                    user.avatar_img && user.avatar_img > ""
                        ? user.avatar_img
                        : this.state.defaultImage;
                return (
                    <div key={id} style={styles.commentBody}>
                        <div style={styles.avatarWrapper}>
                            <img src={imageUrl} style={styles.avatar} />
                        </div>

                        <div style={styles.nameNComment}>
                            <p style={styles.name}>{user.nick_name}</p>
                            <p style={styles.commentText}>{comment.comments}</p>
                        </div>
                        {isAdmin ? (
                            <div>
                                <Button
                                    type="warn"
                                    size="small"
                                    onClick={e =>
                                        this.setState({
                                            showDialog: true,
                                            targetComment: comment.id
                                        })
                                    }
                                >
                                    删除
                                </Button>
                                <Dialog
                                    type="ios"
                                    title={this.state.dialog.title}
                                    buttons={this.state.dialog.buttons}
                                    show={this.state.showDialog}
                                >
                                    删除后无法撤回
                                </Dialog>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                );
            });
        }

        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
        };

        return (
            <div style={styles.commentWrapper}>
                <Toast icon="loading" show={this.state.showLoading}>
                    请稍后...
                </Toast>
                <Toast icon="success-no-circle" show={this.state.showToast}>
                    成功
                </Toast>
                {commentListComponent ? (
                    <div style={styles.commentHeader}>
                        <div>精选留言</div>
                        <div
                            style={{ color: Colors.fontColorLink }}
                            onClick={e => this.handleClick()}
                        >
                            写留言
                        </div>
                    </div>
                ) : (
                    <div style={styles.noCommentHint}>
                        <div
                            style={{ color: Colors.fontColorLink }}
                            onClick={e => this.handleClick()}
                        >
                            写留言
                        </div>
                    </div>
                )}
                <div style={styles.commentHeader}>
                    <Popup
                        show={this.state.fullpage_show}
                        onRequestClose={e => this.setState({ fullpage_show: false })}
                    >
                        <div style={{ height: "100vh", overflow: "scroll" }}>
                            <Article>
                                <Toast icon="loading" show={this.state.showLoading}>
                                    请稍后...
                                </Toast>
                                <CellsTitle style={{ marginTop: "40px" }}>新建留言</CellsTitle>
                                <Form style={{ marginBottom: "20px" }}>
                                    <FormCell>
                                        <CellBody>
                                            <TextArea
                                                placeholder="留言后将对所有人可见，最多50字"
                                                rows={3}
                                                maxLength={50}
                                                onChange={this.handleChange}
                                            ></TextArea>
                                        </CellBody>
                                    </FormCell>
                                </Form>
                                <Button
                                    type="primary"
                                    plain
                                    disabled={!this.state.newComment || this.state.disabled}
                                    onClick={e => this.postItemNormalComment()}
                                >
                                    发布留言
                                </Button>
                                <Button
                                    type="warn"
                                    onClick={e => this.setState({ fullpage_show: false })}
                                >
                                    取消
                                </Button>
                            </Article>
                        </div>
                    </Popup>
                </div>
                {commentListComponent}
                <Modal
                    isOpen={this.state.showModal}
                    // onAfterOpen={() => {this.getQrCode(item)}}
                    onRequestClose={()=>{this.setState({showModal: false})}}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div style={styles.qrTitle}>扫码关注该公司</div>
                    <div style={styles.qrTitle}><small>将更及时的收到推送</small></div>
                    <img style={styles.qrcode} src={this.state.qrUrl}/>
                </Modal>
                <Toast icon="success-no-circle" show={this.state.success}>Success</Toast>
                <Toast icon="loading" show={this.state.loading}>Loading...</Toast>
            </div>
        );
    }
}

const styles = {
    commentWrapper: {
        backgroundColor: Colors.formBackground,
        padding: "4vw",
        fontSize: "14px"
    },
    commentHeader: {
        color: Colors.formFontGray,
        paddingBottom: "20px",
        display: "flex",
        WebkitBoxPack: "justify",
        WebkitJustifyContent: "space-between",
        MsFlexPack: "justify",
        justifyContent: "space-between"
    },
    noCommentHint: {
        color: Colors.formFontGray,
        textAlign: "center",
        paddingBottom: "20px"
    },
    commentBody: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: "20px"
    },
    avatarWrapper: {
        flex: "1"
    },
    avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "4px"
    },
    nameNComment: {
        display: "flex",
        flexDirection: "column",
        flex: "10",
        paddingLeft: "3vw",
        lineHeight: "normal"
    },
    name: {
        color: Colors.formFontGray
    },
    commentText: {
        color: Colors.fontColor,
        paddingRight: "5vw"
    }
};

export default ArticleComments;
