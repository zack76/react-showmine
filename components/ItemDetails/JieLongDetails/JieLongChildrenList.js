import React, {Component} from 'react';
import Colors from "../../../constants/Colors";
import UtilsService from '../../../service/UtilsService'

class JieLongChildrenList extends Component {

    render(){
        let imageSize = 'SMALL';
        const children = this.props.children ? this.props.children : undefined;
        if (children) {
            return children.map((child) => {
               const imageUrl = UtilsService.getItemImgUrlWithSize(child, imageSize);
                return (
                    <div key={child.id}>
                        <div key={child.id} style={styles.childContainer}>
                            <div style={styles.childrenImg}>
                                <img height={100} width={90} src={imageUrl}/>
                            </div>
                            <div style={styles.childrenContent}>
                                <p>{child.title}</p>
                                <p style={styles.childrenPrice}>${child.price}</p>
                                <span style={styles.childrenDesc}>报名总数
                                <strong>: {(child.participator_num !== null ? child.participator_num : 0)}</strong>
                            </span>
                                <span style={styles.childrenDesc}>已签到数
                                <strong>: {child.fav_count}</strong><br/>
                            </span>
                                <span style={styles.childrenDesc}>
                                取货地点:<br/>{child.locations[0].title}
                            </span>
                            </div>
                        </div>
                        <div style={Colors.style.bottomDivider}></div>
                    </div>
                )
            });
        }
        else {
            return null;
        }
    }
}

const styles = {
    childContainer: {
        display: 'flex',
        backgroundColor: '#fff',
        flexDirection: 'row',
        padding: '5vmin',
    },
    childrenImg: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    childrenContent: {
        marginLeft: '3vmin',
    },
    childrenPrice: {
        color: '#9f0000',
    },
    childrenDesc: {
        fontSize: '12px',
        color: 'gray',
        paddingRight: '10px',
    },
};

export default JieLongChildrenList;

