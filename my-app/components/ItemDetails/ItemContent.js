import React, {Component} from 'react';
import Colors from "../../constants/Colors";

class ItemContent extends Component {
    constructor(props){
        super(props);
    }

    formatRawContent = (content => {
        return content.replace(/<img([^>]*)\ssrc=['"]([^"\s]+)['"]([^>]*)>/g, "<img width=\"100%\" src='$2'/>");
    });

    render(){
        const itemDetail = this.props.itemDetail ? this.props.itemDetail : undefined;
        const showDivider = !!this.props.showDivider
        const formattedContent = itemDetail && itemDetail.description ? this.formatRawContent(itemDetail.description) : '';
        if (itemDetail) {
            return (
              <div style={styles.contentWrapper}>
                  <div style={styles.productInfo}>
                      <div style={styles.dayCount}></div>
                      <div style={styles.visitTimes}>
                          访问次数<br/>{itemDetail.visit_times}
                      </div>
                  </div>
                  <div style={styles.descriptionWrapper}>
                      <h3>{itemDetail.title}</h3>
                      <div style={styles.descriptionBackground} dangerouslySetInnerHTML={{__html: formattedContent}}></div>
                  </div>
                  { showDivider ? <div style={Colors.style.bottomDivider}/> : null }
              </div>
            );
        }
        else return null;
    }
}

const styles = {
    contentWrapper: {
        backgroundColor: '#fff'
    },
    productInfo: {
        fontSize: '12px',
        display: 'flex',
        padding: ' 2vmin 4vmin',

        flex: '0.5'
    },
    dayCount: {
        flex: 1
    },
    visitTimes: {
        flex: 1,
        textAlign: 'end',
    },
    descriptionWrapper: {
        padding: '4vmin',
        paddingTop: 0,
    },
    descriptionBackground: {
        backgroundColor: '#fff'
    }

};

export default ItemContent;

