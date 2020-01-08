import React from 'react'
import './index.less'
import Table from "components/Table";
import {Input, DatePicker, Select, Button, Divider, Modal, message} from 'antd'
import {get} from 'utils/request'
import moment from 'moment';
import EditModal from "./EditModal";

const {Option} = Select;
const {RangePicker} = DatePicker;

class Main extends React.Component {
  state = {
    loading: true
  };
  componentDidMount() {
    //this.getList()
  }
  async getList() {
    this.setState({
      loading: true
    });
    const params = {
      page: this.state.page || 0,
      size: 10,
      status: this.state.status,
      minTime: this.state.minTime,
      maxTime: this.state.maxTime,
      search: this.state.search
    };
    const res = await get('/usdi/account/list', params);
    if (res.success) {
      this.setState({
        loading: false,
        total: res.data.total,
        tableList: res.data.list
      })
    }
  }
  //下拉回调
  handleChange = (v) => {
    this.setState({
      status: v
    }, this.getList)
  };
  onTimeChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };
  //查询
  doSearch = () => {
    this.getList;
    console.log(this.state, '---state')
  };
  //表格翻页
  changeSize = (page) => {
    this.setState({
      page
    }, this.getList)
  };
  //新建用户
  addAccount = () => {
    this.setState({
      modalTitle: '新建用户'
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
  //重置密码，启用/禁用弹框
  showConfirm = (title) => {
    Modal.confirm({
      title: title,
      content: '',
      onOk: () => this.doConfirm(title),
      onCancel() {
      },
    });
  };
  doConfirm = async (title) => {
    console.log(title, '---00');
    if (title === '确认重置该用户密码') {
      const res = await get('/usdi/account/edit');
      if (res.success) {
        message.success('重置成功')
      }
    } else {
      //启用禁用
      const res = await get('/usdi/account/edit');
      if (res.success) {
        message.success('设置成功');
        this.getList()
      }
    }
  };

  render() {
    const {searchVal, tableList, total, loading, modalTitle} = this.state;
    const statusType = [{label: '全部', value: 'All'}, {label: '启用', value: 'y'}, {label: '禁用', value: 'n'}];
    const columns = [
      {
        title: '用户名',
        key: 'userName',
        dataIndex: 'userName'
      },
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '手机',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        key: 'time',
        dataIndex: 'time',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (text) => text === 'On' ? '启用' : '禁用'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.editUserInfo(record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showConfirm('确认重置该用户密码？')}>重置密码</a>
            <Divider type="vertical"/>
            <a
              onClick={() => this.showConfirm(record.status !== 'On' ? '确认启用该用户？' : '确认禁用该用户？')}>{record.status !== 'On' ? '启用' : '禁用'}</a>
          </span>
        ),
      },
    ];
    return (
      <div className='account-manage bg-white'>
        <div className='create-account'>
          <Button type='primary' onClick={this.addAccount}>新建</Button>
        </div>
        <div className='search-account hidden'>
          <div className='fl'>
            状态&nbsp;&nbsp;&nbsp;
            <Select defaultValue='All' onChange={this.handleChange}>
              {statusType.map(v => <Option key={v.value} value={v.value}>{v.label}</Option>)}
            </Select>
          </div>
          <div className='fl'>
            注册时间&nbsp;&nbsp;&nbsp;
            <RangePicker
              // showTime={{ format: 'HH:mm' }}
              // format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '截止时间']}
              onChange={this.onTimeChange}
            />
          </div>
          <div className='fl'>
            <Input className='search-input' placeholder='请输入用户名、姓名、手机号查询' value={searchVal}/>
          </div>
          <div className='fl'>
            <Button type='primary' onClick={this.doSearch}>查询</Button>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={tableList}
          loading={loading}
          total={total}
          changeSize={this.changeSize}
        />
        <EditModal
          wrappedComponentRef={(v) => this.editModal = v}
          title={modalTitle}
          submit={this.changeUserInfo}
        />
      </div>
    )
  }
}

export default Main
