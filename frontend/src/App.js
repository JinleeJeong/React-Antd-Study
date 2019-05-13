import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import student from './component/UIElements/student';
import app from './component/UIElements/app';
import login from './component/Login/login';
import ingang from './component/UIElements/ingang';
import main from './component/Main/main';
import prohibition from './component/Setting/prohibition';
import settingIngang from './component/Setting/settingIngang';
import update from './component/Setting/update';
import { message } from 'antd';

// import Cookies from 'js-cookie';
// Don't forget to include the CSS styles for antd
// ----------------------------

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount(){
    var userSession;
    userSession = sessionStorage.getItem('')
    if(window.location.pathname !== '/'){
      if(userSession !== null){
        console.log("Success")
      }
      else {
        message.warning("다시 로그인 하세요.")
        setTimeout(() => {
          window.location.assign('/');
        }, 1500)

        
      }
  }
    else {
      console.log("Login");
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
        
          
          <Route exact path ="/" component={login}/>
          
          <Route path = "/main" component = {main} />

          <Route path = "/prohibition" component = {prohibition}/>
          <Route path = "/settingIngang" component = {settingIngang}/>
          <Route path = "/update" component = {update}/>

          <Route path = "/student" component={student} />
          <Route path = "/app" component={app}/>
          <Route path = "/ingang" component={ingang}/>
        </div>
      </BrowserRouter>
    );
    
  }
}

export default App;
