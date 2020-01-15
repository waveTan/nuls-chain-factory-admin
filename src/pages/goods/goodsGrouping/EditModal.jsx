import React, {Component} from 'react';
import {Modal, Form, Input, message} from "antd";
import {get,post} from 'utils/request'

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
  groupingNameChange = (e) => {
    const value = e.target.value;
    this.props.form.setFieldsValue({'name': value})
  };
  submit = () => {
    const {validateFields, getFieldsValue} = this.props.form;
    validateFields(async err => {
      if (!err) {
        const groupingName = getFieldsValue();
        this.setState({
          confirmLoading: true,
        });
        const params = {id:this.props.editId, ...groupingName}
        const url = this.props.title === '编辑分组' ? '/api/goods/group/update' : '/api/goods/group/add';
        const res = await post(url, params);
        if (res.success) {
          this.setState({
            confirmLoading: false
          });
          this.props.submit(groupingName);
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
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '请输入组名',},
            ],
            validateTrigger: ['onBlur']
          })(<Input placeholder="请输入组名" onChange={this.groupingNameChange}/>)}
        </Form.Item>
      </Modal>
    );
  }
}

export default Form.create()(EditModal);
