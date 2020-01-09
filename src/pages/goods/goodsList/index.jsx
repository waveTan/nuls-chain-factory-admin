import React from 'react';
import './index.less'
import {Tabs, Input, Button, Table, Divider, Select} from 'antd';
import moment from 'moment';
import {get, post} from 'utils/request'

const {TabPane} = Tabs;
const {Column} = Table;
const {Option} = Select;

function callback(key) {
  console.log(key);
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val) {
  console.log('search:', val);
}

class GoodsList extends React.Component {
  state = {
    goodsData:[],//商品列表
  };

  componentDidMount() {
    this.getGoodsList();
  }

  /**
   * @disc: 发布商品
   * @date: 2020-01-08 15:37
   * @author: Wave
   */
  newChange = () => {
    let url = '/goods/editGoods';
    this.props.history.push(url);
  };

  /**
   * @disc: 获取商品列表
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  getGoodsList = async () => {
    const url = '/api/goods/list?pageNumber=1&pageSize=10';
    const res = await get(url);
    console.log(res);
    if (res.data.success) {
      for (let item of res.data.result.list) {
        item.time = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.setState({goodsData: res.data.result.list});
    }
  };

  render() {
    return (
      <div className='goods_list'>
        <Tabs defaultActiveKey="1" click={callback}>
          <TabPane tab="出售中" key="1">

            <Button type="primary" onClick={this.newChange}>发布商品</Button>

            <div className="filtrate">
              <div className="condition">
                <span className="title">商品名称或编码</span>
                <Input placeholder="Basic usage"/>
              </div>
              <div className="condition">
                <span className="title">商品分组</span>
                <Select
                  showSearch
                  style={{width: 200}}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </div>
              <div className="fl">
                <Button type="primary">筛选</Button>
              </div>
            </div>

            <Table dataSource={this.state.goodsData} rowSelection={rowSelection}>
              <Column title="商品" dataIndex="goodsName" key="productName"/>
              <Column title="价格" dataIndex="linePrice" key="price"/>
              <Column title="创建时间" dataIndex="time" key="time"/>
              <Column title="总销售量" dataIndex="totalSales" key="totalSales"/>
              <Column title="序号" dataIndex="serialNumber" key="serialNumber"/>
              <Column title="操作" key="action"
                      render={(text, record) => (
                        <span>
                    <a>编辑</a>
                    <Divider type="vertical"/>
                    <a>下架</a>
                    <Divider type="vertical"/>
                    <a>删除</a>
                    {/*<Divider type="vertical"/>
                    <a>复制</a>*/}
                  </span>
                      )}
              />
            </Table>
          </TabPane>
          <TabPane tab="仓库中" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default GoodsList;
