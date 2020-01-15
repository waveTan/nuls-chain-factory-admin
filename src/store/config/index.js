import { observable, action, toJS, configure } from "mobx";
configure({ enforceActions: "observed" }); //开启严格模式，必须使用action来改变可观察对象

const configInfo = JSON.parse(sessionStorage.getItem("accountInfo")) || {};
class config {
  @observable
  tokenId = configInfo.tokenId || "";
  @observable
  routeInfo = {};
  @observable
  breadCrumb = [];
  @observable
  selectKey = "";
  @observable
  tabData = [];
  @observable
  toPath = "";
  @action changeConfig(item = {}) {
    this.tokenId = item.tokenId;
  }
  @action initRouteInfo(routes = []) {
    this.getRouteInfo(routes);
  }
  getRouteInfo(routes) {
    routes.map(route => {
      this.routeInfo[route.value] = {
        title: route.title,
        selectKey: route.parent || route.value
      };
      if (route.children) {
        this.getRouteInfo(route.children);
      }
    });
  }

  @action changeRoute = path => {
    if (path === "/login") return;
    if (path.indexOf("?") > -1) {
      this.routeInfo[path] = this.routeInfo[path.split("?")[0]];
    }
    this.changeSelectKey(path);
    this.changeBreadCrumb(path);
    this.updateTabData(path);
  };

  changeSelectKey(path) {
    this.selectKey = this.routeInfo[path].selectKey;
  }
  changeBreadCrumb(path) {
    this.breadCrumb = [];
    let crumbList = [];
    const urlList = path.split("/").filter(i => i);
    for (let i = 0; i < urlList.length - 1; i++) {
      crumbList.push(urlList[i]);
    }
    crumbList.push(path);
    crumbList.map(v => {
      if (this.routeInfo[v]) {
        this.breadCrumb.push(this.routeInfo[v].title);
      }
    });
  }
  updateTabData(path) {
    const oldTabs = [...this.tabData];
    const exit = oldTabs.some(v => v.path === path);
    oldTabs.map(v => (v.choose = false));
    if (!exit) {
      const newTab = {
        path,
        title: this.routeInfo[path].title,
        choose: true
      };
      this.tabData = [...oldTabs, newTab];
    } else {
      const index = oldTabs.findIndex(v => v.path === path);
      oldTabs[index].choose = true;
      this.tabData = oldTabs;
    }
  }
  @action closeTab = path => {
    const oldTabs = [...this.tabData];
    const index = oldTabs.findIndex(v => v.path === path);
    //关闭正选中的标签
    if (oldTabs[index].choose) {
      let newIndex = index;
      oldTabs.splice(index, 1);
      if (index === oldTabs.length) {
        newIndex = index - 1;
      }
      oldTabs.map(v => (v.choose = false));
      oldTabs[newIndex].choose = true;
      const newPath = oldTabs[newIndex].path;
      this.tabData = oldTabs;
      this.changeSelectKey(newPath);
      this.changeBreadCrumb(newPath);
      this.toPath = newPath;
    } else {
      //关闭其他标签
      oldTabs.splice(index, 1);
      this.tabData = oldTabs;
      this.toPath = "";
    }
  };
  @action clearLoginInfo() {
    this.tokenId = "";
    this.routeInfo = {};
    this.tabData = [];
    this.selectKey = "";
    this.breadCrumb = [];
    this.toPath = "";
  }
  @action forceUpdateBread(breadCrumb) {
    this.breadCrumb = breadCrumb
  }
}

export default config;
