//初始化ga

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52977512-11', 'auto');
ga('send', 'pageview' , '/');


//初始化fb
window.fbAsyncInit = function() {
  FB.init({
    appId      : '172517206543405',
    xfbml      : true,
    version    : 'v2.8'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//取得社團與貼文資料
setTimeout(function(){
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    console.log('Logged in.');
  }
  else {
    FB.login();

  }
  //取得社團資料
  FB.api('600360513469667?fields=id,name,description,link,venue,docs,feed&locale=zh_TW', 'get',function(response) {
     console.log(response);
     fbdata=response;
     Vue.set(vm,"fd",response);
  });
  //使用遞迴取得特定貼文中paging下一頁之資料
  function add_proj_response(key,obj,nxurl){
    FB.api(nxurl,'get',function (response){
      for( var i=0;i<response.data.length;i++){
        obj.data.push(response.data[i]);
      }
      var nxurl_temp=response.paging.next;
      Vue.set(vm,key,obj);
      if (response.paging.next){
        add_proj_response(key,obj,nxurl_temp);
      }
    });
  }
  //載入特定專案 vm變數名稱/文章編號/儲存資料的陣列實體
  function load_proj(key,postid,obj){
    FB.api(postid+'?fields=comments&pretty=0&limit=100&locale=zh_TW','get',function (response){
      obj=response.comments;
      Vue.set(vm,key,obj);
      url=response.comments.paging.next;
      var nxurl=url.split("2.8/")[1];
      
      add_proj_response("proj1",obj,nxurl);
    });
  }
  
  load_proj("proj1","600361653469553",comments);
  load_proj("proj2","602543423251376",comments2);
  load_proj("proj3","614003255438726",comments3);
 

  // FB.login(function(){
  //   // Note: The call will only work if you accept the permission request
  //   FB.api('/me/feed', 'post', {message: 'Hello, world!'});
  // }, {scope: 'publish_actions'});
});
  
},500);
//# sourceURL=pen.js

var fbdata={feed:{data:[]}};
var comments={comments:{data:[]}};
var comments2={comments:{data:[]}};
var comments3={comments:{data:[]}};

