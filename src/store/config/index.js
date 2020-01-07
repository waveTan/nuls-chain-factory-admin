import {observable, action} from "mobx";

const configInfo = JSON.parse(sessionStorage.getItem('accountInfo')) || {};

class config {
  @observable
  tokenId = configInfo.tokenId || '';

  @action changeConfig(item = {}) {
    this.tokenId = item.tokenId;
  }
}

export default config
