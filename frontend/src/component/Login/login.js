import React, { Component } from 'react';
import { Button, Form, Input, Icon, message } from 'antd';
import axios from 'axios';
import loginImage from '../Image/loginPage.PNG';

class login extends Component {
    constructor(props) {
      super(props);


    this.state = {
        loading: false,
            formFieldInput : {
                id : '',
                password: '',
            },
        ApiUrl : '',    
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {ApiUrl} = this.state
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var loginHeaders = {
                'Content-Type' : 'application/json',
                'userId' : values.userId,
                'userPw' : values.userPw
            }
                axios.post(ApiUrl+'/api/sp/login', {withCredentials: true}, {headers : loginHeaders})
                .then(result => {
                    console.log(result.data);
                    if(result.data.message !== 'failed') {
                        var messageResult = result.data.userName.concat(" : success")
                        message.success(messageResult);
                        sessionStorage.setItem('', result.data.userName)
                        setTimeout(() => {
                            this.props.history.push(`/main`)
                            return window.location.reload();
                          }, 1000)
                    } else {
                        message.error('사용자 정보를 확인해주세요.');
                        this.setState({loading : false});
                    }
                })
        }
        else {
            message.error('사용자 정보를 확인해주세요.');
            this.setState({loading : false});
            }
        });
    };
    
    enterLoading = () => {
        this.setState({loading : true});
    }
      render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className = "login">
                    <div style={{textAlign : "center", height : "100vh"}}>
                   
                    <div style={{height: "30%", paddingTop : "20vh", marginRight : 15}}>
                        <img src ={loginImage} alt = "login" width = "150px" height ="auto" ></img>
                    </div>
                        <div style={{display: "inline-block", width : "40vh", height : "30vh", backgroundColor : "white", padding:"6vh 8vh 8vh 8vh", border : "1px solid silver"}}>
                       
                            <Form onSubmit={this.handleSubmit} className="login-form">
                            
                            <Form.Item style={{marginBottom:0, marginTop : "1vh"}}>
                            {getFieldDecorator('userId', {
                                rules: [{ required: true, message: 'Please input your Id!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />} placeholder="서버 관리자" />
                            )}
                            </Form.Item>
                            <Form.Item style={{marginBottom:10}}>
                            {getFieldDecorator('userPw', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="관리자 비밀번호" />
                            )}
                            </Form.Item>
                            <Form.Item>
                        
                            <Button style={{width : "100%"}}type="primary" htmlType="submit" className="login-form-button" loading = {this.state.loading} onClick = {this.enterLoading}>
                                로그인

                            </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
};
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(login);

export default WrappedNormalLoginForm;
