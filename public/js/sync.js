/* jshint browser:true */

// var frame;
// var frameDoc;
var clientId = undefined;
var scrollTopSynced;


var syncSocket;

function throttlize(f){
    return  _.throttle(f, 500);
}

function initFrame(){
    console.log('initFrame called...');
    var frame = document.getElementById('frame1');
    var frameDoc = frame.contentDocument;

    // $('iframe').scroll(throttlize(syncScroll));
    $($('#frame1').contents()).scroll(throttlize(syncScroll));
    // frame.contentWindow.onscroll = throttlize(syncScroll);

    // click events
    // if(frameInited){
        // frameInited=true;
        // console.log('initFrame cont...');
        var links = frameDoc.getElementsByTagName("a");

        for (var i=0;i<links.length;i++){
            setClickHandler(links[i]);
        }
    // }
}

function init(){
    console.log('window init called...');
    // var frame = document.getElementById('frame1');
    initSync();
    //initFrame();
    $(window).resize(throttlize(syncWinSize));
    $('#form1').submit(function(event){
	event.preventDefault();
	//console.log($('#urlFrame').val());
	makeRequest($('#urlFrame').val());
    });
}


function setClickHandler(link){
    // console.log(link);
    link.addEventListener('click', function(event){
            event.preventDefault();
            var url=link.getAttribute('href');
            console.log(url);
            makeRequest(url);
    }, false);
}

var reqUrl;
function makeRequest(url) {
//    var data=JSON.stringify({url:url});
//    $.post('/getURL', data, )
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      httpRequest = new XMLHttpRequest();
    }
    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = publishUrlContent;
    console.log('getting url='+url);
    httpRequest.open('POST', '/getURL', true);
    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    httpRequest.send(JSON.stringify({url:url}));
    reqUrl=url;
}

function publishUrlContent() {
    // var frame = document.getElementsByTagName('iframe')[0];
    // var frameDoc = frame.contentDocument;

    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
          // frameDoc.location='./page.html';
	  loadFrame();
          document.getElementById('urlFrame').value = reqUrl;
          console.log('now reqUrl='+reqUrl);
          // alert(httpRequest.responseText);
	  syncPage();
      } else {
        alert('There was a problem with the request.');
      }
    }
  }


function syncPage() {
    console.log('sync page');
    sendWS({
	msg: 'navigate',
	id: clientId,
	url: reqUrl
    });
}

function syncScroll (){
    console.log('scrollY='+getScrollTop());
    if(scrollTopSynced != getScrollTop()){
	sendWS({
            msg: 'scroll',
	    id: clientId,
            scrollY: getScrollTop()
	});
    }
}

function getScrollTop(){
    return $('#frame1').contents().scrollTop();
}

function setScrollTop(scrollTop){
    $('#frame1').contents().scrollTop(scrollTop);
    // $('#frame1').contents().find("html,body").animate({ scrollTop: scrollTop },1000);
}


// function init(){
//     var iframe=frameDoc.getElementById('frame1');
//     var iframedoc = iframe.contentFrameDoc || iframe.contentWindow.frameDoc;
//     iframedoc.body.innerHTML = page1;
// }
// 


function initSync(){
    
    var wsServerUrl
    if (!window.location.origin)
	wsServerUrl=window.location.protocol+"//"+window.location.host;
    else
	wsServerUrl=location.origin.replace(/^http/, 'ws');

    syncSocket = new WebSocket(wsServerUrl, "echo-protocol");

    syncSocket.onopen = function(event){
	var data = {
	    msg: 'helo',
	    winWidth: $('iframe').width()
	};
        syncSocket.send(JSON.stringify(data));
    };

    syncSocket.onmessage = function(event){
        console.log(event.data);
        var data=JSON.parse(event.data);
        switch(data.msg){
	case 'helo':
	    clientId = data.id;
	    syncWinSize('forced');
	    break;
        case 'scroll':
	    scrollTopSynced = data.scrollY;
            setScrollTop(data.scrollY);
            break;
	case 'win-resize':
	    $('iframe').width(data.frameWidth);
	    break;
	case 'navigate':
	    if(data.url!==reqUrl){
		loadFrame();
	    }
	    break;
        }
    };
}

function loadFrame(){
    $('#frame1').prop('src','./page.html');
}

function syncWinSize(forced){
    winWidth = $(window).width(); 
    // frameWidth = $('#frame1').width();
    // console.log('win resize event, winWidth=%s, iframeWidth=',winWidth,frameWidth);
    //if(winWidth*0.9<frameWidth || forced==='forced'){
	sendWS({
	    msg: 'win-resize',
	    id: clientId,
            frameWidth: Math.round(winWidth*0.9) 
	});
    //}
}

function sendWS(data){
    if(clientId){
	syncSocket.send(JSON.stringify(data));
    } else {
	console.log('clientId not found');
    }
}

//window.onload = init;
$(window).load(init);
$('#frame1').load(initFrame);
//$(document).ready(function(){
//    document.getElementsByTagName('iframe')[0].onload=initFrame;
//$("iframe#frame1").load(initFrame);
//});



