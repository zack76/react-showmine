import React from 'react';
import {Footer, FooterText, FooterLinks, FooterLink} from 'react-weui';

class SiteFooter extends React.Component {

    render(){
        const show = this.props.show !== false;
        if (show) {
            return (
                <div className="footer" title="Footer">
                    <Footer>
                        <FooterLinks>
                            <FooterLink href="https://www.showmine.com/">ShowMine首页</FooterLink>
                        </FooterLinks>
                        <FooterText>Copyright &copy; 2018-2019 ShowMine</FooterText>
                    </Footer>
                    <br/><br/>
                </div>
            );
        }
        else return null;
    }
}

export default SiteFooter;
