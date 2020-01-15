import React from 'react';
import './index.less'
import {Button, Table, Divider, Modal, message} from 'antd';
import EditModal from "./EditModal";
import moment from 'moment';
import {get, post} from 'utils/request'
import CommonTable from "../../../components/Table";

const {Column} = Table;

const groupingData = [];

class GoodsGrouping extends React.Component {
  state = {
    groupingData: [],//分组列表
    loading: false,
    modalTitle: '新建分组',
    listLoading: true
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
    this.addAccount();
  };

  /**
   * @disc: 获取分组列表
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  getGroupList = async () => {
    this.setState({
      listLoading: true
    })
    const url = '/api/goods/group/list';
    const res = await get(url);
    if (res.data.success) {
      for (let item of res.data.result) {
        item.time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.setState({
        groupingData: res.data.result,
        listLoading: false
      });
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
    this.editId = "";
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
    this.editId = record.id;
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
  deleteGroup = async (record) => {
    const params = {
      id: record.id
    }
    const res = await post("/api/goods/group/delete",params);
    if (res.success) {
      message.success("操作成功")
      this.getGroupList()
    }
  }

  render() {
    const columns = [
      {
        key: "productName",
        dataIndex: "name",
        title: "组名"
      },
      {
        key: "price",
        dataIndex: "goodsCount",
        title: "商品数量"
      },
      {
        key: "time",
        dataIndex: "time",
        title: "创建时间"
      },
      {
        key: "action",
        dataIndex: "action",
        title: "操作",
        render: (text, record) => (
          <span>
            <a onClick={() => this.editUserInfo(record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.deleteGroup(record)} >删除</a>
          </span>
        )
      },
    ]
    return (
      <div className='goods_grouping'>
        <Button type="primary" onClick={this.showModal}>
          添加分组
        </Button>
        <div className="parting_line">
        </div>
        <CommonTable
          dataSource={this.state.groupingData}
          columns={columns}
          loading={this.state.listLoading}
        />
        <div className="add_grouping">
          <EditModal wrappedComponentRef={(v) => this.editModal = v}
                     title={this.state.modalTitle}
                     editId={this.editId}
                     submit={this.changeGroupingInfo}/>
        </div>

      </div>
    );
  }
}

export default GoodsGrouping;
