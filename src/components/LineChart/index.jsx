import React, {Component,PureComponent} from 'react';
import PropTypes from 'prop-types'
import {Spin} from "antd";
import { throttle } from "utils/util";

//按需引入需要的echarts模块，减少打包体积
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

class LineChart extends PureComponent {
  componentDidMount() {
    this.initChart()
    window.addEventListener('resize',throttle(this.resize,200))
  }
  initChart = () => {
    this.chart = echarts.init(this.el);
    this.setOption(this.props)
  }
  setOption = (props) => {
    const options = this.getOption(props)
    if (options) {
      this.chart.setOption(options)
    }
  }
  resize = () => {
    this.chart && this.chart.resize();
  }
  componentWillReceiveProps(nextProps){
    const isEqual = JSON.stringify(this.props.data) === JSON.stringify(nextProps.data)
    if (!isEqual) {
      this.setOption(nextProps)
    }
  }
  componentWillUnmount() {
    this.dispose()
  }
  dispose = () => {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart=null;
    window.removeEventListener('resize', this.resize)
  }

  getOption(props) {
    if (!props.data.length) return
    let xAxisData = [], series = [], config = {};
    const columns = Object.keys(props.data[0]);
    columns.map((item,index)=>{
      if (columns.length<2) return;
      series.push({
        name: props.label[index-1],
        type:'line',
        data:[],
        smooth:true
      });
      props.data.map((v, i) => {
        if (index === 0) {
          xAxisData.push(v[item])
        } else {
          series[index].data.push(v[item]);
        }
      });
    });
    series = series.slice(1);
    config = {
      color: ['#01da9c', '#fd6983'],
      legend:{
        show: props.showLegend,
        left: 0,
        top: 0,
        padding: [0,10]
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisTick:{show:false}
      },
      yAxis: {
        type: 'value',
        axisLabel:{
          formatter: this.props.percent?'{value}%':'{value}'
        },
        axisTick:{show:false},
        axisLine:{show:false},
        splitLine:{
          lineStyle:{
            type:'dashed'
          }
        }
      },
      grid: {
        left: 0,
        bottom: 0,
        top: props.showLegend?'8%':'3%',
        right: 0,
        containLabel: true
      },
      tooltip:{
        trigger:'axis',
        formatter:(v)=>{
          let tmp = ''
          v.map(item=>{
            const val = props.percent ? item.value + '%' : item.value;
            tmp+=`<p>${props.label[item.seriesIndex]}: ${val}</p>`
          })
          return `<div>
                    <p>${v[0].name}</p>
                    ${tmp}
                </div>`
        },
        renderMode:'html',
        padding: [5,10]
      },
      series
    }
    return config
  }

  render() {
    const mask = {
      width: '100%',
      height: '100%',
      position: 'absolute',
      textAlign: 'center',
      paddingTop: '80px',
      background:'rgba(255,255,255,0.5)',
      zIndex:1
    }
    return (
      <div  className='line-chart' style={{position: 'relative',height:'400px'}}>
        {this.props.loading?<div style={mask}><Spin/></div>:null}
        <div ref={(v)=>this.el=v} id={this.id} style={{height:'100%'}}></div>
      </div>

    );
  }
}

LineChart.defaultProps = {
  height: '400px',
  loading: true,
  label: [],
  percent: false,
  data: [],
  showLegend:false
}

LineChart.propTypes = {
  height: PropTypes.string,
  loading: PropTypes.bool,
  label: PropTypes.array,
  percent: PropTypes.bool,
  data: PropTypes.array,
  showLegend: PropTypes.bool
}

export default LineChart;