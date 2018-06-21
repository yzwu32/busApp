<template>
  <div>
      <div class="go-back" v-show="goBackState" @click="goBack">返回</div>
      <iframe v-show="iframeState" id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src=""></iframe>
      <div v-show="!iframeState">
        <form v-on:submit.prevent>
          <input class="addinput" required placeholder="输入地址" v-model="roadname"/>
          <input class="lineinput" required placeholder="输入公交线路" v-model="roadline"/>
          <button class="submit bgcol ih40" @click="searchBus">查询</button>
        </form>
        <div class="hotAddress">
          <div>常用路线:</div>
          <a href="http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=pt084" target="showHere" @click="showIframe('http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=pt084')">724古浪→家乐福</a>
          <a href="http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=pt267" target="showHere" @click="showIframe('http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=pt267')">724家乐福→古浪</a>
          <a href="http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=pt227" target="showHere" @click="showIframe('http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=pt227')">727祁连→百联</a>
        </div>
        <div :style="{margin:'10px 0',fontSize:'16px',color:'red'}">下方请注意方向</div>
        <div class="tabList">
          <li :class="{actived:tabName==item}" v-for="item in dicTo" :key="item"><span  @click="tab(item)">往{{item}}开</span></li>
        </div>
        <div>
          <ul v-for="(item,index) in lineInfo" :key="index" class="searchlist"  v-show="item.PathDirection==tabName">
            <li><a :href="links+item.stopid" target="showHere" @click="showIframe(links+item.stopid)">
              <span class="first">{{item.StationName}}</span> 
              <div>
                <span>{{item.lineList}}</span> 
              </div>
              </a>
            </li>
          </ul>
          <div v-if="lineInfo==null" :style="{paddingTop:'10px'}">没有数据！</div>
        </div>
      </div>
       <loading v-show="fetchLoading"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import loading from './Loading';
export default {
  name: 'BusSeach',
  data () {
    return {
      fetchLoading:false,
      links:"http://webapp.shbustong.com:56008/MobileWeb/ForecastChange.aspx?stopid=",
      roadname:'',
      roadline:'',
      lineInfo:null,
      iframeState:false,
      goBackState:false,
      dicTo:[],
      tabName:'',
      refuchLinks:'',
      setV:null
    }
  },
  components: {
		loading,
	},
  created:function(){
    
  },
  mounted:function(){
    const oIframe = document.getElementById('show-iframe');
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    oIframe.style.width = deviceWidth + 'px';
    oIframe.style.height = deviceHeight + 'px';
  },
  methods:{
      tab:function(name){
        this.tabName = name;
      },
      searchBus:function(){
        if(this.roadname!=""||this.roadline!="")
        {
          this.fetchLoading=true;
          axios.get("http://api32.imwork.net:10250/MobileWeb/Handler.ashx?Method=station&roadname="+this.roadname+"&roadline="+this.roadline,
          {'Content-Type': 'application/x-www-form-urlencoded'}
          )
          .then(response=>{
            this.fetchLoading=false;
            //console.log(JSON.parse(response.request.response).data);
            this.lineInfo=JSON.parse(response.request.response).data;
            let newArr=[];
            for(let item in this.lineInfo){
              newArr.push(this.lineInfo[item].PathDirection)
            }
            this.dicTo= Array.from(new Set(newArr))
            this.tabName=this.dicTo[0];
          })
          .catch(error=>{
            console.log(error);
            alert("网络错误!")
            this.fetchLoading=false;
          })

        }
      },
      goBack(){
      this.goBackState = false;
      this.iframeState = false;
      document.getElementById('show-iframe').src="";
      clearInterval(this.setV);
      },
      showIframe(refuchLinks){
        var that=this;
        this.fetchLoading=true;
        setTimeout(function(){
          that.fetchLoading=false;
        },500)
        window.scrollTo(0,0);
        this.goBackState = true;
        this.iframeState = true;
        if(refuchLinks){
          if(this.setV){
            clearInterval(this.setV);
          }
          this.setV=setInterval(function(){
            document.getElementById('show-iframe').src=refuchLinks;
          },60000)
        }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss"  scoped>
.tabList{
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  li{
    border: 1px solid #ccc;
    display: block;
    width: 100%;
    line-height: 3rem;
    span{
      display: block;
      width: 100%;
      font-size: 0.5rem;
    }
  }
  .actived{
      background: #00b3ee;
      color: #fff;
    }
}
input{ width: 100%;height: 3rem; margin-bottom: 5px; padding-left: 10px; font-size: 16px; box-sizing: border-box;}
.go-back{position: fixed; font-size: 16px; width: 100%; background:#00b3ee; line-height: 3rem; color: #fff;}
button{ width: 100%; height: 3rem;}
.searchlist li{
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  text-align: left;
  width: 100%;
  font-size: 0.9rem;
  float: left;
  list-style-type: none;
  a{
    display: block;
    padding: 10px;
    background: #fff;
    :active{background-color: #00b3ee;}
  }
  span{ padding-left: 5px;}
  .first{color:#00b3ee!important;}
  div{font-size: 0.8rem;}
 }
 #show-iframe{
   position: fixed;
   left: 0;
   top:3rem;
 }
.hotAddress{
  padding:0 3px;
  text-align: left;
  overflow: hidden;
  padding-top: 10px;
  a{ border-radius: 4px; float: left; line-height: 2rem; display:block; font-size: 12px; margin-right: 6px; background:#f2f2f2 ;padding: 2px 6px;}
}
</style>
