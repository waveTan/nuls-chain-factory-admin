import React from 'react';
import './index.less'
import config from "../../router/config";
import logo from 'src/images/logo.png';
import {Redirect, Route, Switch} from "react-router-dom";
import {get} from 'utils/request';
import AsyncComponent from "page/AsyncComponent";
import {observer, inject} from "mobx-react";
// import loadable from '@loadable/component'
import {Layout, Menu, Icon, Breadcrumb, Dropdown, Avatar, Modal, Form, Input, message} from 'antd';

const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu;
const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 10},
};

@Form.create()
class PasswordModal extends React.Component {
  state = {
    show: false,
    confirmLoading: false
  };
  visible = () => {
    this.setState((state) => ({
      show: !this.state.show
    }))
  };
  handleOk = async () => {
    const {validateFields, getFieldsValue} = this.props.form;
    validateFields(async err => {
      if (!err) {
        const info = getFieldsValue();
        this.setState({
          confirmLoading: true,
        });
        const isSuccess = await this.props.confirm(info);
        if (isSuccess) {
          this.setState({
            confirmLoading: false
          });
          this.visible()
        }
      }
    })
  };
  handleCancel = () => {
    this.visible()
  };
  checkNewPs = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  render() {
    const {getFieldDecorator, resetFields} = this.props.form;
    return (
      <Modal
        title="修改密码"
        visible={this.state.show}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        ref={(v) => this.psModal = v}
        confirmLoading={this.state.confirmLoading}
        width='700px'
        afterClose={resetFields}
      >
        <Form.Item {...formItemLayout} label="原密码">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入原密码',
              }
            ],
            validateTrigger: ['onBlur']
          })(<Input type='password' placeholder="请输入原密码"/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="新密码">
          {getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: '请输入新密码',
              },
              {
                pattern: /^[!-~]{6,16}$/,
                message: '密码由数字、字母、特殊符号组成，长度为6-16'
              },
            ],
            validateTrigger: ['onBlur']
          })(<Input type='password' placeholder="请输入新密码"/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="重复新密码">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请再次输入新密码',
              },
              {
                validator: this.checkNewPs,
              }

            ],
            validateTrigger: ['onBlur']
          })(<Input type='password' placeholder="请再次输入新密码"/>)}
        </Form.Item>
      </Modal>
    )
  }
}


class RenderRoute extends React.Component {
  //避免menu组件setState导致异步组件多次重复加载
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // console.log(nextProps,1,nextState,2,nextContext,3,this.props,4,location.pathname)
    if (this.props.currentPath === nextProps.currentPath) {
      return false
    }
    return true
  }

  renderRoute = (config) => {
    return config.map(v => {
      if (!v.children) {
        return <Route exact path={v.value} key={v.value}
                      component={AsyncComponent(() => import('../../pages' + v.value))}/>
      }
      return this.renderRoute(v.children)
    })
  };

  render() {
    const {config, redirectPath} = this.props;
    if (!config.length) return null;
    return (
      <Switch>
        {this.renderRoute(config)}
        <Redirect from='/' to={redirectPath}/>
      </Switch>
    )
  }
}

class TabRoute extends React.Component {
  clickTab = (v) => {
    if (!v.choose && this.props.clickTab) {
      this.props.clickTab(v.path)
    }
  };
  closeTab = (e, v) => {
    e.stopPropagation();
    if (this.props.closeTab) {
      this.props.closeTab(v.path)
    }
  };

  render() {
    const {tabData} = this.props;
    return (
      <div className='tab-route'>
        <div className='tab-wrap scrollbar'>
          {tabData.map((v, i) => {
            return <span key={i} className={v.choose ? 'active-tab tab-item' : 'tab-item'}
                         onClick={() => this.clickTab(v)}>
                {v.title}
              {
                tabData.length > 1 ? <span onClick={(e) => this.closeTab(e, v)}>x</span>
                  : null
              }
              </span>
          })}
        </div>
      </div>
    )
  }
}

