import React from 'react';
export default function (componentFactory) {
  class AsyncComponent extends React.Component {
    constructor() {
      super();
      this.state = {component: null};
    }
    async componentDidMount() {
      //防止组件销毁时存在异步操作之后执行setState造成内存泄露
      this._isMounted = true;
      let {default: component} = await componentFactory();
      if (this._isMounted) {
        this.setState({component});
      }
    }
    componentWillUnmount() {
      this._isMounted = false
    }
    render() {
      let Comp = this.state.component;
      return Comp ? <Comp {...this.props}/> : null;
    }
  }
  return AsyncComponent;
}
