import React, { Component, Fragment } from 'react';
import {Doughnut} from 'react-chartjs-2';
import './main.css';
import {Layout, Menu, Icon, Breadcrumb, Popconfirm, message} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;

const data = {
	labels: [
		'메신저',
		'인터넷',
    '음악',
    '게임',

	],
	datasets: [{
		data: [300, 100, 200, 150],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
    '#FFCE56',
    '#C2EE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
    '#FFCE56',
    '#C2EE56'
		]
    }],
    text: '45'
};

const dataSecond = {
  labels: [
		'타 인강1',
		'타 인강2',
    '타 인강3',
    '타 인강4',
	],
	datasets: [{
		data: [300, 100, 200, 150],
		backgroundColor: [
		'#86A2EB',
    '#BFCE56',
    '#AE4384',
    '#F9FE56'
		],
		hoverBackgroundColor: [
		'#86A2EB',
    '#BFCE56',
    '#AE4384',
    '#F9FE56'
		]
    }],
    text: '45'
}
class main extends Component {
    
    constructor(props) {
      super(props);

      this.state = {
        collapsed: false,
        users : [],
        data : [],
        authority : ''
      };
    }
    

    componentDidMount(){
      this.setState({
        authority : this.props.author
      })
    };

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
      }

    // ============================= 로그아웃 
    confirmLogout = (e) =>{
      var author = { 'author' : this.state.authority}
      console.log(author);
      axios.post('http://localhost:8080/api/sp/logout', author)
            .then(res => console.log(res.data));

      message.success('로그아웃 성공했습니다.');

      setTimeout(() => {
        return this.props.history.push('/')
      }, 1000)

    };
    
    cancelLogout = (e) => {
      message.error('로그아웃 취소');
    }
    // ============================= 로그아웃


      render() {

        return (
            <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible 
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{maxHeight:"898px"}}>

                <Menu.Item key = "1" style= {{marginTop: '32%'}}>
                    <Icon type="pie-chart" /><span>대시보드</span>
                    <Link to = {`/main`}/>  
                </Menu.Item>  
                <SubMenu
                  key="sub2"
                  title={<span><Icon type="team" /><span>설정</span></span>}
                >
                  <Menu.Item key="2"><Link to = {`/prohibition`}/>사용금지 목록</Menu.Item>
                  <Menu.Item key="3"><Link to = {`/settingIngang`}/>타 인강 목록</Menu.Item>
                  <Menu.Item key="4"><Link to = {`/update`}/>앱 업데이트</Menu.Item>
                </SubMenu>

                <SubMenu
                  
                  key="sub1"
                  title={<span><Icon type="user" /><span>조회</span></span>}
                >
                  <Menu.Item key="5"><Link to = {`/app`}/>앱별 사용이력</Menu.Item>
                  <Menu.Item key="6"><Link to = {`/ingang`}/>인강별 사용이력</Menu.Item>
                  <Menu.Item key="7"><Link to = {`/student`}/>학생별 사용이력</Menu.Item>
                </SubMenu>

                <Menu.Item key = "8" onClick={this.logout} style={{position:"fixed", bottom:"5vh", width: "auto"}}>
                    <Icon type="logout"/>
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="확인" cancelText="취소">
                        <span>로그아웃&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> 
                        <Link to = {`/`}/>                  
                    </Popconfirm>

                  </Menu.Item>
              </Menu>
            </Sider>


            <Layout>
                <Header style={{ background: '#1DA57A', padding: 0 }}>
                    <Breadcrumb style={{ margin: '12px 0'}}>
                        <Breadcrumb.Item><h1 style={{color : 'white' , marginLeft : "3vh", fontWeight :"600", fontSize : "3.2vh"}}>대시보드</h1></Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
              <Content style={{ margin: '0 16px' }}>
          <Fragment>
            <div className = "main">
                <div style={{height: "80vh", width: "auto", display:"flex", margin : "0 20vh 0 0"}}>
                    <div style={{flex : "1", marginTop : "10vh", marginBottom : "10vh"}}>
                        <Doughnut 
                        data={data} 
                        // width={10}
                        // height={30}
                        options={{
                            legend : {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    fontSize: 19,
                                    fontColor: "black",
                                    fonrWeight : 800,
                                    fontFamily : "sans-serif",
                                    padding : 30
                                }
                            },
                            title : {
                                display : true,
                                text : "앱별 사용량 차트",
                                color : "black",
                                fontSize : 25,
                                position : "top",
                                padding : 30
                            },
                                responsive: true,
                                maintainAspectRatio: false,
                        }}/>
                    </div>
                        
                    <div style={{flex : "1.3", marginTop : "10vh", marginBottom : "10vh"}}>
                        <Doughnut                 
                            data={dataSecond} 
                            // width={30}
                            // height={30}
                            options={{
                            legend : {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    fontSize: 17,
                                    fontColor: "black",
                                    fonrWeight : 800,
                                    fontFamily : "sans-serif",
                                    padding : 30
                                }
                            },
                            title : {
                                display : true,
                                text : "타 인강별 사용량 차트",
                                color : "black",
                                fontSize : 25,
                                position : "top",
                                padding : 30
                            },
                                responsive: true,
                                maintainAspectRatio: false,

                            }}/>
                            
                    </div>
                </div>    
            </div>
          </Fragment>
          </Content>
            </Layout>
          </Layout>
        );
    }
}
    

export default main;
