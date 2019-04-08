import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import student from './component/UIElements/student';
import app from './component/UIElements/app';
import login from './component/Login/login';
import ingang from './component/UIElements/ingang';
import Main from './component/Main/main';
import Footer from './component/Static/footer';
import prohibition from './component/Setting/prohibition';
import settingIngang from './component/Setting/settingIngang';
import update from './component/Setting/update';
import {message} from 'antd';
import axios from 'axios';
// import Cookies from 'js-cookie';
// ----------------------------

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authority : '',
      authorityLogin : ''
    }
  }
  componentDidMount(){
    console.log(this.state.authorityLogin);
    axios.get('http://localhost:8080/api/sp/check')
      .then(res => {
        if(window.location.pathname !== '/'){
          if(res.data.userName.length > 0 ){
            this.setState({
              authority : res.data.userName
            }, () => {
              var author = { 'author' : this.state.authority}
              console.log(author);
              
            })
          }
          else {
            message.error('세션이 만료되었습니다.');
            setTimeout(() => {
              window.location.href = "/";
            }, 1000)
          }
            
          console.log(res.data);
          
        }
    });
  };

      // if(res.data.confirm !== "success!!"){
    //   console.log("failed");
    //   message.error('세션이 만료되었습니다.');   
    //   setTimeout(() => {
    //     window.location.href = "/";
    //   }, 1000)
    // }
  render() {
    var authority = this.state.authority
    return (
      <BrowserRouter>
        <div className="App">
        
          
          <Route exact path ="/" component={login}/>
          
          <Route path = "/main:author" component = {(props) => (<Main author = {authority} {...props} />)} />

          <Route path = "/prohibition" component = {prohibition}/>
          <Route path = "/settingIngang" component = {settingIngang}/>
          <Route path = "/update" component = {update}/>

          <Route path = "/student" component={student} />
          <Route path = "/app" component={app}/>
          <Route path = "/ingang" component={ingang}/>

          {window.location.pathname !== '/' ? <Footer/> : ''}
          
        </div>
      </BrowserRouter>
    );
    
  }
}

export default App;
