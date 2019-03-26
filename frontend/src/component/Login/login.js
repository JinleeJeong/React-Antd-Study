import React, { Component } from 'react';
import { Button, Form, Input, Icon, message } from 'antd';
// import axios from 'axios';
import './login.css';
import axios from 'axios';

class login extends Component {
    constructor(props) {
      super(props);

    this.state = {
            formFieldInput : {
                id : '',
                password: '',
            }    
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
          axios.get('http://localhost:8080/api/users')
          .then(res => {
            this.setState({
              users : res.data,
            });
          })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            axios.post('http://localhost:8080/api/admin/login', values, {withCredentials: true})
            .then(result => {
                if(result.data !== 'failed') {
                    console.log(result.data);
                    return this.props.history.push('/main')

                } else {
                    console.log(result.data);
                    message.error('사용자 정보를 확인해주세요.');
                }
            })
            }
            else {
                message.error('접근 오류입니다.');
                window.location.reload();
            }
        });
    };
    
      render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className = "login" style={{height : "100vh"}}>
                    <div style={{textAlign : "center"}} >
                        <div style={{position:"relative", top:"32vh", display: "inline-block", width : "40vh", height : "35vh", backgroundColor : "white", padding:"2.5vh"}}>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                    <div style ={{fontSize : "3vh", marginBottom :"2vh" }}>Log in</div>

                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('Email', {
                                rules: [{ required: true, message: 'Please input your Id!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="서버 관리자" />
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('Password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="관리자 비밀번호" />
                            )}
                            </Form.Item>
                            <Form.Item>
                        
                            <Button style={{width : "100%"}}type="primary" htmlType="submit" className="login-form-button">
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
