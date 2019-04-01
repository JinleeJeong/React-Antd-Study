import React, { Component, Fragment } from 'react';
import {Layout, Icon} from 'antd';

const {Footer} = Layout;

class footer extends Component {
    render() {
        return (
            <Fragment>            
                <Footer style={{ textAlign: 'center', color :"white", backgroundColor : "#1DA57A", padding :"1.5vh", height: "5.6vh", marginLeft : "20vh"}}>
                    <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> TechNonia Design ©2019 Created by J <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                </Footer>
            </Fragment>
        );
    }
}

export default footer;