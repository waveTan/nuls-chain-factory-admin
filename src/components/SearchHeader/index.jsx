import React, {Component} from 'react';
import {Input,message} from "antd";
import './index.less';
import axios from 'axios'
import config from "../../../setting";

const {Search} = Input
class SearchHeader extends Component {
  handleSearch = async (val) => {
    const data = [config.API_CHAIN_ID,val];
    const params = {"jsonrpc": "2.0", "method": 'search', "params": data, "id": Math.floor(Math.random() * 1000)};
    axios.post('https://nulscan.io/api/', params)
      .then(res => {
        if (res.data) {
          if (res.data.result) {
            const result = res.data.result
            if (result.type === 'block') {
              window.open('https://nulscan.io/block/info?height=' + result.data.txList[0].height)
            } else if (result.type === 'tx') {
              window.open('https://nulscan.io/transaction/info?hash=' + result.data.hash)
            } else {
              message.error('请输入正确的地址或TXID');
            }
          } else {
            message.error('请输入正确的地址或TXID');
          }
        }
      }, err => {
        console.log(err)
      })
    // const res = await rPost('/', 'search', [val])
    // if (res.result) {
    //   const result = res.result
    //   if (result.type === 'block') {
    //     window.open('https://nulscan.io/block/info?height='+result.data.txList[0].height)
    //   } else if (result.type === 'tx') {
    //     window.open('https://nulscan.io/transaction/info?hash='+result.data.hash)
    //   } else {
    //     message.error('请输入正确的地址或TXID');
    //   }
    // } else {
    //   message.error('请输入正确的地址或TXID');
    // }
  }
  render() {
    return (
      <div className='search-header'>
        <span className='search-label'>
          {this.props.children}
        </span>
        <Search
          placeholder="查询地址、TXID"
          enterButton="查询"
          onSearch={value => this.handleSearch(value)}
          ref={(v)=>this.input=v}
        />
      </div>
    );
  }
}

export default SearchHeader;