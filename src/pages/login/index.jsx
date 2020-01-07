import React, {Component} from 'react';
import './index.less'
import {Form, Input, Button, Icon, Modal, message} from "antd";
import {post} from "utils/request";
import {observer, inject} from "mobx-react";


const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 10},
};

@Form.create()
@inject('configStore')
@observer
class Login extends Component {

  login = () => {
    const {validateFields, getFieldsValue} = this.props.form;
    validateFields(async err => {
      if (!err) {
        const userInfo = getFieldsValue();
        const res = await post('/api/login', userInfo);
        console.log(res);
        if (res.code === 200) {
          if (!res.data.menus.length) {
            message.error('获取菜单失败');
            return
          }
          const configInfo = {
            menuConfig: res.data.menus,
            userName: res.data.userName,
            nickName: res.data.nickName,
            password: userInfo.password,
            tokenId: res.data.token,
          };
          this.props.configStore.changeConfig(configInfo);
          sessionStorage.setItem('accountInfo', JSON.stringify(configInfo));
          //const defaultRoute = this.getDefaultRoute(res.data.menus);
          //this.props.history.push(defaultRoute)
          this.props.history.push('/dashBoard/dataOverview')
        } else {
          message.error(res.msg)
        }
      }
    })
  };
  getDefaultRoute = (config) => {
    let defaultRoute = '/';
    if (!config[0].children) {
      defaultRoute = config[0].value
    } else {
      defaultRoute = config[0].value
    }
    return defaultRoute
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className='login'>
        <div className='login-content'>
          <h3>链工厂-后台管理系统</h3>
          <Form.Item>
            {getFieldDecorator('userName', {
              rules: [{required: true, message: '请输入用户名'}],
            })(
              <Input
                prefix={<Icon type="user" style={{color: '#889aa4'}}/>}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{required: true, message: '请输入密码'}],
            })(
              <Input
                prefix={<Icon type="lock" style={{color: '#889aa4'}}/>}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <p>
            <Button onClick={this.login} type="primary" className="login-form-button">
              登录
            </Button>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
