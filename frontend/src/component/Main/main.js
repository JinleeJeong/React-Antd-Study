import React, { Component, Fragment } from 'react';
import {Doughnut} from 'react-chartjs-2';
import './main.css';
import {Layout, Menu, Icon, Popconfirm, message, Button, DatePicker, Select} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;
const {RangePicker} = DatePicker;

const data = {
	labels: [
		'메신저',
		'인터넷',

	],
	datasets: [{
		data: [300, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		]
    }],
    text: '45'
};

const dataSecond = {
  labels: [
		'타 인강1',
		'타 인강2',
	],
	datasets: [{
		data: [300, 100],
		backgroundColor: [
		'#86A2EB',
    '#BFCE56',
		],
		hoverBackgroundColor: [
		'#86A2EB',
    '#BFCE56',
		]
    }],
    text: '45'
}
const Option = Select.Option;

class main extends Component {
    
    constructor(props) {
      super(props);

      this.state = {
        users : [],
        startTime: '',
        endTime: '',
        startEndTime : [],
      };
      this.onOk = this.onOk.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
      this.setState({

      })
    };

    // ============================= 로그아웃 
    confirmLogout = (e) =>{
      var userSession;
      userSession = {
        userName : sessionStorage.getItem('a09u940au509234u@3o30au509234u@3o3==a09u940au509234u@3o3==320i230so#232ltatw54324sd##@$)#($@12')
      }
        axios.post('http://ec2-54-180-81-120.ap-northeast-2.compute.amazonaws.com:8080/api/sp/logout', userSession)
          .then((res) => {
            console.log(res.data)
            message.success('로그아웃 성공했습니다.');
            sessionStorage.removeItem('a09u940au509234u@3o30au509234u@3o3==a09u940au509234u@3o3==320i230so#232ltatw54324sd##@$)#($@12')
            setTimeout(() => {
              return this.props.history.push('/')
            }, 1000)
        });
    };
    
    cancelLogout = (e) => {
      message.error('로그아웃 취소');
    }
    // ============================= 로그아웃

    // ============================= DatePicker
    onChangePicker = (pagination, filters, sorter) => {
      console.log('params', pagination, filters, sorter);
    }

    onOk = (value) => {
      var a = new Date(value[0]).getTime();
      var b = new Date(value[1]).getTime();
      // getTime Function : Date > milliseconds
      if(a!== b){
      const {startEndTime, users} = this.state
      
      this.setState({
        startTime : value[0],
        endTime : value[1]
      }, function() {
        var firstDate = moment(this.state.startTime._d, 'YYYY/M/D HH:mm')
        var finishDate = moment(this.state.endTime._d, 'YYYY/M/D HH:mm')
        var dates = [];
        firstDate = firstDate.format('YYYY/M/D HH:mm');
        finishDate = finishDate.format('YYYY/M/D HH:mm');
        dates.push(firstDate);
        dates.push(finishDate);
        this.setState({
          startEndTime : dates,
        }, () => {
          console.log(startEndTime);
        })
            // ------------------------------------------------startEndTime setState

        var userTimesSet = [];
        var sortingNumbers = [];
        var sortingNumbersNon = [];
          
          for(let i = 0; i < users.length ; i++){
            userTimesSet = (users.map(users => users.startTime));
          }
          this.setState({
            userTimes : userTimesSet,
          }, () => 
                  {
                    for( let i = 0 ;i < users.length ; i++){
                      
                      userTimesSet[i] = moment(userTimesSet[i]).format('YYYY/MM/DD HH:mm');
                      if(moment(userTimesSet[i]).isSameOrAfter(firstDate)){
                        if(moment(userTimesSet[i]).isSameOrBefore(finishDate)){
                          sortingNumbers.push(userTimesSet[i]);
                        } 
                        else{
                          sortingNumbersNon.push(userTimesSet[i]);
                          console.log('not Before')
                        }
                      }
                      else {
                        sortingNumbersNon.push(userTimesSet[i]);
                        console.log('not After')
                      }
                    }

                    this.setState({
                      sortingNumbers : sortingNumbers,
                      sortingNumbersNon : sortingNumbersNon
                    }, () => { 
                      const { users, sortingNumbers, sortingNumbersNon } = this.state
                      console.log('SortingNumbers : ' + sortingNumbers );
                      console.log('SortingNumbersNon : ' + sortingNumbersNon );
                      function arrFilter(users) {
                        for(let i = 0; i < sortingNumbers.length; i++){
                          if(users.startTime === sortingNumbers[i]){
                            return true;
                          }
                        }
                        return false;
                      }

                      var sortingDates = users.filter(arrFilter);
                      this.setState({
                        users : sortingDates
                      })
                    }
                  )
                })
              });
              
            }
      else (
        alert('시간을 확인해주세요.')
      )
}
    // ============================= DatePicker

