import React, {Component} from 'react';
import {Modal, Form, Input, message} from "antd";
import {get} from 'utils/request'

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 10},
};

class EditModal extends Component {
  state = {
    show: false,
    confirmLoading: false,
  };
  visible = () => {
    this.setState({
      show: !this.state.show
    })
  };
  phoneChange = (e) => {
    const value = e.target.value;
    this.props.form.setFieldsValue({'userName': value})
  };
  submit = () => {
    const {validateFields, getFieldsValue} = this.props.form;
    validateFields(async err => {
      if (!err) {
        const userInfo = getFieldsValue();
        this.setState({
          confirmLoading: true,
        });
        const url = this.props.title === '用户信息' ? '/usdi/account/edit' : '/usdi/account/new';
        const res = await get(url);
        if (res.success) {
          this.setState({
            confirmLoading: false
          });
          this.props.submit(userInfo);
          this.visible()
        } else {
          message.error(res.msg)
        }
      }
    })
  };
  checkName = (rule, value, callback) => {
    const reg = /^([a-zA-Z\u4e00-\u9fa5]+)$/;
    if (value) {
      if (reg.test(value)) {
        const length = value.replace(/[\u4e00-\u9fa5]/g, "aa").length;
        if (length > 16 || length < 4) {
          callback('请输入2-8个中文，或4-16个英文')
        }
      } else {
        callback('请输入2-8个中文，或4-16个英文')
      }
    }
    callback()
  };
  checkUserName = (rule, value, callback) => {
    const reg = /^([a-zA-Z0-9\u4e00-\u9fa5]+)$/;
    if (value) {
      if (reg.test(value)) {
        const cn = /^([\u4e00-\u9fa5]+)$/;
        if (cn.test(value)) {
          if (value.length > 8 || value.length < 2) {
            callback('请输入2-8个中文，或6-16个英文')
          }
        } else {
          const length = value.replace(/[\u4e00-\u9fa5]/g, "aa").length;
          if (length > 16 || length < 6) {
            callback('请输入2-8个中文，或6-16个英文')
          }
        }
      } else {
        callback('请输入2-8个中文，或6-16个英文')
      }
    }
    callback()
  };

  render() {
    const {getFieldDecorator, resetFields} = this.props.form;
    return (
      <Modal
        title={this.props.title}
        visible={this.state.show}
        onOk={this.submit}
        onCancel={this.visible}
        confirmLoading={this.state.confirmLoading}
        width='700px'
        className='edit-modal'
        ref={(v) => this.modal = v}
        afterClose={resetFields}
      >
        <Form.Item {...formItemLayout} label="手机">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: '请输入手机号',
              },
              {
                // validator: this.validatePhone
                pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
                message: '请输入正确的手机号',
              }
            ],
            validateTrigger: ['onBlur']
          })(<Input placeholder="请输入手机号" onChange={this.phoneChange}/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入姓名',
              },
              // {
              //   pattern: /^[!-~]{6,16}$/,
              //   message: '请输入4-16个英文，或2-8个中文'
              // },
              {
                validator: this.checkName
              }
            ],
            validateTrigger: ['onBlur']
          })(<Input placeholder="请输入姓名"/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="用户名">
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
              // {
              //   pattern: /^[!-~]{6,16}$/,
              //   message: '请输入6-16个英文，或2-8个中文'
              // },
              {
                validator: this.checkUserName
              }
            ],
            validateTrigger: ['onBlur']
          })(<Input placeholder="请输入用户名"/>)}
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create()(EditModal);
