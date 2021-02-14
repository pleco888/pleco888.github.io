// ----------------------- 
// 追従するカーソル
// ----------------------- 
var
cursor = $(".cursor"),
follower = $(".follower"),
cWidth = 8, //カーソルの大きさ
fWidth = 40, //フォロワーの大きさ
delay = 10, //フォロワーの速度
mouseX = 0,
mouseY = 0,
posX = 0, //フォロワーX座標
posY = 0;

//カーソルの遅延アニメーション
//ほんの少しだけ遅延させる 0.001秒
TweenMax.to({}, .001, {
  repeat: -1,
  onRepeat: function() {
    posX += (mouseX - posX) / delay;
    posY += (mouseY - posY) / delay;
    
    TweenMax.set(follower, {
        css: {    
          left: posX - (fWidth / 2),
          top: posY - (fWidth / 2)
        }
    });
    
    TweenMax.set(cursor, {
        css: {    
          left: mouseX - (cWidth / 2),
          top: mouseY - (cWidth / 2)
        }
    });
  }
});

//マウス座標を取得
$(document).on("mousemove", function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

$("a").on({
  "mouseenter": function() {
    cursor.addClass("is-active");
    follower.addClass("is-active");
  },
  "mouseleave": function() {
    cursor.removeClass("is-active");
    follower.removeClass("is-active");
  }
});

// ----------------------- 
// ページ内リンクに飛んだときのスムーススクロール
// ----------------------- 
$(function(){
  $('.Nav a[href^="#"]').click(function(){
    var adjust = 0;
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top + adjust;
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });
});

// ----------------------- 
// ハンバーガーメニューのページ内リンクをクリックするとメニューが閉じる
// -----------------------
$('.Nav-Items a[href^="#"]').click(function(){
  $('.Nav-Checkbox').trigger('click')
});

// ----------------------- 
// コンタクトフォームの送信完了画面を出す
// jquery Ajax
// -----------------------

$("#googleform").submit(function (event) {

/*var name = $("#name").val();
var email = $("#mail-address").val();
var radio = $('[name="entry.409917634_sentinel"]:checked').val();
var message = $("#message").val();*/

var name = $('[name="entry.1616382265"]').val();
var email = $('[name="entry.1057722765"]').val();
var radio = $('[name="entry.409917634_sentinel"]').val();
var message = $('[name="entry.1557664692"]').val();
$.ajax({
  url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdqrECXHOEJMxXHcvoFBRQSkd7Z13agnWXmOmCblFlTjgZX1w/formResponse",
  data: {"entry.1616382265" : name,
  "entry.1057722765" : email,
  "entry.409917634_sentinel" : radio,
  "entry.1557664692" : message },
  type: "POST",
  dataType: "xml",
  statusCode: {
    0: function() {
      window.location.href = "submit.html";
    },
    200: function() {
      alert("errorMsg");
    }
  }
});

event.preventDefault();

});
