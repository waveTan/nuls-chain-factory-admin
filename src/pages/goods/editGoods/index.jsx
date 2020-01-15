import React, { Component } from "react";
import E from "wangeditor";
import "./index.less";
import {
  Form,
  Input,
  Upload,
  Icon,
  message,
  Select,
  Button
} from "antd";
import axios from 'axios'
import { get, post } from "utils/request";
const { Option } = Select;
const qs = require("querystring");
import {observer, inject} from "mobx-react";
const OSS = require("ali-oss")
import filerXSS from "../../../utils/xss"

let id = 0;
function getBase64(img, callback) {
  const reader = new FileReader();
  console.log(reader, '-=-=readrerrr')
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只支持jpg/png格式图片");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片大小不能超过2MB!");
  }
  return isJpgOrPng && isLt2M;
}

@Form.create({ name: "register" })
@inject("configStore")
@observer
class EditGoods extends Component {
  constructor(props) {
    super(props);
    const search = this.props.location.search;
    if (search) {
      this.goodsId = qs.parse(search.split("?")[1]).id;
      this.props.configStore.forceUpdateBread(["商品管理", "编辑商品"])
    }
    this.state = {
      groupingData: [], //商品分组列表
      confirmDirty: false,
      autoCompleteResult: [],
      loading: false,
      imageUrl: "",
      defaultGoods: {},
      specificListKeys: [0]
    };
  }

  componentDidMount() {
    this.initEditor();
    this.getGroupList();
    if (this.goodsId) {
      this.getGoodsDetail()
    }
  }

  getGoodsDetail = async () => {
    const res = await get("/api/goods/get/"+this.goodsId);
    if (res.success) {
      this.editor.txt.html(res.data.result.detail);
      this.setState({
        defaultGoods: res.data.result,
        imageUrl: res.data.result.picUrl,
        specificListKeys: res.data.result.specificList.map((v,i)=>i)
      })
    }

  }
  /**
   * @disc: 获取分组列表
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  getGroupList = async () => {
    const url = "/api/goods/group/list";
    const res = await get(url);
    if (res.data.success) {
      let newData = [];
      for (let item of res.data.result) {
        newData.push(
          <Option key={Number(item.id)} value={item.id}>
            {item.name}
          </Option>
        );
      }
      this.setState({ groupingData: newData });
    }
  };

  /**
   * @disc: 确认提交
   * @params: e
   * @date: 2020-01-10 14:51
   * @author: Wave
   */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { keys, specification, price, ...rest } = values;
        const specificList = [];
        this.state.specificListKeys.map(v => {
          specificList.push({
            specificName: specification[v],
            price: Number(price[v])
          });
        });
        const newVal = { ...rest, specificList };

