<template>
  <div id="app">
    <div class="topInput">
      行数：<input v-model="rowNum"/> 
      列数：<input v-model="colNum"/><br/>
      <br/>
      行的限制用空格分隔，列的限制用回车分隔，不对异常输入做校验
      <br/>
    </div>
    <div class="content">
      <div class="colLimitLine">
        <div class="textAreaWrapper" v-for="(item, index) in colNum" :key="index">
          <textarea v-model='colLimit[index]'/>
        </div>
        <div style="clear: both;"></div>
      </div>

      <div class="rowLine" v-for="(item, x) in rowNum" :key="x">
        <div class="rowLimitInputWrapper">
          <input v-model="rowLimit[x]"/>
        </div>
        <div class="answerItem" v-for="(_, y) in colNum" :key="y" :class="{'block': res && res[x] && res[x][y] && res[x][y] === 1}">
        </div>
      </div>
      
    </div>
    <div class="bottom">
      <button @click="doSolve">提交</button><br/>
      {{ extraMsg }}
    </div>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import calcRes from "./nonogram-solve";

export default {
  name: 'app',
  data() {
    return {
      rowNum: 5,
      colNum: 5,

      res: [],
      rowLimit:[],
      colLimit:[],

      extraMsg: "",

    };
  },
  methods: {
    doSolve() {
      const ts1 = new Date().getTime();
      const rowsLimit = [];
      const colsLimit = [];

      for (let i = 0; i != this.rowNum; i ++) {
        const tmpRowLimit = this.rowLimit[i];
        if (tmpRowLimit) {
          const tmpArr = tmpRowLimit.split(" ");
          tmpArr.forEach((element, idx, arr) => {
            arr[idx] = parseInt(element);
          });
          rowsLimit.push(tmpArr);
        } else {
          rowsLimit.push([]);
        }
      }

      for (let i = 0; i != this.colNum; i ++) {
        const tmpColLimit = this.colLimit[i];
        if (tmpColLimit) {
          const tmpArr = tmpColLimit.split("\n");
          tmpArr.forEach((element, idx, arr) => {
            arr[idx] = parseInt(element);
          });
          colsLimit.push(tmpArr);
        } else {
          colsLimit.push([]);
        }
      }

      console.log(rowsLimit, colsLimit);

      try {
        const res = calcRes(rowsLimit, colsLimit);
        this.res = res;
        console.log(res);
      } catch(e) {
        console.debug("calcRes error", e);
        throw(e);
      }

      const ts2 = new Date().getTime();

      this.extraMsg = "本次计算共耗时：" + (ts2 - ts1) + "ms";
      return true;
    },
  },
  watch: {
    rowNum() {
      if (typeof this.rowNum === "string") {
        this.rowNum = parseInt(this.rowNum);
      }
    },
    colNum() {
      if (typeof this.colNum === "string") {
        this.colNum = parseInt(this.colNum);
      }
    }
  }
}
</script>

<style>
html {
  box-sizing: border-box;
}
#app {

}

.content {
  margin: 10px 0;
}

.textAreaWrapper {
  float: left;
  width: 26px;
  padding: 0 2px;
}

.textAreaWrapper > textarea {
  width: 22px;
  min-height: 60px;
  border: 1px solid #999999;
}

.colLimitLine {
  padding-left: 80px;
  height: auto;
}

.rowLine {
  height: 30px;
}

.rowLimitInputWrapper {
  width: 80px;
  height: 100%;
  float: left;
}

.rowLimitInputWrapper > input {
  width: 60px;
  margin-top: 5px;
}

.answerItem {
  width: 28px;
  height: 28px;
  float: left;
  border: 1px solid #bbbbbb;
}

.block {
  background-color:dodgerblue;
}
</style>