    // ============================= Select Fc
    handleChange = (value) => {
      console.log(`selected ${value}`);
    }
    // ============================= Select Fc
      render() {

        return (
            <Layout style={{ minHeight: '100vh' }}>
            <Sider>
              <div className="App-logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{height:"100%"}}>

              <Menu.Item key = "9" style= {{backgroundColor : "#28948D", margin : 0, height : "53px"}}>
              </Menu.Item>
                <Menu.Item key = "1" style= {{marginTop : 0, paddingTop : "12px", height : "57px"}}>
                    <Icon type="pie-chart" /><span style={{fontColor : "white"}}>대시보드</span>
                    <Link to = {`/main`}/>  
                </Menu.Item>  
                <SubMenu
                  key="sub2"
                  style={{marginTop : "13px"}}
                  title={<span><Icon type="setting" /><span style={{fontColor : "white"}}>설정</span></span>}
                >
                  <Menu.Item key="2"><Link to = {`/prohibition`}/>사용금지 목록</Menu.Item>
                  <Menu.Item key="3"><Link to = {`/settingIngang`}/>타 인강 목록</Menu.Item>
                  <Menu.Item key="4"><Link to = {`/update`}/>앱 업데이트</Menu.Item>
                </SubMenu>

                <SubMenu
                  
                  key="sub1"
                  title={<span><Icon type="file-search" /><span>조회</span></span>}
                  style={{marginTop : "13px"}}
                >
                  <Menu.Item key="5"><Link to = {`/app`}/>앱별 사용이력</Menu.Item>
                  <Menu.Item key="6"><Link to = {`/ingang`}/>인강별 사용이력</Menu.Item>
                  <Menu.Item key="7"><Link to = {`/student`}/>학생별 사용이력</Menu.Item>
                </SubMenu>

                <Menu.Item key = "8" onClick={this.logout} style={{position:"relative", top:"71.5%", marginBottom: 0}}>
                    <Icon type="logout"/>
                    
                    <Popconfirm title = "로그아웃 하시겠습니까?" onConfirm={this.confirmLogout} onCancel={this.cancelLogout} okText="확인" cancelText="취소">
                        <span>로그아웃</span> 
                        <Link to = {`/`}/>                  
                    </Popconfirm>

                  </Menu.Item>
              </Menu>
            </Sider>

            <Layout>
                <Header style={{ background: '#28948D', padding: 0, height : "52px" }}>
                </Header>
              <Content style={{ margin: '0 16px' }}>
          <Fragment>
            <div style={{background: '#fff',margin : 32}}>
              <div style={{height: "7vh"}}>
                <div style={{paddingTop : 32}}>
                  <Button type="primary" style={{marginLeft : 32, width : 50, paddingLeft : 10}}>오늘</Button>
                  <Button type="default" style={{marginLeft : 10, width : 78, paddingLeft : 10}}>최근 7일</Button>
                  <Button type="default" style={{marginLeft : 10, width : 78, paddingLeft : 8}}>최근 30일</Button>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['날짜 선택', '날짜 선택']}
                    onChange={this.onChangePicker}
                    onOk={this.onOk}
                    style={{marginLeft : 10}}
                  />
                </div>
              </div>
                <div style={{height: "35vh", width: "auto", display:"flex"}}>
                
                    <div style={{flex : "1", marginTop : 0, marginBottom : "5vh", paddingLeft : 200}}>
                        <Doughnut 
                        data={data}
                        width={250}
                        height={200} 
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
                        
                    <div style={{flex : "1", marginTop : 0, marginBottom : "5vh", marginRight :400}}>
                        <Doughnut                 
                            data={dataSecond} 
                            width={100}
                            height={50}
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
            <div style={{background: '#fff',margin : 32}}>
              <div style={{height: "7vh"}}>
                <div style={{paddingTop : 32}}>
                <Select defaultValue="강남" style={{marginLeft : 32, width: 108 }} onChange={this.handleChange}>
                  <Option value="강북">강북</Option>
                  <Option value="목동">목동</Option>
                  <Option value="분당">분당</Option>
                  <Option value="평촌">평촌</Option>
                  <Option value="일산">일산</Option>
                  <Option value="부천">부천</Option>

                </Select>
                </div>
              </div>
                <div style={{height: "35vh", width: "auto", display:"flex"}}>
                
                    <div style={{flex : "1", marginTop : 0, marginBottom : "5vh", paddingLeft : 200}}>
                        <Doughnut 
                        data={data}
                        width={250}
                        height={200} 
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
                        
                    <div style={{flex : "1", marginTop : 0, marginBottom : "5vh", marginRight :400}}>
                        <Doughnut                 
                            data={dataSecond} 
                            width={100}
                            height={50}
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
