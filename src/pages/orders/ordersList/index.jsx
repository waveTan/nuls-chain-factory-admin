import React from 'react';
import './index.less'
import {Input, Button, Table, Select, DatePicker} from 'antd';

const {Column} = Table;
const {RangePicker} = DatePicker;
const data = [
  {key: '1', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '2', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '3', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '4', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '5', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '6', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '7', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '8', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
  {key: '9', productName: '轻钱包/转账/合约调用', price: '3000', time: '2019-11-02 18:30', totalSales: 'wave', serialNumber: 5},
];

function changeData(date, dateString) {
  console.log(date, dateString);
}

class OrdersList extends React.Component {
  state = {};

  componentDidMount() {

  }

  render() {
    return (
      <div className='orders_list'>

        <div className="filtrate">
          <div className="condition">
            <span className="title">订单编号</span>
            <Input placeholder="请输入订单编号"/>
          </div>
          <div className="condition">
            <span className="title">商品名称或编码</span>
            <Input placeholder="请输入商品名称或编码"/>
          </div>
          <div className="condition change_data">
            <RangePicker onChange={changeData}/>
          </div>
          <div className="fl">
            <Button type="primary">筛选</Button>
          </div>
        </div>

        <div className="table">
          <Table dataSource={data}>
            <Column title="商品" dataIndex="productName" key="productName"/>
            <Column title="价格" dataIndex="price" key="price"/>
            <Column title="付款时间" dataIndex="time" key="time"/>
            <Column title="买家" dataIndex="totalSales" key="totalSales"/>
            <Column title="成交价格" dataIndex="serialNumber" key="serialNumber"/>
          </Table>
        </div>

      </div>
    );
  }
}

export default OrdersList;
