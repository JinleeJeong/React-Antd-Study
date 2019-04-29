import React, { Component } from 'react';
import { Button, Form, Input, Icon, message } from 'antd';
import './login.css';
import axios from 'axios';
// import Cookies from 'js-cookie';
// console.log(Cookies.get(result.data.It_branches_id_br));
class login extends Component {
    constructor(props) {
      super(props);

    this.state = {
        loading: false,
            formFieldInput : {
                id : '',
                password: '',
            }    
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){

    }
    handleSubmit = (e) => {
        e.preventDefault();
        
        this.props.form.validateFields((err, values) => {
          if (!err) {
            var loginHeaders = {
                'Content-Type' : 'application/json',
                 'userId' : values.userId,
                  'userPw' :values.userPw
            }
                axios.post('')
                .then(result => {
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
            <div className = "login" style={{height : "100vh"}}>
                    <div style={{textAlign : "center"}} >
                        <div style={{position:"relative", top:"32vh", display: "inline-block", width : "40vh", height : "35vh", backgroundColor : "white", padding:"2.5vh"}}>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                    <div style ={{fontSize : "3vh", marginBottom :"2vh" }}>로그인</div>

                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('userId', {
                                rules: [{ required: true, message: 'Please input your Id!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="서버 관리자" />
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('userPw', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="관리자 비밀번호" />
                            )}
                            </Form.Item>
                            <Form.Item>
                        
                            <Button style={{width : "100%"}}type="primary" htmlType="submit" className="login-form-button" loading = {this.state.loading} onClick = {this.enterLoading}>
                                Log in

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
