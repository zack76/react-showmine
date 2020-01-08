import React, {Component} from 'react';
import {Button} from 'react-weui';
import {Config} from "../../../Config";
import Lang from "../../../lang/Lang";


class EditButton extends Component {
    constructor(props){
        super(props);
        this.state = {
            item: this.props.item,
        };
    }

    redirect(){
        let url = Config.showmineAngular.webAddress + Config.showmineAngular.itemDetails + this.state.item.id;
        window.open(url,"_self");
    }
    newRedirect(){
        let url = Config.showmineAdminPanel.webAddress;
        window.open(url + "a/tk?token=" +window.localStorage.userToken + "&&itemId=" + this.state.item.id , "_self");
    }

    render(){
        const item = this.state.item ? this.state.item : undefined;
        const show = this.props.show !== false;
        if (show) {
            return (
                <div style={styles.buttonWrapper}>
                    <div key={item.id + 'new'} style={styles.editButton}>
                        <Button
                            size='small'
                            onClick={()=>{this.newRedirect()}}
                            plain
                        >
                            {Lang.translate('EDIT.NEW')}
                        </Button>
                    </div>
                    <div key={item.id + 'old'} style={styles.editButton}>
                        <Button
                            size='small'
                            onClick={()=>{this.redirect()}}
                            plain
                        >
                            {Lang.translate('EDIT.OLD')}
                        </Button>
                    </div>
                </div>
            )
        }
        else return null;
    }
}

const styles = {
    editButton: {
        paddingTop: '2vw',
        // paddingLeft: '4vw',
        // paddingRight: '4vw',
    },
    buttonWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
    }

};

export default EditButton;

