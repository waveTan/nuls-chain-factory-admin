import loadable from '@loadable/component'

const DataOverview = loadable(() => import('page/dashBoard/dataOverview'));
const GoodsList = loadable(() => import('page/goods/goodsList'));
const EditGoods = loadable(() => import('page/goods/editGoods'));
const GoodsGrouping = loadable(() => import('page/goods/goodsGrouping'));
const OrdersList = loadable(() => import('page/orders/ordersList'));
const AccountManage = loadable(() => import('page/systemManage/accountManage'));

const config = [
  {
    title: '数据看板',
    icon: 'dashboard',
    value: 'dashBoard',
    children: [
      {
        title: '数据概览',
        value: '/dashBoard/dataOverview',
        component: DataOverview
      },
    ]
  },
  {
    title: '商品管理',
    icon: 'gold',
    value: 'goods',
    children: [
      {
        title: '商品信息',
        value: '/goods/goodsList',
        component: GoodsList,
      },
      {
        title: '新增商品',
        value: '/goods/editGoods',
        hide:true,
        component: EditGoods,
      },
      {
        title: '商品分组',
        value: '/goods/goodsGrouping',
        component: GoodsGrouping,
      },
    ]
  },
  {
    title: '订单管理',
    icon: 'hdd',
    value: 'orders',
    children: [
      {
        title: '订单信息',
        value: '/orders/ordersList',
        component: OrdersList
      },
    ]
  },
  {
    title: '系统管理',
    icon: 'setting',
    value: 'systemManage',
    children: [
      {
        title: '账号管理',
        value: '/systemManage/accountManage',
        component: AccountManage
      },
    ]
  },
];

export default config