@inject('configStore')
@observer
class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      crumb: [],
      tabData: []
    };
  }

  componentDidMount() {
    this.getCrumbObj();
    this.initCrumbList(location.pathname);
    this.getDefaultKeys();
    this.initTabData();
  }

  // static getDerivedStateFromProps(nextProps, prevState){
  //   console.log(nextProps,888,prevState)
  //   return null
  // }

  //初始化时获取默认展开菜单和默认打开页面
  getDefaultKeys = () => {
    const selectedKeys = [location.pathname];
    const urlList = location.pathname.split('/').filter(i => i);
    const openKeys = urlList.slice(0, urlList.length - 1);
    this.setState({
      selectedKeys,
      openKeys
    })
  };
  //将所有label标签及对应的路由放入一个对象中
  getCrumbObj = () => {
    this.crumbObj = {};
    this.getCrumbItem(this.menuConfig || [])
  };
  getCrumbItem = (config) => {
    config.map(v => {
      this.crumbObj[v.value] = v.title;
      if (v.children) {
        this.getCrumbItem(v.children)
      }
    })
  };
  //根据pathname计算crumbList
  initCrumbList = (path) => {
    let crumbList = [];
    const urlList = path.split('/').filter(i => i);
    for (let i = 0; i < urlList.length - 1; i++) {
      crumbList.push(urlList[i])
    }
    crumbList.push(path);
    this.getCrumbList(crumbList)
  };
  getCrumbList = (data) => {
    let crumbList = [];
    data.map(v => crumbList.push(this.crumbObj[v]));
    this.setState({
      crumb: crumbList
    });
  };
  initTabData = () => {
    const {selectKeys, crumb} = this.state;
    console.log(selectKeys, 456, crumb);
    const path = location.pathname,
      title = this.crumbObj[path];
    this.setState({
      tabData: [{path, title, choose: true}]
    })
  };
  //展开收缩菜单
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  //渲染侧边菜单
  renderMenuItem = (config) => {
    return config.map(v => {
      if (!v.children) {
        if (v.hide) return null;
        return <Menu.Item key={v.value}>
          {v.icon && <Icon type={v.icon}/>}
          <span>{v.title}</span>
        </Menu.Item>
      }
      return this.renderSubMenu(v)
    })
  };
  //子菜单
  renderSubMenu = (item) => {
    return <SubMenu
      key={item.value}
      title={
        <span>
          {item.icon && <Icon type={item.icon}/>}
          <span>{item.title}</span>
        </span>
      }>
      {this.renderMenuItem(item.children)}
    </SubMenu>
  };
  //点击菜单跳转
  changeRoute = (e) => {
    if (e.key === location.pathname) return;
    this.initCrumbList(e.key);
    // this.getCrumbList(e.keyPath);
    this.updateTabData(e.key);
    this.setState({
      selectedKeys: e.key
    });
    this.props.history.push(e.key)
  };
  updateTabData = (path) => {
    const oldTabs = [...this.state.tabData];
    const exit = oldTabs.some(v => v.path === path);
    oldTabs.map(v => v.choose = false);
    if (!exit) {
      const newTab = {
        path,
        title: this.crumbObj[path],
        choose: true
      };
      this.setState({
        tabData: [...oldTabs, newTab]
      })
    } else {
      const index = oldTabs.findIndex((v) => v.path === path);
      oldTabs[index].choose = true;
      this.setState({
        tabData: oldTabs
      })
    }
  };
  //点击切换tab
  clickTab = (path) => {
    const oldTabs = [...this.state.tabData];
    oldTabs.map(v => v.choose = false);
    const index = oldTabs.findIndex((v) => v.path === path);
    oldTabs[index].choose = true;
    this.initCrumbList(path);
    this.setState({
      tabData: oldTabs,
      selectedKeys: path
    });
    this.props.history.push(path)
  };
  //点击关闭tab
  closeTab = (path) => {
    const oldTabs = [...this.state.tabData];
    const index = oldTabs.findIndex(v => v.path === path);
    //关闭正选中的标签
    if (oldTabs[index].choose) {
      let newIndex = index;
      oldTabs.splice(index, 1);
      if (index === oldTabs.length) {
        newIndex = index - 1;
      }
      oldTabs.map(v => v.choose = false);
      oldTabs[newIndex].choose = true;
      const newPath = oldTabs[newIndex].path;
      this.initCrumbList(newPath);
      this.setState({
        tabData: oldTabs,
        selectedKeys: newPath
      });
      this.props.history.push(newPath)
    } else {
      //关闭其他标签
      oldTabs.splice(index, 1);
      this.setState({
        tabData: oldTabs,
      })
    }
  };

  openSubRoute = (e) => {
    this.setState({
      openKeys: e
    })
  };
  //渲染菜单路径标签
  renderBreadcrumb = (arr) => {
    return <Breadcrumb>
      {arr.map((v, i) => <Breadcrumb.Item key={i}>{v}</Breadcrumb.Item>)}
    </Breadcrumb>
  };
  //修改密码弹窗
  showPsModal = () => {
    this.psModal.visible()
  };

  changePassword = async () => {
    const res = await get('/usdi/account/list');
    if (res.success) {
      message.success('修改成功，请重新登录');
      this.props.configStore.changeConfig({});
      sessionStorage.removeItem('accountInfo');
      this.props.history.push('/login');
      return true
    } else {
      message.error(res.msg)
    }
  };
  logOut = () => {
    this.props.configStore.changeConfig({});
    sessionStorage.removeItem('accountInfo');
    this.props.history.push('/login')
  };
  //默认重定向路径
  getDefaultRoute = (config) => {
    let defaultRoute = '/';
    if (!config[0].children) {
      defaultRoute = config[0].value
    } else {
      defaultRoute = config[0].children[0].value
    }
    return defaultRoute
  };

  render() {
    if (!this.props.configStore.tokenId) {
      this.props.history.push('/login');
      return null
    }
    const {collapsed, selectedKeys, openKeys, crumb, tabData} = this.state;
    const dropMenu = (
      <Menu>
        {/*<Menu.Item onClick={this.showPsModal}>
          <Icon type='setting'/>修改密码
        </Menu.Item>*/}
        <Menu.Item onClick={this.logOut}>
          <Icon type='logout'/>退出
        </Menu.Item>
      </Menu>
    );
    const accountInfo = JSON.parse(sessionStorage.getItem('accountInfo')) || {};
    // this.menuConfig = accountInfo.menuConfig || [];
    this.menuConfig = config || [];
    return (
      <div className='menu-bar'>
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
            <div className="logo">
              <img src={logo} alt=""/>
              {!collapsed ? <span>NULS链工厂-后台管理系统</span> : null}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onOpenChange={this.openSubRoute}
              onClick={this.changeRoute}
            >
              {this.renderMenuItem(this.menuConfig)}
            </Menu>
          </Sider>
          <Layout>
            <Header>
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              {this.renderBreadcrumb(crumb)}
              <Dropdown className='fr click' overlay={dropMenu}>
                <span>
                  <Avatar style={{backgroundColor: '#87d068'}} icon="user"/>
                  {accountInfo.userName}
                </span>
              </Dropdown>
            </Header>
            <TabRoute tabData={tabData}
                      clickTab={this.clickTab}
                      closeTab={this.closeTab}
            />
            <Content>
              {/*<a onClick={()=>this.props.history.push('/')}>ss</a>*/}
              <RenderRoute config={this.menuConfig}
                           currentPath={selectedKeys}
                           redirectPath={this.getDefaultRoute(this.menuConfig)}
              />
            </Content>
          </Layout>
        </Layout>
        <PasswordModal wrappedComponentRef={(v) => this.psModal = v} confirm={this.changePassword}/>
      </div>
    );
  }
}

export default MenuBar
