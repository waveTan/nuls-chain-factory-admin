import React, {Component} from 'react';
import E from 'wangeditor'
import './index.less'
import {Form, Input, Upload, Icon, message, Select, Button, AutoComplete,} from 'antd';
import {get, post} from 'utils/request'
const { Option } = Select

let id = 0;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class EditGoods extends Component {
  state = {
    groupingData: [],//商品分组列表
    confirmDirty: false,
    autoCompleteResult: [],
    loading: false,
  };

  componentDidMount() {
    this.initEditor();
    this.getGroupList();
  }

  /**
   * @disc: 获取分组列表
   * @date: 2020-01-09 13:48
   * @author: Wave
   */
  getGroupList = async () => {
    const url = '/api/goods/group/list';
    const res = await get(url);
    //console.log(res);
    if (res.data.success) {
      let newData = [];
      for (let item of res.data.result) {
        newData.push(<Option key={Number(item.id)}>{item.name}</Option>);
      }
      this.setState({groupingData: newData});
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
        const {keys, specification, price, ...rest} = values;
        const specificList = [];
        keys.map(v => {
          specificList.push({
            specificName: specification[v],
            price: Number(price[v])
          })
        });
        const newVal = {...rest, specificList};
        for (let item in newVal.term) {
          newVal.term[item] = Number(newVal.term[item])
        }
        //console.log(newVal, '---newVal');
        let parameter = {
          "goodsName": newVal.goodsName,
          "picUrl": "url for pic",
          "linePrice": Number(newVal.linePrice),
          "term": newVal.groupIndexList,
          "version": newVal.version,
          "trialUrl": "url for tria",
          "groupIndexList": newVal.term,
          "specificList": newVal.specificList
        };
        const url = '/api/goods/add';
        const res = await post(url, parameter);
        //console.log(res);
        if (res.data.success) {
          let url = '/goods/goodsList';
          this.props.history.push(url);
        } else {
          message.error(JSON.stringify(res.data))
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
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  /**
   * @disc: 删除规格与价格
   * @date: 2020-01-09 16:58
   * @author: Wave
   */
  remove = k => {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  /**
   * @disc: 添加规格与价格
   * @date: 2020-01-09 16:58
   * @author: Wave
   */
  add = () => {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    form.setFieldsValue({
      keys: nextKeys,
    });
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
    let url = "http://192.168.1.160";
    editor.customConfig.uploadImgServer = url + '/fileclient-management/api/uploadpic';
    //editor.customConfig.uploadImgServer = utils.url + '/fileclient-management/api/uploadpic';
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      console.log(files);
      if (files[0]) {
        const formData = new window.FormData();
        formData.append('file', files[0], 'cover.jpg');
        fetch(url + '/fileclient-management/api/uploadpic', {
          method: 'POST',
          body: formData
        }).then((res) => {
          return res.json()
        }).then((res) => {
          const data = res.resultData;
          if (data) {
            // 上传代码返回结果之后，将图片插入到编辑器中
            insert(data.resourceUrl)
          } else {
            console.log(data.msg)
          }
        })
      } else {
        message.info('請選擇要上傳的圖片')
      }
    };
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      // 'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ];
    editor.customConfig.lang = {
      "设置标题": "Title",
      '字号': 'Size',
      '文字颜色': 'Color',
      '设置列表': 'List',
      '有序列表': '',
      '无序列表': '',
      '对齐方式': 'Align',
      '靠左': '',
      '居中': '',
      '靠右': '',
      '正文': 'p',
      '链接文字': 'link text',
      '链接': 'link',
      '上传图片': 'Upload',
      '网络图片': 'Web',
      '图片link': 'image url',
      '插入视频': 'Video',
      '格式如': 'format',
      '上传': 'Upload',
      '创建': 'init'
    };
    editor.create();
  }

  render() {

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const {imageUrl} = this.state;
    const {getFieldDecorator, getFieldValue} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    getFieldDecorator('keys', {initialValue: [0]});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div required={false} key={k}>
        <Form.Item label={'规格' + index} className="row0">
          {getFieldDecorator(`specification[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{required: true, whitespace: true, message: "请输入规格"},],
          })(<Input placeholder="请输入规格" style={{width: '90%', marginRight: 8}}/>)}
        </Form.Item>
        <Form.Item label={'价格' + index} className="row0">
          {getFieldDecorator(`price[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{required: true, whitespace: true, message: "请输入价格"},],
          })(<Input placeholder="请输入价格" style={{width: '80%', marginRight: 8}}/>)}
          {keys.length <= 1 ? (
            <Icon className="plus" type="plus-circle-o" onClick={() => this.add()}/>
          ) : null}
          {keys.length >= 2 ? (
            <span>
            <Icon className="minus" type="minus-circle-o" onClick={() => this.remove(k)}/>
            <Icon className="plus" type="plus-circle-o" onClick={() => this.add()}/>
          </span>
          ) : null}
        </Form.Item>
      </div>
    ));

    return (
      <div className="edit_goods">
        <p className="title">新增商品</p>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} className="add_form">
          <div className="module0">
            <div className="fl">
              <Form.Item label="商品名称" className="row0">
                {getFieldDecorator('goodsName', {rules: [{required: true, message: '请输入商品名称'}]})(<Input/>)}
              </Form.Item>
              <Form.Item label="商品分组" className="row0">
                {getFieldDecorator('term', {rules: [{required: true, message: '请选择商品分组'}]})
                (
                  <Select mode="multiple" size="default" placeholder="请选择商品分组" style={{width: '100%'}}>
                    {this.state.groupingData}
                  </Select>
                )
                }
              </Form.Item>
              <Form.Item label="划线价" className="row0">
                {getFieldDecorator('linePrice', {rules: [{required: true, message: '请输入划线价',},],})(<Input/>)}
              </Form.Item>
              <Form.Item label="开发团队" className="row0">
                {getFieldDecorator('groupIndexList', {rules: [{required: true, message: '请输入开发团队',},],})(<Input/>)}
              </Form.Item>
            </div>
            <div className="fr">
              <Form.Item label="商品图片" className="row0">
                <Upload name="avatar" listType="picture-card" className="avatar-uploader" showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload} onChange={this.handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                </Upload>
              </Form.Item>
              <Form.Item label="当前版本" className="row0">
                {getFieldDecorator('version', {rules: [{required: true, message: '请输入当前版本'}]})(<Input/>)}
              </Form.Item>
              <Form.Item label="试用链接" className="row0">
                {getFieldDecorator('trialUrl', {rules: [{required: true, message: '请输入试用链接'}]})(<Input/>)}
              </Form.Item>
            </div>
          </div>

          <div className="module2">
            <div className="title">规格与价格</div>
            <div className="input">
              {formItems}
            </div>
          </div>

          <div className="module3">
            <div ref='editorElem' style={{textAlign: 'left'}}/>
          </div>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              确认提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({name: 'register'})(EditGoods);
