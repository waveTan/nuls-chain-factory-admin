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

  render() {
    const {getFieldDecorator, resetFields} = this.props.form;
    return (
      <Modal title={this.props.title} visible={this.state.show} width='700px' className='edit-modal'
             onOk={this.submit}
             onCancel={this.visible}
             confirmLoading={this.state.confirmLoading}
             ref={(v) => this.modal = v}
             afterClose={resetFields}
      >
        <Form.Item {...formItemLayout} label="组名">
          {getFieldDecorator('phone', {
            rules: [
              {required: true, message: '请输入手机号',},
              {pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确的手机号',}
            ],
            validateTrigger: ['onBlur']
          })(<Input placeholder="请输入组名" onChange={this.phoneChange}/>)}
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create()(EditModal);
