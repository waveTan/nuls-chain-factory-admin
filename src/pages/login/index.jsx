import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./index.less";
import { Form, Input, Button, Icon, message } from "antd";
import { post } from "utils/request";
import { observer, inject } from "mobx-react";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 }
};

@Form.create()
@inject("configStore")
@observer
class Login extends Component {
  login = () => {
    const { validateFields, getFieldsValue } = this.props.form;
    validateFields(async err => {
      if (!err) {
        const userInfo = getFieldsValue();
        const res = await post("/api/login", userInfo);
        if (res.code === 200) {
          if (!res.data.menus.length) {
            message.error("获取菜单失败");
            return;
          }
          res.data.menus.map(v=>{
            if (v.title==="商品管理" && v.children) {
              v.children.map(item=>{
                if (item.value === "/goods/editGoods") {
                  item.hide = true
                }
              })
            }
          })
          const configInfo = {
            menuConfig: res.data.menus,
            userName: res.data.userName,
            nickName: res.data.nickName,
            password: userInfo.password,
            tokenId: res.data.token
          };
          this.props.configStore.changeConfig(configInfo);
          sessionStorage.setItem("accountInfo", JSON.stringify(configInfo));
          const { redirect } = this.props.location.state || "/";
          this.props.history.push(redirect);
        } else {
          message.error(res.msg);
        }
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tokenId } = this.props.configStore;
    if (tokenId) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login">
        <div className="login-content">
          <h3>NULS链工厂-后台管理系统</h3>
          <Form.Item>
            {getFieldDecorator("userName", {
              rules: [{ required: true, message: "请输入用户名" }]
            })(
              <Input
                prefix={<Icon type="user" style={{ color: "#889aa4" }} />}
                placeholder="用户名"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码" }]
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: "#889aa4" }} />}
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          {/*<p className="tr">*/}
          {/*  <a className="login-form-forgot">忘记密码</a>*/}
          {/*</p>*/}
          <p>
            <Button
              onClick={this.login}
              type="primary"
              className="login-form-button"
            >
              登录
            </Button>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;
