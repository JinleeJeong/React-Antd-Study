import React, { Component, Fragment } from 'react';
import {Doughnut} from 'react-chartjs-2';
import './main.css';
import {Layout, Menu, Icon, Popconfirm, message, Button, DatePicker, Select, Spin} from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
var key = require("../../config/cry");
const crypto = require('crypto');
const ivBuffer = '';

const { Header, Content, Sider } = Layout;
const {SubMenu} = Menu;
const {RangePicker} = DatePicker;

const Option = Select.Option;

class main extends Component {
    
    constructor(props) {
      super(props);

      this.state = {
        dashboardAppData : [],
        dashboardAppLabel : [],
        dashboardIngangData : [],
        dashboardIngangLabel : [],
        chooseToday : 'primary',
        chooseWeek : 'default',
        chooseMonth : 'default',
        loading : false,
      };
      this.onOk = this.onOk.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }
  
    componentDidMount(){
      axios.get('http://localhost:8080/api/sp/dashboardapp')
      .then((res) => {
        var resultsArrayData = [];
        var resultsArrayLabel = [];
        if(decrypt(res.data.message) !== 'failed')  {
          for(var i = 0 ; i< res.data.dashboardapp.length; i++){
            resultsArrayData.push(
              res.data.dashboardapp[i].data,
            )
            resultsArrayLabel.push(
              decrypt(res.data.dashboardapp[i].labels)
            )
          }
          this.setState({
            dashboardAppData : resultsArrayData,
            dashboardAppLabel : resultsArrayLabel
          })
        }
        else {
          console.log("Not exist data")

          this.setState({
            dashboardAppData : [],
            dashboardAppLabel : []
          })
        }
      })

      axios.get('http://localhost:8080/api/sp/dashboardingang')
      .then((res) => {
        var resultsArrayIngangData = [];
        var resultsArrayIngangLabel = [];
        if(decrypt(res.data.message) !== 'failed') {
          for(var i = 0 ; i< res.data.dashboardingang.length; i++){
            resultsArrayIngangData.push(
              res.data.dashboardingang[i].data,
            )
            resultsArrayIngangLabel.push(
              decrypt(res.data.dashboardingang[i].labels)
            )
          }
          this.setState({
            dashboardIngangData : resultsArrayIngangData,
            dashboardIngangLabel : resultsArrayIngangLabel
          })
        }
        else {
          console.log("Not exist Data");
          this.setState({
            dashboardIngangData : [],
            dashboardIngangLabel : []
          })
        }
      })
    };

    // ============================= 로그아웃 
    confirmLogout = (e) =>{
      var userSession;
      userSession = {
        userName : sessionStorage.getItem('a09u940au509234u@3o30au509234u@3o3==a09u940au509234u@3o3==320i230so#232ltatw54324sd##@$)#($@12')
      }
        axios.post('http://localhost:8080/api/sp/logout', userSession)
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
      this.setState({
        loading : true,
      })
      var startChoose = value[0];
      var endChoose = value[1];
      startChoose = new Date(startChoose).toISOString().slice(0, 19)
      endChoose = new Date(endChoose).toISOString().slice(0, 19)
      var requestTime = {
        'Content-Type' : 'application/json',
        'startChoose' : startChoose,
        'endChoose' : endChoose
      }
    
      axios.post('http://localhost:8080/api/sp/dashboardappdate', {withCredentials: true}, {headers : requestTime})
      .then((res) => {
        var resultsArrayData = [];
        var resultsArrayLabel = [];
        if(decrypt(res.data.message) !== 'failed'){
          for(var i = 0 ; i < 5 ; i++){
            resultsArrayData.push(
              res.data.dateAppUsage[i].data,
            )
            resultsArrayLabel.push(
              decrypt(res.data.dateAppUsage[i].labels)
            )
          }
          this.setState({
            dashboardAppData : resultsArrayData,
            dashboardAppLabel : resultsArrayLabel,
          })
        }
        else {
          console.log("Not Exist Today app Data");
          this.setState({
            dashboardAppData : [],
            dashboardAppLabel : []
          })
        }
      })

      axios.post('http://localhost:8080/api/sp/dashboardingangdate', {withCredentials: true}, {headers : requestTime})
      .then((res) => {
        var resultsArrayData = [];
        var resultsArrayLabel = [];
        if(decrypt(res.data.message) !== 'failed'){
          for(var i = 0 ; i < res.data.dateIngangUsage.length ; i++){
            resultsArrayData.push(
              res.data.dateIngangUsage[i].data,
            )
            resultsArrayLabel.push(
              decrypt(res.data.dateIngangUsage[i].labels)
            )
          }
          this.setState({
            dashboardIngangData : resultsArrayData,
            dashboardIngangLabel : resultsArrayLabel,
            loading : false,
          })
        }
        else {
          console.log("Not Exist Today app Data");
          this.setState({
            dashboardIngangData : [],
            dashboardIngangLabel : [],
            loading : false,
          })
        }
      })
}
    // ============================= DatePicker

