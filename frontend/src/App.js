import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import board from './component/UIElements/board';
import app from './component/UIElements/app';
import login from './component/Login/login';
import ingang from './component/UIElements/ingang';
import main from './component/Main/main';
import Footer from './component/Static/footer';
// import prohibition from './component/Setting/prohibition';
// import settingIngang from './component/Setting/settingIngang';
// import update from './component/Setting/update';
// import Calendar from './calendar'
// Don't forget to include the CSS styles for antd!
// ----------------------------

class App extends Component {
  
  render() {

    return (
      <BrowserRouter>
        <div className="App">
        
          
          <Route exact path ="/" component={login}/>
          
          <Route path = "/main" component ={main}/>

          {/* <Route path = "/prohibition" component = {prohibition}/>
          <Route path = "/settingIngang" component = {settingIngang}/>
          <Route path = "/update" component = {update}/> */}

          <Route path = "/board" component={board} />
          <Route path = "/app" component={app}/>
          <Route path = "/ingang" component={ingang}/>

          {window.location.pathname !== '/' ? <Footer/> : ''}
          
        </div>
      </BrowserRouter>
    );
    
  }
}

export default App;
