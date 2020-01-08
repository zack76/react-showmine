import React, {Component} from 'react';
import Colors from '../../../constants/Colors';
import { LoadMore } from 'react-weui';
import Link from 'next/link';
import moment from 'moment';
import $ from 'jquery';
import SubscribeBtn from '../../Common/SubscribeBtn'


class ArticleContent extends Component {
    get formatRawContent() {
        return this._formatRawContent;
    }
    constructor(props){
        super(props);
    }

    componentDidMount() {
      let component = this;
      let adImage = JSON.parse(component.props.articleDetail.company.config).defaultContact;
      $('img').click(function(event){
        const targetImage = event.target.src
        let urls = []
        let match = undefined
        const regex = /<img([^>]*)\ssrc=['"]([^"\s]+)['"]([^>]*)>/g
        while (match = regex.exec((component.props.articleDetail.description + adImage))) {
            urls.push(match[2]);
        }
        wx.previewImage({
            current: event.target.src, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        });
      })
    }

    _formatRawContent = (content => {
        return content.replace(/<img([^>]*)\ssrc=['"]([^"\s]+)['"]([^>]*)>/g, "<img width=\"100%\" src='$2' style=\"margin: 15px 0px -5px 0px\" />");
    });
    //redirect to author link
    handleClick(){
        const articleDetail = this.props.articleDetail ? this.props.articleDetail : undefined;
        const formattedConfig = articleDetail && articleDetail.config ? JSON.parse(articleDetail.config) : {};
        const authorLink = formattedConfig && formattedConfig.authorLinks ? formattedConfig.authorLinks : undefined;
        let url = authorLink.trim();
        if(url.substr(0,7).toLowerCase() == "http://" || url.substr(0,8).toLowerCase() == "https://")
        {
            url = url
        }
        else
        {
            url = "http://" + url
        }
        window.location.assign(url);
    }
    render(){
        const articleDetail = this.props.articleDetail ? this.props.articleDetail : undefined;
        const isLogin = this.props.isLogin ? this.props.isLogin : undefined;
        const formattedConfig = articleDetail && articleDetail.config ? JSON.parse(articleDetail.config) : {};
        const author = articleDetail.author && articleDetail.author > '' ? articleDetail.author : undefined;
        const writer = formattedConfig .writer && formattedConfig .writer > '' ? formattedConfig .writer : undefined;
        const formattedContent = articleDetail && articleDetail.description ? this._formatRawContent(articleDetail.description) : '';
        const localDateCreated = moment(moment.utc(articleDetail.date_publish)).local().format("YYYY-MM-DD HH:mm");
        const defaultContact = formattedConfig.ifShowCompanyContact && (JSON.parse(articleDetail.company.config).defaultContact) > '' ? JSON.parse(articleDetail.company.config).defaultContact : {};
        const formattedCompanyContact = formattedConfig.ifShowCompanyContact && (JSON.parse(articleDetail.company.config).defaultContact) > '' ? this._formatRawContent(defaultContact) : '';
        const authorLink = formattedConfig && formattedConfig.authorLinks ? formattedConfig.authorLinks : undefined;
    if (articleDetail) {
            return (
                <div style={styles.contentWrapper}>
                    <div style={styles.descriptionWrapper}>
                        <div className="row">
                        <h2 style={styles.articleTitle}>{articleDetail.title}</h2>
                        <div style={styles.subTitle} >
                            {author && authorLink ? (<div style={styles.author} onClick={this.handleClick.bind(this)}>{author}</div>):(<div style={styles.author}>{author}</div>)}
                            {writer ? (<div style={styles.writer}>{writer}</div>):null}
                            <div style={styles.productInfo}>
                                <div style={styles.publishDate}>{localDateCreated}</div>
                                <div style={styles.visitTime}>阅读 {articleDetail.visit_times}</div>
                            </div>
                            <SubscribeBtn item={articleDetail} company={articleDetail.company}/>
                        </div>
                        </div>
                        <div style={styles.descriptionBackground} className="article-desc" dangerouslySetInnerHTML={{__html: formattedContent}} />
                        <LoadMore showLine> The End </LoadMore>
                        <div style={styles.productInfo}>
                            <div style={styles.visitTimes}>阅读 {articleDetail.visit_times}</div>
                            <Link href={{ pathname: '/index', query: { companyId: articleDetail.company_id} }}>
                                <p>
                                    <span style={styles.footerCompanyName}>{articleDetail.company.name}</span>
                                </p>
                            </Link>
                        </div>
                        <div style={styles.descriptionBackground}dangerouslySetInnerHTML={{__html: formattedCompanyContact}} />
                    </div>
                </div>
            );
        }
        else return null;
    }
}

const styles = {
    contentWrapper: {
        backgroundColor: '#fff',
        color: Colors.fontColor,
        padding: '4vmin'
    },
    descriptionWrapper: {
    },
    articleTitle: {
        fontSize: '22px'
    },
    subTitle: {
        paddingTop: '2vw',
        paddingBottom: '2vw',
        fontSize: '14px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
    author: {
        cursor: 'pointer',
        color: Colors.fontColorLink,
        marginRight:'3vw'
    },
    companyName: {
        color: Colors.fontColorLink,
        paddingRight: '3vw'
    },
    footerCompanyName:{
        color: Colors.fontColorLink,
        paddingRight: '3vw',
        textAlign: 'end'
    },
    publishDate: {
        color: Colors.fontColorGray,
    },
    descriptionBackground: {
        backgroundColor: '#fff',
        // padding: '2.5vw',
        // paddingBottom: '0',
        lineHeight: '2',
        fontSize: 16
    },
    productInfo: {
        display: 'flex',
        color: Colors.fontColorGray,
        fontSize: '14px',
        flex: '0 0 100%',
    },
    visitTimes: {
        flex: 1,
        textAlign: 'start',
    },
    // writer: {
    //     flex: 3,
    //     textAlign: 'end'
    // }
    writer:{
        color: Colors.fontColorGray,
        paddingRight: '3vw',
    },
    visitTime:{
        flex: 1,
        textAlign: 'end'
    }

};

export default ArticleContent;