    // ============================= Select Fc
    handleChange = (value) => {
      console.log(`selected ${value}`);
    }
    // ============================= Select Fc

    // ====================================================Today====================================================
    clickToday = () => {
      console.log("Today");
      this.setState({
        chooseToday : 'primary',
        chooseWeek : 'default',
        chooseMonth : 'default',
        loading : true,

      })
      axios.get('http://localhost:8080/api/sp/dashboardapp')
      .then((res) => {
        var resultsArrayData = [];
        var resultsArrayLabel = [];
        if(decrypt(res.data.message) !== 'failed'){
          for(var i = 0 ; i< res.data.dashboardapp.length; i++){
            resultsArrayData.push(
              res.data.dashboardapp[i].data,
            )
            resultsArrayLabel.push(
              decrypt(res.data.dashboardapp[i].labels)
            )
          }
          this.setState({
            dashboardAppData : resultsArrayData,
            dashboardAppLabel : resultsArrayLabel
          })
        }
        else {
          console.log("Not Exist Today app Data");
          this.setState({
            dashboardAppData : [],
            dashboardAppLabel : []
          })
        }
      })

      axios.get('http://localhost:8080/api/sp/dashboardingang')
      .then((res) => {
        var resultsArrayIngangData = [];
        var resultsArrayIngangLabel = [];
        if(decrypt(res.data.message) !== 'failed'){
          
          for(var i = 0 ; i< res.data.dashboardingang.length; i++){
            resultsArrayIngangData.push(
              res.data.dashboardingang[i].data,
            )
            resultsArrayIngangLabel.push(
              decrypt(res.data.dashboardingang[i].labels)
            )
          }
          this.setState({
            dashboardIngangData : resultsArrayIngangData,
            dashboardIngangLabel : resultsArrayIngangLabel,
            loading : false,
          })
        }
        else {
          console.log("Not Exist Today ingang Data");
          this.setState({
            dashboardIngangData : [],
            dashboardIngangLabel : [],
            loading : false,
          })
        }
      })
    }

    // ====================================================Week====================================================
    clickWeek = () => {

      const date = {
        date : 'week'
      };
      console.log("Week");

      this.setState({
        chooseToday : 'default',
        chooseWeek : 'primary',
        chooseMonth : 'default',
        loading : true,
      })
      axios.post('http://localhost:8080/api/sp/dashboardapp', date)
      .then((res) => {
        var resultsArrayData = [];
        var resultsArrayLabel = [];
        if(decrypt(res.data.message) !== 'failed') {
          for(var i = 0 ; i< res.data.dashboardapp.length; i++){
            resultsArrayData.push(
              res.data.dashboardapp[i].data,
            )
            resultsArrayLabel.push(
              decrypt(res.data.dashboardapp[i].labels)
            )
          }
          this.setState({
            dashboardAppData : resultsArrayData,
            dashboardAppLabel : resultsArrayLabel
          })
        }
        else {
          console.log("Not Exist Week app Data");
          this.setState({
            dashboardAppData : [],
            dashboardAppLabel : []
          })
        }
        
      })

      axios.post('http://localhost:8080/api/sp/dashboardingang', date)
      .then((res) => {
        var resultsArrayIngangData = [];
        var resultsArrayIngangLabel = [];
        if(decrypt(res.data.message) !== 'failed') {
          for(var i = 0 ; i< res.data.dashboardingang.length; i++){
            resultsArrayIngangData.push(
              res.data.dashboardingang[i].data,
            )
            resultsArrayIngangLabel.push(
              decrypt(res.data.dashboardingang[i].labels)
            )
          }
          this.setState({
            dashboardIngangData : resultsArrayIngangData,
            dashboardIngangLabel : resultsArrayIngangLabel,
            loading : false,
          })
        }
        else {
          console.log("Not Exist Week ingang Data");
          this.setState({
            dashboardIngangData : [],
            dashboardIngangLabel : [],
            loading : false,
            
          })
        }
        
      })
    }

    // ====================================================Month====================================================
    clickMonth = () => {

      const date = {
        date : 'month'
      };
      console.log("Month");
      this.setState({
        chooseToday : 'default',
        chooseWeek : 'default',
        chooseMonth : 'primary',
        loading : true,
      })
      axios.post('http://localhost:8080/api/sp/dashboardapp', date)
      .then((res) => {
        var resultsArrayData = [];
        var resultsArrayLabel = [];
        if(decrypt(res.data.message) !== 'failed') {
          for(var i = 0 ; i< res.data.dashboardapp.length; i++){
            resultsArrayData.push(
              res.data.dashboardapp[i].data,
            )
            resultsArrayLabel.push(
              decrypt(res.data.dashboardapp[i].labels)
            )
          }
          this.setState({
            dashboardAppData : resultsArrayData,
            dashboardAppLabel : resultsArrayLabel
          })
        }
        else {
          console.log("Not Exist Month app Data");
          this.setState({
            dashboardAppData : [],
            dashboardAppLabel : []
          })
        }
        
      })

      axios.post('http://localhost:8080/api/sp/dashboardingang', date)
      .then((res) => {
        var resultsArrayIngangData = [];
        var resultsArrayIngangLabel = [];
        if(decrypt(res.data.message) !== 'failed') {
          for(var i = 0 ; i< res.data.dashboardingang.length; i++){
            resultsArrayIngangData.push(
              res.data.dashboardingang[i].data,
            )
            resultsArrayIngangLabel.push(
              decrypt(res.data.dashboardingang[i].labels)
            )
          }
          this.setState({
            dashboardIngangData : resultsArrayIngangData,
            dashboardIngangLabel : resultsArrayIngangLabel,
            loading : false,
          })
        }
        else {
          console.log("Not Exist Month ingang Data");
          this.setState({
            dashboardIngangData : [],
            dashboardIngangLabel : [],
            loading : false,
          })
        }
        
      })
    }


