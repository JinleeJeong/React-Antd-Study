import React, { Component } from 'react';
import { Button, Form, Input, Icon, Checkbox } from 'antd';
import { Redirect } from 'react-router-dom';
// import axios from 'axios';
import './login.css';
import axios from 'axios';
import {Link} from 'react-router-dom';

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
            axios.post('http://localhost:8080/api/users/login', values)
            .then(result => {
                return <Redirect to ='/board/'/>
            })
            }
            else {
                console.log(err);
            }
        });
        };
    
      render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className = "login" style={{height : "100vh"}}>
                    <div style={{textAlign : "center"}} >
                        <div style={{position:"relative", top:"40vh", display: "inline-block"}}>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                            {getFieldDecorator('id', {
                                rules: [{ required: true, message: 'Please input your Id!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="서버 관리자" />
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="관리자 비밀번호" />
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox style={{marginRight : "15vh"}}>Remember me</Checkbox>
                            )}
                            <Button style={{marginRight : "", float:"right"}} type="primary" htmlType="submit" className="login-form-button">
                            <Link to="/main">
                                Log in
                            </Link>
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
