import React, {Component} from 'react';
import './index.less'

class ChartSelect extends Component {
  state={
    timeArr:['周','月','年'],
    current:0
  }
  handleClick=(i)=>{
    if (this.state.current!==i) {
      this.setState({
        current: i
      })
      if (this.props.selectItem) {
        this.props.selectItem(i)
      }
    }
  }
  render() {
    const {timeArr,current} = this.state
    return (
      <div className='chart-select hidden'>
        <ul className='fr'>
          {
            timeArr.map((v,i)=>
              <li key={i} className={['fl click', current === i ? 'active-li' : ''].join(' ')} onClick={this.handleClick.bind(this,i)}>{v}</li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default ChartSelect;