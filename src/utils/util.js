import {BigNumber} from 'bignumber.js'

//10的N 次方
export function Power(arg) {
  let newPower = new BigNumber(10);
  return newPower.pow(arg);
}

//减法
export function Minus(nu, arg) {
  let newMinus = new BigNumber(nu);
  return newMinus.minus(arg);
}

//乘法
export function Times(nu, arg) {
  let newTimes = new BigNumber(nu);
  return newTimes.times(arg);
}

//加法
export function Plus(nu, arg) {
  let newPlus = new BigNumber(nu);
  return newPlus.plus(arg);
}

//除法
export function Division(nu, arg) {
  let newDiv = new BigNumber(nu);
  return newDiv.div(arg);
}

//数字除以精度系数
export function divisionDecimals(nu, decimals = 8) {
  let newNu = new BigNumber(Division(nu, Power(decimals)).toString());
  return newNu.toFormat().replace(/[,]/g, '');
}

// 数字乘以精度系数
export function timesDecimals(nu, decimals = 8) {
  let newNu = new BigNumber(Times(nu, Power(decimals)).toString());
  return Number(newNu);
}

export function superLong(string, leng) {
  if (string && string.length > 10) {
    return string.substr(0, leng) + "...." + string.substr(string.length - leng, string.length);
  } else {
    return string;
  }
}

export function throttle(fn, delay) {
  let wait = false;
  return function () {
    let that = this, args = arguments;
    if (!wait) {
      wait = true;
      setTimeout(function () {
        fn.apply(that, args);
        wait = false
      }, delay)
    }
  }
}

export function debounce(fn, delay) {
  let timer;
  return function () {
    let that = this, args = arguments;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(that, args);
      timer = null
    }, delay)
  }
}

/**
 * 根据约定的幂将数据还原
 * @param  obj  d:规定的小数位数,f:保留位数,full--有多少保留多少,p:是否转百分比
 */
export function transformNum(obj) {
  const {n = 0, d, f = 2, p = false} = obj;
  if (!d) return;
  if (p) {
    const x = Power(d - 2);
    return Division(n, x).toFixed(f) + '%'
  }
  const x = Power(d);
  if (f === 'full') return Number(Division(n, x));
  return Division(n, x).toFixed(f)
}