        newVal.groupIndexList.map(v => +v);
        newVal.linePrice = Number(newVal.linePrice);
        newVal.picUrl = this.state.imageUrl;
        console.log(this.editor.txt.html(), 'editor-text')  //富文本内容
        // console.log(this.editor.txt.text(), 'editor-text')
        newVal.detail = filerXSS(this.editor.txt.html());
        // console.log(this.editor.txt.html(),'1111111')
        // console.log(filerXSS(this.editor.txt.html()),'222222222')
        let url = "";
        if (this.goodsId) {
          newVal.id = +this.goodsId;
          url = "/api/goods/update";
        } else {
          url = "/api/goods/add";
        }
        console.log(newVal, "--newVal");
        const res = await post(url, newVal);
         if (res.data.success) {
          let url = "/goods/goodsList";
          this.props.history.push(url);
        } else {
          message.error(JSON.stringify(res.data));
        }
      }
    });
  };

  /**
   * @disc: 商品图片提交
   * @params: info
   * @date: 2020-01-10 14:51
   * @author: Wave
   */
  handleChange = info => {
    console.log(info,'info')
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      );
    }
  };
  antUpload = (file) => {
    /*if (!beforeUpload(file)) {
      return false
    }*/
    this.getImageUrl(file);
    return false
  }
  getImageUrl = async (file) => {
    const url = await this.handleUpload(file);
    if (url) {
      this.setState({
        imageUrl: url
      })
    } else {
      message.error("上传失败");
    }
  }

  /**
   * @disc: 删除规格与价格
   * @date: 2020-01-09 16:58
   * @author: Wave
   */
  remove = k => {
    const keys = this.state.specificListKeys;
    if (keys.length === 1) {
      return;
    }
    this.setState({
      specificListKeys: keys.filter(key => key !== k)
    })
  };

  /**
   * @disc: 添加规格与价格
   * @date: 2020-01-09 16:58
   * @author: Wave
   */
  add = () => {
    const keys = this.state.specificListKeys;
    const nextKeys = keys.concat(keys[keys.length-1]+1)
    this.setState({
      specificListKeys: nextKeys
    })
  };

  /**
   * @disc: 文本编辑器初始化设置
   * @date: 2020-01-09 16:59
   * @author: Wave
   */
  initEditor() {
    const elem = this.refs.editorElem;
    const editor = new E(elem);
    this.editor = editor;
    editor.customConfig.zIndex = 100;
    let url = "/test";
    editor.customConfig.uploadImgServer = url;
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.customUploadImg = async (files, insert) => {
      // files 是 input 中选中的文件列表
      console.log(files);
      if (files[0]) {
        const url = await this.handleUpload(files[0]);
        if (url) {
          insert(url);
        } else {
          message.error("上传失败");
        }
      }
    };
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      // 'fontName', // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      // 'backColor', // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      // "quote", // 引用
      // 'emoticon', // 表情
      "image", // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
   /* editor.customConfig.lang = {
      设置标题: "Title",
      字号: "Size",
      文字颜色: "Color",
      设置列表: "List",
      有序列表: "",
      无序列表: "",
      对齐方式: "Align",
      靠左: "",
      居中: "",
      靠右: "",
      正文: "p",
      链接文字: "link text",
      链接: "link",
      上传图片: "Upload",
      网络图片: "Web",
      图片link: "image url",
      插入视频: "Video",
      格式如: "format",
      上传: "Upload",
      创建: "init"
    };*/
    editor.create();
  }
  handleUpload = async (file) => {
    const res = await get("/api/oss");
    if (res.success) {
      const data = res.data;
      let config = {
        region: data.Region,
        secure: false,
        accessKeyId: data.AccessKeyId,
        accessKeySecret: data.AccessKeySecret,
        stsToken: data.SecurityToken,
        bucket: data.bucket
      }
      let fileFormat = (file.name).split("."),
        suffix = (fileFormat[fileFormat.length - 1]).toLowerCase(),
        saveFileName = "" + Date.now() + "." + suffix
      //if (!/(gif|jpg|jpeg|png|bmp|txt|p12|mp4|mp3|acc|ogg|wav)$/.test(suffix)) {
      //    return reject('文件格式非法')
      //}
      let option = {};
      let client = new OSS(config);
      const uploadRes = await client.multipartUpload(saveFileName, file, option);
      console.log(uploadRes, '---ssslll')
      if (uploadRes.res.status === 200 ) {
        return data.domain + "/" + uploadRes.name
      }
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { defaultGoods, imageUrl, specificListKeys } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const keys = specificListKeys;
    const formItems = keys.map((k, index) => (
      <div required={false} key={k}>
        <Form.Item label={"规格" + (index+1)} className="row0">
          {getFieldDecorator(`specification[${k}]`, {
            rules: [{ required: true, whitespace: true, message: "请输入规格" }],
            initialValue: defaultGoods.specificList&&defaultGoods.specificList[k] ? defaultGoods.specificList[k].specificName:""
          })(
            <Input
              placeholder="请输入规格"
              style={{ width: "90%", marginRight: 8 }}
            />
          )}
        </Form.Item>
        <Form.Item label={"价格" + (index+1)} className="row0">
          {getFieldDecorator(`price[${k}]`, {
            rules: [{ required: true, whitespace: true, message: "请输入价格" }],
            initialValue: defaultGoods.specificList&&defaultGoods.specificList[k] ? String(defaultGoods.specificList[k].price):""
          })(
            <Input
              placeholder="请输入价格"
              style={{ width: "80%", marginRight: 8 }}
            />
          )}
          {keys.length <= 1 ? (
            <Icon
              className="plus"
              type="plus-circle-o"
              onClick={() => this.add()}
            />
          ) : null}
          {keys.length >= 2 ? (
            <span>
              <Icon
                className="minus"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
              <Icon
                className="plus"
                type="plus-circle-o"
                onClick={() => this.add()}
              />
            </span>
          ) : null}
        </Form.Item>
      </div>
    ));
    return (
      <div className="edit_goods">
        <p className="title">
          {defaultGoods.id ? "编辑商品" : "新增商品"}
        </p>
        <Form
          {...formItemLayout}
          className="add_form"
        >
          <div className="module0">
            <div className="fl">
              <Form.Item label="商品名称" className="row0">
                {getFieldDecorator("goodsName", {
                  rules: [
                    {
                      required: true,
                      message: "请输入商品名称"
                    }
                  ],
                  initialValue: defaultGoods.goodsName
                })(<Input />)}
              </Form.Item>
              <Form.Item label="商品分组" className="row0">
                {getFieldDecorator("groupIndexList", {
                  rules: [{ required: true, message: "请选择商品分组" }],
                  initialValue: defaultGoods.id?defaultGoods.groupIndexList.map(v=>v.groupId):undefined
                })(
                  <Select
                    mode="multiple"
                    size="default"
                    placeholder="请选择商品分组"
                    style={{ width: "100%" }}
                  >
                    {this.state.groupingData}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="划线价" className="row0">
                {getFieldDecorator("linePrice", {
                  rules: [{ required: true, message: "请输入划线价" }],
                  initialValue: defaultGoods.linePrice
                })(<Input />)}
              </Form.Item>
              <Form.Item label="开发团队" className="row0">
                {getFieldDecorator("term", {
                  rules: [{ required: true, message: "请输入开发团队" }],
                  initialValue: defaultGoods.term
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="fr">
              <Form.Item label="商品图片" className="row0">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={this.antUpload}
                  // onChange={this.handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                      uploadButton
                    )}
                </Upload>
              </Form.Item>
              <Form.Item label="当前版本" className="row0">
                {getFieldDecorator("version", {
                  rules: [{ required: true, message: "请输入当前版本" }],
                  initialValue: defaultGoods.version
                })(<Input />)}
              </Form.Item>
              <Form.Item label="试用链接" className="row0">
                {getFieldDecorator("trialUrl", {
                  rules: [{ required: true, message: "请输入试用链接" }],
                  initialValue: defaultGoods.trialUrl
                })(<Input />)}
              </Form.Item>
            </div>
          </div>

          <div className="module2">
            <div className="title">规格与价格</div>
            <div className="input">{formItems}</div>
          </div>

          <div className="module3">
            <div ref="editorElem" style={{ textAlign: "left" }} />
          </div>

          <div className="btn-wrap">
            <Button type="primary" onClick={this.handleSubmit}>
              确认提交
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default EditGoods;