//左側切換面板的導覽列
Vue.component("fieldswitch",{
  template: "<div><ul>\
              <li @click='sw(\"club\")' :class='[page==\"club\"?\"active\":\"\"]'>FB討論社團</li>\
              <li @click='sw(\"proj1\")' :class='[page==\"proj1\"?\"active\":\"\"]'>Project.1 名片 ({{pjnum[0]}}件)</li>\
              <li @click='sw(\"proj2\")' :class='[page==\"proj2\"?\"active\":\"\"]'>Project.2 視覺規範 ({{pjnum[1]}}件)</li>\
              <li @click='sw(\"proj3\")' :class='[page==\"proj3\"?\"active\":\"\"]'>Project.3 天氣盒子 ({{pjnum[2]}}件)</li>\
              <li @click='sw(\"to_hahow_course_page\")' > 前往課程頁面</li>\
              <li @click='sw(\"to_fb_club_page\")' > 前往FB社團</li>\
              <li @click='sw(\"to_explain_hand_page\")' > 新增作品方式</li>\
              <br><chatpanel :messages='messages'/><br>\
            </ul></div>",
  methods:{
    sw: function(p){
      ga('send', 'pageview', "/"+p);
      console.log("ga log: "+"/"+p);
      if(p=="to_hahow_course_page"){
        window.open('https://hahow.in/cr/monoame-webdesign1');
        return 0;
      }else if(p=="to_fb_club_page"){
        window.open('https://www.facebook.com/groups/600360513469667/');
        return 0;
      }else if(p=="to_explain_hand_page"){
        window.open('https://www.facebook.com/groups/600360513469667/permalink/632282303610821/');
        return 0;
      }
      vm.page=p;
    }
  },
  props: ["page","messages","pjnum"]
})
//每一個fbpost的組件(上層是fbpostpanel)
Vue.component("fbpost",{
  template: "<div class=fbpost  >\
                <p v-html='para'></p>\
                <h6>{{post.updated_time}}</h6>\
             </div>",
  props: ["post"],
  computed: {
    para: function(){
      return this.post.message.replace(/(?:\r\n|\r|\n)/g, "<br>");
    }
  }
})
//fb貼文總覽的群組組件(下層是fbpost)
Vue.component("fbpostpanel",{
  template: "<div class='col-sm-9'> \
                <div class='col-sm-12'><h3>FB社團po文節錄(調整中)</h3><hr></div>\
                <fbpost class='col-sm-12' v-for='p in posts' :post='p'> \
                </fbpost> \
            </div>",
  props: ["posts"]
});
//每一個專案的組件(上層是projpanel)
Vue.component("proj_post",{
  template: "<div v-show='filter_show'>\
                <div class=\"projpost\">\
                  <a :href='penurl' target='_blank' title='點擊前往作品codepen'><img :src='imgurl'></a>\
                  <div class=content_area>\
                    <p v-html='para'></p>\
                    <h6>{{post.created_time}}</h6>\
                  </div>\
                </div>\
             </div>",
  props: ["post","filter","d_size"],
  data: {
    expand: function(){return false;}
  },
  computed: {

    para: function(){
      return "<a href=\"https://www.facebook.com/"+this.post.from.id+"\" target='_blank'> ["+this.post.from.name+"]</a>: "+this.post.message.replace(/(?:\r\n|\r|\n)/g, "<br>");
    },
    ap: function(){
        const regex = /[^i\/][^o\/]\/([a-zA-Z0-9\_]{6})/g;
        const regex2= /io\/.*?([a-zA-Z0-9\_]*)/g;
        var str = this.post.message; 
        var res = str.match(regex)[0].substr(3);
        var res2=str.match(regex2)[0].substr(3);
        return [res,res2];

    },
    imgurl: function(){
      const regex = /[^i\/][^o\/]\/([a-zA-Z0-9\_]{6})/g;
      const regex2= /io\/.*?([a-zA-Z0-9\_]*)/g;
      var str = this.post.message; 
      if (str.indexOf('http')!=-1){
        var res = str.match(regex)[0].substr(3);
        var res2=str.match(regex2)[0].substr(3);
        var template="http://codepen.io/username/pen/penname/image/small.png";
        return template.replace("username",res2).replace("penname",res);
      }else{
        return "";
      }
    },
    penurl: function(){
      const regex = /[^i\/][^o\/]\/([a-zA-Z0-9\_]{6})/g;
      const regex2= /io\/.*?([a-zA-Z0-9\_]*)/g;
      var str = this.post.message; 
      if (str.indexOf('http')!=-1){
        var res = str.match(regex)[0].substr(3);
        var res2=str.match(regex2)[0].substr(3);
        var template="http://codepen.io/username/pen/penname";
        return template.replace("username",res2).replace("penname",res);
      }else{
        return "";
      }
    },
    filter_show: function(){
      var result=(this.post.message.indexOf(this.filter)!=-1 || this.post.from.name.indexOf(this.filter)!=-1);
      return result;
    }
  }
});
//專案總覽的群組組件(下層proj_post)
Vue.component("projpanel",{
  template: "<div> \
              <div class='col-sm-12'>\
                <h3 v-show='!posts.length'>載入資料中...</h3>\
                <h3>{{filter==''?('共有'+posts.length+'項作品'):('共有'+filtered_post.length+'項作品搜尋結果')}} \
                 <a v-bind:href=\"'https://www.facebook.com/'+proj_fb_hash\" target='_blank'>(繳交貼文網址)</a> \
                 <input class='finder_input' placeholder='輸入過濾名字/內文' v-model='filter'>\
                 &nbsp;&nbsp;&nbsp;&nbsp;\
                 <label>小呈現\
                    <input class='input_size' type='radio' value='small' v-model='d_size'></input>\
                 </label>\
                 <label>大呈現\
                    <input class='input_size' type='radio' value='big' v-model='d_size'></input>\
                 </label>\
                </h3> \
              </div>\
              <div v-show=\"filter==''\" :class=\"[d_size=='small'?'col-sm-4':'col-sm-6']\">\
                <proj_post v-for='p in cut_post[0]' :d_size='d_size' :post='p' :filter='filter' v-if=\"p.message.indexOf(\'http\')>=0\" /> \
              </div>\
              <div v-show=\"filter==''\" :class=\"[d_size=='small'?'col-sm-4':'col-sm-6']\">\
                <proj_post v-for='p in cut_post[1]' :d_size='d_size' :post='p' :filter='filter' v-if=\"p.message.indexOf(\'http\')>=0\" /> \
              </div>\
              <div v-show=\"filter==''\" :class=\"[d_size=='small'?'col-sm-4':'col-sm-6']\">\
                <proj_post v-for='p in cut_post[2]' :d_size='d_size' :post='p' :filter='filter' v-if=\"p.message.indexOf(\'http\')>=0\" /> \
              </div>\
              <proj_post v-show=\"filter!=''\" class='col-sm-4' v-for='p in filtered_post' :post='p' v-if=\"p.message.indexOf(\'http\')>=0\" /> \
              \
            </div>",
  props: ["posts","proj_fb_hash"],
  data:function(){
    return {
      filter: "",
      display_num: 25,
      d_size: "small"
    }
  },
  computed:{
    cut_post: function(){
      var p1=[],p2=[],p3=[];
    

      for(var i=0;i<this.posts.length;i++){
        if (this.filter=="" || this.posts[i].message.indexOf(this.filter)!=-1 || this.posts[i].from.name.indexOf(this.filter)!=-1 ){
          if (i%3==0){
            p1.push(this.posts[i]);
          }else if (i%3==1){
            p2.push(this.posts[i]);
          }else if (i%3==2){
            p3.push(this.posts[i]);
          }
          
        }
      }
      return [p1,p2,p3];
    },
    filtered_post: function(){
      var p=[];
      for(var i=0;i<this.posts.length;i++){
        if (this.posts[i].message.indexOf(this.filter)!=-1 || this.posts[i].from.name.indexOf(this.filter)!=-1 ){
          p.push(this.posts[i]);
        }
      }
      return p;
    }
  }
});

