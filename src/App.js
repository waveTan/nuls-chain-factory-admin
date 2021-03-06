import React from 'react';
import './style'
import { BrowserRouter,Redirect,Route, Switch} from "react-router-dom";
import { Provider } from "mobx-react";
import store from './store'
import { hot } from "react-hot-loader";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import loadable from "@loadable/component";
const Login = loadable(()=>import('page/login'));
const Menu = loadable(()=>import('components/Menu'));
import { get } from 'utils/request'
import {inject,observer} from "mobx-react";

moment.locale('zh-cn');

@inject('configStore')
@observer
class AuthRoute extends React.Component{
  componentDidMount() {
    console.log('挂载了！！！')
  }
  render() {
    const {component: Comp, ...rest} = this.props;
    const {tokenId} = this.props.configStore;
    return (
      <Route
        {...rest}
        render={
          (props) => (
            tokenId ?
              <Comp {...props} />
              :
              <Redirect to={{
                pathname: '/login',
                state: {redirect: props.location.pathname}
              }} />
          )
        }
      />
    )
  }
}

class App extends React.Component {
  componentDidMount() {
    // this.getConfigInfo()
  }
  //获取配置信息
  async getConfigInfo() {
    const res = await get('/api/info');
    if (res.success) {
      localStorage.setItem('configInfo',JSON.stringify(res.data));
      //业务系统合约--configInfo.appContractAddress
      //token合约---configInfo.tokenContractAddress
      //usdi小数位数--configInfo.usdiDecimals
      //百分比表示小数位数 1000=>0.1=>10%--configInfo.rateDecimals
      //nuls小数位数--configInfo.nulsDecimals
    } else {
      localStorage.removeItem('configInfo')
    }

  }
  render() {
    return (
      <Provider {...store}>
        <BrowserRouter>
          <ConfigProvider locale={zhCN}>
            <Switch>
              <Route path='/login' exact component={Login}/>
              <AuthRoute path='/' component={Menu} />
            </Switch>
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    )
  }
}
export default hot(module)(App)

