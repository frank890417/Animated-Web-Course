# Animated-Web-Course-
動態網頁程式設計課程

## api / parse_codepen 
#### 抓取codepen預覽圖資料
提供抓取codepen的og img/標題文字，
傳入get引數 Array[url...] 回網站的og資訊
並自動暫存曾經解析過的瀏覽網址加速API載入速度。

## api / command 
#### 抓是課程用的資料
提供抓取特定的資料，包括
itemdata / notifydata / tododata / hahowdata
抓取特殊的資料回應

## api / textservice 
#### 提供簡易文字存取的服務
提供特殊的account文字串檢索資料，
type為save/get 儲存與存取資料，
回傳msg:資料的JSON物件
