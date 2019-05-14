import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import Student from './component/UIElements/student';
import Apps from './component/UIElements/app';
import Login from './component/Login/login';
import Ingang from './component/UIElements/ingang';
import Main from './component/Main/main';
import Prohibition from './component/Setting/prohibition';
import Update from './component/Setting/update';
import { message } from 'antd';
var api = require('./config/apiUrl');

// Don't forget to include the CSS styles for antd!
// ----------------------------
var ApiUrl = api.apiUrl;

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
        return
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

          <Route exact path ="/" component={(props) => (<Login url ={ApiUrl} {...props} />)} />
          <Route path = "/main" component = {(props) => (<Main url ={ApiUrl} {...props} />)} />
          <Route path = "/prohibition" component = {(props) => (<Prohibition url ={ApiUrl} {...props} />)} />
          <Route path = "/update" component = {(props) => (<Update url ={ApiUrl} {...props} />)} />

          <Route path = "/student" component = {(props) => (<Student url ={ApiUrl} {...props} />)} />
          <Route path = "/app" component = {(props) => (<Apps url ={ApiUrl} {...props} />)} />
          <Route path = "/ingang" component = {(props) => (<Ingang url ={ApiUrl} {...props} />)} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