//傳送聊天訊息
function send(name,mes){
   var nref=database.ref('messages').push();
   nref.set({
      name: name,
      message: mes,
      time: new Date().toLocaleString()
    })
}
//聊天訊息總覽的組件
Vue.component("chatpanel",{
  template: "<div><br><h4>Firebase即時留言板(最新10則)</h4> \
              <hr>\
                <div class='chatbox_msg' v-for=\"m in messages \"><span class=chatbox_name>{{m.name}}</span>: {{m.message}}\
                  <span class='smalltime'>{{m.time}} </span>\
                  <br>\
                </div>\
                <input class='input_name' v-model='name' placeholder='路人'> <input v-model='temptext' placeholder='留句話吧'> <button @click='send'>送出</button>\
              </div>",
  props: ['messages'],
  data: function (){
    return {
      temptext: "",
      name: ""
    }
  },
  methods: {
    send: function(){
      if (this.temptext !=""){
        if (this.name=="")
          send("路人",this.temptext);
        else
          send(this.name,this.temptext);
        this.temptext="";
      }
    }
  }

});

var messages=[];

//初始化vue
var vm = new Vue({
  el: "#app",
  data: {
    fd: fbdata,
    page: "proj1",
    proj1: comments,
    proj2: comments2,
    proj3: comments3,
    messages: messages
  },
  computed: {
    pjnumarray: function(){
      return [this.proj1.data.length,this.proj2.data.length,this.proj3.data.length];
    }
  },
  template: "<div class='container-fluid'> \
  <div class='jumbotron'> \
    <h2>[AWI] 動畫互動網頁程式入門 課程FB社團</h2> \
  </div> \
  <div class='colorbar'></div><hr> \
  <div class=row><fieldswitch class='col-sm-3 fieldswitch' :page='page' :pjnum='pjnumarray' :messages='messages' />\
  <fbpostpanel class='col-sm-9' v-if='page==\"club\"' :posts='fd.feed.data'/>\
  <projpanel class='col-sm-9' v-show='page==\"proj1\"' :posts='proj1.data' :proj_fb_hash='600361653469553'/>\
  <projpanel class='col-sm-9' v-show='page==\"proj2\"' :posts='proj2.data' :proj_fb_hash='602543423251376'/>\
  <projpanel class='col-sm-9' v-show='page==\"proj3\"' :posts='proj3.data' :proj_fb_hash='614003255438726'/>\
  </div></div>"
});

//初始化firebase
var config = {
  apiKey: "AIzaSyDMm8AoI0gjcmCK53u32KNAvchIUBbbLG0",
  authDomain: "monoame-awicourse.firebaseapp.com",
  databaseURL: "https://monoame-awicourse.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "300246568938"
};
firebase.initializeApp(config);
database = firebase.database();

//將message物件與firevase掛勾
function init(){
  database.ref('messages').limitToLast(10).on('value',function(snapshot) {
     // console.log(snapshot);
     Vue.set(vm,"messages",snapshot.val());
  });
}
init();