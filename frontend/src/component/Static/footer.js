import React, { Component, Fragment } from 'react';
import {Layout} from 'antd';

const {Footer} = Layout;

class footer extends Component {
    render() {
        return (
            <Fragment>            
                <Footer style={{ textAlign: 'center', color :"white", backgroundColor : "#1DA57A", padding :"1.5vh", height: "5.6vh", marginLeft : "20vh"}}>
                    TechNonia Design ©2018 Created by J
                </Footer>
            </Fragment>
        );
    }
}

export default footer;