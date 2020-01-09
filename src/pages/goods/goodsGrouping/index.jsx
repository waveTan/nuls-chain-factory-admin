import React from 'react';
import './index.less'
import {Button, Table, Divider, Modal} from 'antd';
import EditModal from "./EditModal";
import moment from 'moment';
import {get, post} from 'utils/request'

const {Column} = Table;

const groupingData = [];

class GoodsGrouping extends React.Component {
  state = {
    groupingData: [],//分组列表
    loading: false,
    visible: false,
    modalTitle: '新建分组'
  };

  componentDidMount() {
    this.getGroupList();
  }

  /**
   * @disc: 显示修改、添加分组
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  showModal = () => {
    this.setState({visible: true});
    this.addAccount();
  };

  /**
   * @disc: 获取分组列表
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  getGroupList = async () => {
    const url = '/api/goods/group/list';
    const res = await get(url);
    if (res.data.success) {
      for (let item of res.data.result) {
        item.time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.setState({groupingData: res.data.result});
    }
  };

  /**
   * @disc: 新建分组
   * @date: 2020-01-09 13:58
   * @author: Wave
   */
  addAccount = () => {
    this.setState({
      modalTitle: '新建分组'
    });
    this.editModal.visible();
  };

  /**
   * @disc: 编辑分组
   * @params: record
   * @date: 2020-01-09 13:58
   * @author: Wave
   */
  editUserInfo = (record) => {
    this.setState({
      modalTitle: '编辑分组'
    });
    this.editModal.props.form.setFieldsValue({
      name: record.name,
    });
    this.editModal.visible()
  };

  /**
   * @disc: 新建、编辑分组确认回调
   * @params: userInfo
   * @date: 2020-01-09 14:03
   * @author: Wave
   */
  changeGroupingInfo = (groupingInfo) => {
    if (groupingInfo) {
      this.getGroupList();
    }
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

        <Table dataSource={this.state.groupingData}>
          <Column title="组名" dataIndex="name" key="productName"/>
          <Column title="商品数量" dataIndex="goodsCount" key="price"/>
          <Column title="创建时间" dataIndex="time" key="time"/>
          <Column title="操作" key="action"
                  render={(text, record) => (
                    <span>
                    <a onClick={() => this.editUserInfo(record)}>编辑</a>
                    <Divider type="vertical"/>
                    <a>删除</a>
                  </span>
                  )}
          />
        </Table>

        <div className="add_grouping">
          <EditModal wrappedComponentRef={(v) => this.editModal = v} title={this.state.modalTitle}
                     submit={this.changeGroupingInfo}/>
        </div>

      </div>
    );
  }
}

export default GoodsGrouping;
