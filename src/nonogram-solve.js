const getRowsFromLimit = function(limit, total) {
  const rec = function(box, ball) {
    if (box === 1) {
      return [ball];
    } else {
      const tmpArr = [];
      for (let i = 0; i <= ball; i ++) {
        const tmpRec = rec(box - 1, ball - i);
        for (let j = 0; j != tmpRec.length; j ++) {
          tmpArr.push([i].concat(tmpRec[j]));
        }
      }
      return tmpArr;
    }
  }

  const freeBlock = total - limit.reduce((acc, cur) => acc + cur) - (limit.length - 1);
  const box = limit.length + 1;

  const blankCntArr = rec(box, freeBlock);

  const tmpRes = [];
  for (let i = 0; i != blankCntArr.length; i ++) {
    const tmpBlankCnt = blankCntArr[i];
    let tmpRow = [];
    for (let j = 0; j != limit.length; j ++) {
      if (j !== 0) {
        tmpRow.push(-1);
      }
      const tmpBlank = new Array(tmpBlankCnt[j]).fill(-1);
      const tmpBlock = new Array(limit[j]).fill(1);
      tmpRow = tmpRow.concat(tmpBlank).concat(tmpBlock);
    }
    const tmpBlank = new Array(tmpBlankCnt[limit.length]).fill(-1);
    tmpRow = tmpRow.concat(tmpBlank);
    if (tmpRow.length !== total) {
      throw("arr length error", limit, total, tmpRow);
    }
    tmpRes.push(tmpRow);
  }
  return tmpRes;
};

const check = function(tmpRes, colLimit) {
  for (let j = 0; j !== colLimit.length; j ++) {
    const limitArr = colLimit[j];
    let limitIdx = 0;

    const getLimit = function() {
      if (limitIdx >= limitArr.length) {
        return -1;
      }
      const tmpLimit = limitArr[limitIdx];
      limitIdx ++;
      return tmpLimit;
    }

    // 加一个特殊的限制-1，用来限制再往下不能再有任何的block
    let target = getLimit();
    let curr = 0;
    for (let i = 0; i != tmpRes.length; i ++) {
      // console.log("check char", target, curr, i, j, tmpRes[i][j]);
      if (tmpRes[i][j] === -1) {
        if (curr === 0) {
          continue;
        } else if (curr === target) {
          target = getLimit();
          curr = 0;
          continue;
        } else if (target === -1) {
          continue;
        } else {
          return false;
        }
      } else if (tmpRes[i][j] === 1) {
        if (target === -1) {
          return false;
        } else if (curr === target) {
          return false;
        } else {
          curr ++;
          continue;
        }
      } else {
        throw("unknown res char");
      }
    }
  }
  return true;
};

/**
 * @brief 每次调用加一行，采用DFS，如果check不过就剪枝
 * @param {*} tmpRes 加一行之前的结果
 * @param {*} rows 还未加的行，二维数组，第一个下标表示未加的行，第二个下标表示的是根据行的限制，一行的所有可能情况
 * @param {*} colLimit 列的限制，需要传给check函数
 * @returns 检查成功则返回递归结果，递归最后一次返回完整答案，检查失败返回false，及时剪枝
 */
const addRow = function(res, rows, colLimit) {
  const tmpRes = res;
  if (!check(tmpRes, colLimit)) {
    return false;
  }
  if (rows.length === 0) {
    return tmpRes;
  }
  const tmpRows = rows.shift();
  for (let i of tmpRows) {
    tmpRes.push(i);
    const addRes = addRow(tmpRes, rows, colLimit);
    if (addRes) {
      return addRes;
    }   
    tmpRes.pop();
  }
  rows.unshift(tmpRows);
  return false;
}

const calcRes = function(rowsLimit, colsLimit) {
  // 二维数组，0代表未定义，1代表涂颜色，-1代表不应该涂颜色
  const tmpRes = [];
  const rows = [];
  for (let i of rowsLimit) {
    rows.push(getRowsFromLimit(i, colsLimit.length));
  }
  return addRow(tmpRes, rows, colsLimit);
}

export default calcRes;
