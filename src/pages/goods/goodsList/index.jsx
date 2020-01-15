import React from "react";
import "./index.less";
import {Tabs, Input, Button, Table, Divider, Select, message,Pagination} from "antd";
import moment from "moment";
import { get, post } from "utils/request";
const qs = require("querystring");
import CommonTable from "../../../components/Table";

const { TabPane } = Tabs;
const { Column } = Table;
const { Option } = Select;

function callback(key) {
  console.log(key);
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
 /* getCheckboxProps: record => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name
  })*/
};

class GoodsList extends React.Component {
  state = {
    goodsData: [], //商品列表
    goodsGroup: [], //商品分组下拉
    listLoading: true,
    pageNumber: 1,
    status: 0
  };

  async componentDidMount() {
    this.getGoodsList();
    this.getGoodsGroup();
  }

  /**
   * @disc: 发布/编辑商品
   * @date: 2020-01-08 15:37
   * @author: Wave
   */
  newChange = record => {
    let url = "/goods/editGoods";
    if (!record) {
      this.props.history.push(url);
    } else {
      this.props.history.push({
        pathname: url,
        search: "?" + qs.stringify({id:record.id})
      });
    }
  };

  /**
   * @disc: 获取商品列表
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  getGoodsList = async () => {
    this.setState({
      listLoading: true
    })
    const url = "/api/goods/list";
    const {pageNumber, groupId, key, status} = this.state
    const params = {
      pageNumber,
      pageSize: 10,
      groupId,
      key,
      status
    }
    const res = await post(url, params);
    if (res.data.success) {
      for (let item of res.data.result.list) {
        item.createTime = moment(item.createTime).format("YYYY-MM-DD HH:mm:ss");
      }
      this.setState({
        goodsData: res.data.result.list,
        total: res.data.result.total,
        listLoading: false
      });
    }
  };
  //商品分组下拉接口
  getGoodsGroup = async () => {
    const res = await get("/api/goods/group/list");
    if (res.data.success) {
      this.setState({
        goodsGroup: res.data.result,
      })
    }
  }
  changeGoodsId = (v) => {
    this.setState({
      key: v
    })
  }
  //下拉回调
  onChange = (value) => {
    this.setState({
      groupId:value
    })
  }
  //下架上架商品
  changeGoodsStatus = async (record) => {
    console.log(record, '--record')
    const params = {
      id: record.id,
      status: record.status ? 0 : 1
    }
    const res = await post("/api/goods/status/update", params);
    if (res.success) {
      message.success('操作成功');
      this.setState({
        pageNumber:1,
      },this.getGoodsList)
    }
  }
  //删除商品
  deleteGoods = async (record) => {
    const res = await post("/api/goods/status/update", {
      id: record.id,
      status: 2
    });
    if (res.success) {
      message.success('操作成功');
      this.setState({
        pageNumber:1,
      },this.getGoodsList)
    }
  }
  //tab切换
  tabChange = (key) => {
    let status = 0;
    if (key === "2") {
      status = 1;
    }
    this.setState({
      pageNumber: 1,
      groupId: "",
      key: "",
      status,
    },this.getGoodsList)
  }
  //分页
  changeSize = (pageNumber) => {
    this.setState({
      pageNumber
    },this.getList)
  }
  renderContent = () => {
    const columns = [
      {
        key: "productName",
        dataIndex: "goodsName",
        title: "商品"
      },
      {
        key: "price",
        dataIndex: "linePrice",
        title: "价格"
      },
      {
        key: "createTime",
        dataIndex: "createTime",
        title: "创建时间"
      },
      {
        key: "salesVolume",
        dataIndex: "salesVolume",
        title: "总销售量"
      },
      {
        key: "serialNumber",
        dataIndex: "serialNumber",
        title: "序号"
      },
      {
        key: "action",
        dataIndex: "action",
        title: "操作",
        render: (text, record) => (
          <span>
            <a onClick={() => {this.newChange(record)}}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => {
              this.changeGoodsStatus(record)
            }}>{record.status === 0 ? "下架" : "上架"}</a>
            <Divider type="vertical" />
            <a onClick={()=>this.deleteGoods(record)}>删除</a>
            {/*<Divider type="vertical"/ > < a > 复制 < /a>*/}
            </span>
        )
      },
    ]
    const {key,goodsGroup,goodsData,listLoading,pageNumber,changeSize,total}=this.state
    return (
      <>
        <Button type="primary" onClick={() => this.newChange()}>
          发布商品
        </Button>
        <div className="filtrate">
          <div className="condition">
            <span className="title">商品名称或编码</span>
            <Input placeholder="请输入商品名称或编码" value={key} onChange={(e)=>this.changeGoodsId(e.target.value)} />
          </div>
          <div className="condition">
            <span className="title">商品分组</span>
            <Select
              style={{ width: 200 }}
              onChange={this.onChange}
              placeholder="请选择商品分组"
              allowClear
            >
              {goodsGroup.map(v=>(
                <Option key={v.id} value={v.id}>{v.name}</Option>
              ))}

            </Select>
          </div>
          <div className="fl">
            <Button type="primary" onClick={this.getGoodsList}>筛选</Button>
          </div>
        </div>
        <CommonTable
          columns={columns}
          dataSource={goodsData}
          loading={listLoading}
          currentPage={pageNumber}
          changeSize={this.changeSize}
          total={total}
          // rowSelection={rowSelection}
          // rowKey={record => record.id}
        />
        {/*<div className="batch-operation-wrap">
          <Button type="primary">改分组</Button>
          <Button type="primary">下架</Button>
          <Button type="primary">删除</Button>
        </div>*/}
      </>
    )
  }

  render() {
    return (
      <div className="goods_list">
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          <TabPane tab="出售中" key="1">
            {this.renderContent()}
          </TabPane>
          <TabPane tab="仓库中" key="2">
            {this.renderContent()}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default GoodsList;
