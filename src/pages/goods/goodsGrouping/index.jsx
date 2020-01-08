import React from 'react';
import './index.less'
import {Button, Table, Divider, Modal} from 'antd';
import EditModal from "./EditModal";

const {Column} = Table;

const data = [
  {key: '1', groupingName: 'DAPP', count: 20, time: '2019-11-02 18:30'},
  {key: '2', groupingName: 'DAPP', count: 20, time: '2019-11-02 18:30'},
  {key: '3', groupingName: 'DAPP', count: 20, time: '2019-11-02 18:30'},
  {key: '4', groupingName: 'DAPP', count: 20, time: '2019-11-02 18:30'},
];

class GoodsGrouping extends React.Component {
  state = {
    loading: false,
    visible: false,
    modalTitle: '新建分组'
  };

  showModal = () => {
    this.setState({visible: true,});
    this.addAccount();
  };

  handleOk = () => {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false, visible: false});
    }, 3000);
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  //新建用户
  addAccount = () => {
    this.setState({
      modalTitle: '新建分组'
    });
    this.editModal.visible();
    console.log(this.editModal, '-ssss')
  };
  //编辑
  editUserInfo = (record) => {
    this.setState({
      modalTitle: '编辑用户信息'
    });
    this.editModal.props.form.setFieldsValue({
      phone: record.phone,
      name: record.name,
      userName: record.userName,
    });
    this.editModal.visible()
  };

  //新建、编辑用户确认回调
  changeUserInfo = (userInfo) => {
    console.log(userInfo, '---userInfo');
    this.setState({
      page: 0,
      status: 'All',
      minTime: '',
      maxTime: '',
      search: ''
    }, this.getList)
  };

  render() {
    const {visible} = this.state;
    return (
      <div className='goods_grouping'>

        <Button type="primary" onClick={this.showModal}>
          添加分组
        </Button>

        <div className="parting_line">
        </div>

        <Table dataSource={data}>
          <Column title="组名" dataIndex="groupingName" key="productName"/>
          <Column title="商品数量" dataIndex="count" key="price"/>
          <Column title="创建时间" dataIndex="time" key="time"/>
          <Column title="操作" key="action"
                  render={(text, record) => (
                    <span>
                    <a>编辑</a>
                    <Divider type="vertical"/>
                    <a>删除</a>
                  </span>
                  )}
          />
        </Table>

        <div className="add_grouping">
          <EditModal wrappedComponentRef={(v) => this.editModal = v} title="添加分组" submit={this.changeUserInfo}/>
        </div>

      </div>
    );
  }
}

export default GoodsGrouping;
