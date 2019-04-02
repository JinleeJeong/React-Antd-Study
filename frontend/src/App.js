import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import student from './component/UIElements/student';
import app from './component/UIElements/app';
import login from './component/Login/login';
import ingang from './component/UIElements/ingang';
import main from './component/Main/main';
import Footer from './component/Static/footer';
import prohibition from './component/Setting/prohibition';
import settingIngang from './component/Setting/settingIngang';
import update from './component/Setting/update';
import {message} from 'antd';
// import Cookies from 'js-cookie';
// ----------------------------

class App extends Component {
  componentDidMount(){
    var cookie = document.cookie;
    console.log("admin :", cookie.includes("admin"));
    if(window.location.pathname !== '/'){
      if(cookie.length > 0 && cookie.includes("admin")){
      } else {
        message.error('세션이 만료되었습니다.');
      setTimeout(() => {
        window.location.href = "/";
      }, 1000)
      }
    }
  };
  render() {

    return (
      <BrowserRouter>
        <div className="App">
        
          
          <Route exact path ="/" component={login}/>
          
          <Route path = "/main" component ={main}/>

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