      render() {
        const {dashboardAppData, dashboardAppLabel, dashboardIngangData, dashboardIngangLabel} = this.state;
        const data = {
          labels: dashboardAppLabel,
          datasets: [{
            data: dashboardAppData,
            backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFE4C4',
            '#00FFFF',
            '#BDB76B',

            ],
            hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFE4C4',
            '#00FFFF',
            '#BDB76B',

            ]
            }],
            text: '45'
        };
        const dataSecond = {
          labels: dashboardIngangLabel,
          datasets: [{
            data: dashboardIngangData,
            backgroundColor: [
            '#86A2EB',
            '#FFFF00',
            '#00FF00',
            '#663399',
            '#FF6347'
            ],
            hoverBackgroundColor: [
            '#86A2EB',
            '#FFFF00',
            '#00FF00',
            '#663399',
            '#FF6347'
            ]
            }],
            text: '45'
        };
        console.log(dashboardIngangData)
        console.log(dashboardIngangLabel)

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
                  <Button onClick={this.clickToday} type={this.state.chooseToday} style={{marginLeft : 32, width : 50, paddingLeft : 10}}>오늘</Button>
                  <Button onClick={this.clickWeek} type={this.state.chooseWeek} style={{marginLeft : 10, width : 78, paddingLeft : 10}}>최근 7일</Button>
                  <Button onClick={this.clickMonth} type={this.state.chooseMonth} style={{marginLeft : 10, width : 78, paddingLeft : 8}}>최근 30일</Button>
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
                
                    <div style={{flex : "1", marginTop : 20, marginBottom : "5vh", paddingLeft : 100}}>
                        <Doughnut 
                        data={data}
                        width={250}
                        height={200} 
                        options={{
                            legend : {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontSize: 15,
                                    fontColor: "black",
                                    fonrWeight : 800,
                                    fontFamily : "sans-serif",
                                    padding : 20
                                }
                            },
                            title : {
                                display : true,
                                text : "앱별 사용량 차트",
                                color : "black",
                                fontSize : 25,
                                position : "top",
                                padding : 10
                            },
                                responsive: true,
                                maintainAspectRatio: false,
                        }}/>
                    </div>
                        
                    <div style={{flex : "1", marginTop : 20, marginBottom : "5vh", marginRight :400}}>
                        <Doughnut                 
                            data={dataSecond} 
                            width={250}
                            height={200}
                            options={{
                            legend : {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontSize: 15,
                                    fontColor: "black",
                                    fonrWeight : 800,
                                    fontFamily : "sans-serif",
                                    padding : 20
                                }
                            },
                            title : {
                                display : true,
                                text : "타 인강별 사용량 차트",
                                color : "black",
                                fontSize : 25,
                                position : "top",
                                padding : 10
                            },
                                responsive: true,
                                maintainAspectRatio: false,
                            }}/>
                            
                    </div>
                </div>    
            </div>

            <div style={{textAlign : "center", height: 10}}>
              <Spin spinning={this.state.loading} style={{fontSize : 15}}></Spin>
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
                
                    <div style={{flex : "1", marginTop : 20, marginBottom : "5vh", paddingLeft : 100}}>
                        <Doughnut 
                        data={data}
                        width={250}
                        height={200} 
                        options={{
                            legend : {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontSize: 15,
                                    fontColor: "black",
                                    fonrWeight : 800,
                                    fontFamily : "sans-serif",
                                    padding : 20
                                }
                            },
                            title : {
                                display : true,
                                text : "앱별 사용량 차트",
                                color : "black",
                                fontSize : 25,
                                position : "top",
                                padding : 10
                            },
                                responsive: true,
                                maintainAspectRatio: false,
                        }}/>
                    </div>
                        
                    <div style={{flex : "1", marginTop : 20, marginBottom : "5vh", marginRight :400}}>
                        <Doughnut                 
                            data={dataSecond} 
                            width={250}
                            height={200}
                            options={{
                            legend : {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontSize: 15,
                                    fontColor: "black",
                                    fonrWeight : 800,
                                    fontFamily : "sans-serif",
                                    padding : 20
                                }
                            },
                            title : {
                                display : true,
                                text : "타 인강별 사용량 차트",
                                color : "black",
                                fontSize : 25,
                                position : "top",
                                padding : 10
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
