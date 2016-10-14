# Animated-Web-Course-
動態網頁程式設計課程

## api / parse_codepen 
#### 抓取codepen預覽圖資料
提供抓取codepen的og img/標題文字，
傳入get引數 Array[url...] 回網站的og資訊，並自動暫存曾經解析過的瀏覽網址加速API載入速度。
```
var api_url="http://www.monoame.com/awi_class/api/parse_codepen.php";
var urllist=[
"http://codepen.io/frank890417/pen/dpOxYx","http://codepen.io/frank890417/pen/XjBrok",
"http://codepen.io/frank890417/pen/wWyOVk","http://codepen.io/frank890417/pen/xEkyPy",
"http://codepen.io/frank890417/pen/EymPkK"];

$.ajax({
  url: api_url,
  data:{    
    urls: urllist,
    type: "json"
  },
  success: function(res){
    console.log(res);
  }
});
```
### Response
```
[{"url":"http:\/\/codepen.io\/frank890417\/pen\/dpOxYx",
"time":"2016-10-14 12:32:11","og_title":"webdemo",
"og_type":"website",
"og_url":"http:\/\/codepen.io\/frank890417\/details\/dpOxYx",
"og_image":"http:\/\/codepen.io\/frank890417\/pen\/dpOxYx\/image\/large.png",
"og_description":"...","og_site_name":"CodePen"},{....]
```

## api / command 
#### 抓取課程用的資料
提供抓取特定的資料，包括
itemdata / notifydata / tododata / hahowdata
抓取特殊的資料回應(資料在data裡面的文字檔案)

## api / textservice 
#### 提供簡易文字存取的服務
提供特殊的account文字串檢索資料，
type為save/get 儲存與存取資料，
回傳msg:資料的JSON物件
