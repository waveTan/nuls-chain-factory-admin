import React from 'react';
import './index.less'
import {Input, Button, Table, Select, DatePicker} from 'antd';
import CommonTable from "../../../components/Table";
import {post} from "../../../utils/request"
import moment from "moment";

const {Column} = Table;
const {RangePicker} = DatePicker;
/*const data = [
  {
    key: '1',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '2',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '3',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '4',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '5',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '6',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '7',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '8',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
  {
    key: '9',
    productName: '轻钱包/转账/合约调用',
    price: '3000',
    time: '2019-11-02 18:30',
    totalSales: 'wave',
    serialNumber: 5
  },
];*/

function changeData(date, dateString) {
  console.log(date, dateString);
}

class OrdersList extends React.Component {
  state = {
    dataSource: [],
    listLoading: true,
    pageNumber: 1
  };

  componentDidMount() {
    this.getList()
  }

  getList = async () => {
    this.setState({
      listLoading: true
    })
    const {pageNumber,orderId,goodsName, beginTime, endTime} = this.state;
    const params = {
      pageNumber,
      pageSize: 10,
      orderId,
      goodsName,
      beginTime,
      endTime
    }
    console.log(params,'-=-=params')
    const res = await post("/api/order/list", params);
    if (res.success) {
      res.data.result.list.map(v=>{
        if (v.payTime) {
          v.payTime = moment(v.payTime).format("YYYY-MM-DD HH:mm:ss")
        } else {
          v.payTime = ''
        }
      })
      this.setState({
        dataSource: res.data.result.list,
        total: res.data.result.total,
        listLoading: false
      })
    }
  }
  inputChange = (e,type) => {
    this.setState({
      [type]: e.target.value
    })
  }
  changeSize = (pageNumber) => {
    console.log(pageNumber)
    this.setState({
      pageNumber
    },this.getList)
  }
  onTimeChange = (value, dateString) => {
    if (value.length) {
      console.log(value[0].$d.getTime(), 'time');
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      const beginTime = value[0].$d.getTime()
      const endTime = value[1].$d.getTime()
      this.setState({
        beginTime,
        endTime
      })
    } else {
      this.setState({
        beginTime: "",
        endTime: ""
      })
    }
  }

  render() {
    const {orderId, goodsName, listLoading, pageNumber, dataSource, total} = this.state;
    const columns = [
      {
        key: "goodsName",
        dataIndex: "goodsName",
        title: "商品"
      },
      {
        key: "price",
        dataIndex: "price",
        title: "价格"
      },
      {
        key: "payTime",
        dataIndex: "payTime",
        title: "付款时间"
      },
      {
        key: "address",
        dataIndex: "address",
        title: "买家"
      },
      {
        key: "serialNumber",
        dataIndex: "serialNumber",
        title: "成交价格"
      },
    ]
    return (
      <div className='orders_list'>
        <div className="filtrate">
          <div className="condition">
            <span className="title">订单编号</span>
            <Input placeholder="请输入订单编号"
                   value={orderId}
                   onChange={(e)=>{this.inputChange(e,"orderId")}} />
          </div>
          <div className="condition">
            <span className="title">商品名称或编码</span>
            <Input
              placeholder="请输入商品名称或编码"
              value={goodsName}
              onChange={(e)=>{this.inputChange(e,"goodsName")}}
            />
          </div>
          <div className="condition change_data">
            <RangePicker onChange={this.onTimeChange} />
          </div>
          <div className="fl">
            <Button type="primary" onClick={()=>{this.setState({pageNumber: 1},this.getList)}}>筛选</Button>
          </div>
        </div>
        <div className="table">
          <CommonTable
            columns={columns}
            dataSource={dataSource}
            loading={listLoading}
            currentPage={pageNumber}
            changeSize={this.changeSize}
            total={total}
          />
        </div>

      </div>
    );
  }
}

export default OrdersList;
