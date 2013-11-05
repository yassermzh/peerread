/* jshint browser:true */

var frame;
var frameDoc;
var wsServerUrl="ws://192.168.137.144:8080/";
var syncSocket;

function initFrame(){
    console.log('initFrame called...');
    var frame = document.getElementsByTagName('iframe')[0];
    frameDoc = frame.contentDocument;
    frame.contentWindow.onscroll = syncScroll;

    // click events
    // if(frameInited){
        frameInited=true;
        console.log('initFrame cont...');
        var links = frameDoc.getElementsByTagName("a");

        for (var i=0;i<links.length;i++){
            setClickHandler(links[i]);
        }
    // }
}

function init(){
    console.log('window init called...');
    frame = document.getElementsByTagName('iframe')[0];
    // console.log('frame=',frame);
    // console.log('frameWindow=',frame.contentWindow);
    // frame.onload=initFrame;
    // frame.contentWindow.onload = initFrame;
    // console.log(initFrame);
    initSync();
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
          frameDoc.location='./page.html';
          document.getElementById('urlFrame').value = reqUrl;
          console.log('now reqUrl='+reqUrl);
          // alert(httpRequest.responseText);
      } else {
        alert('There was a problem with the request.');
      }
    }
  }


function syncScroll (){
    console.log('scrollY='+frameDoc.body.scrollTop);
    syncSocket.send(JSON.stringify({
        msg: 'scroll',
        scrollY: frameDoc.body.scrollTop
    }));
}

// function init(){
//     var iframe=frameDoc.getElementById('frame1');
//     var iframedoc = iframe.contentFrameDoc || iframe.contentWindow.frameDoc;
//     iframedoc.body.innerHTML = page1;
// }
// 


function initSync(){
    // var frame = document.getElementsByTagName('iframe')[0];
    // var frameDoc = frame.contentDocument;

    syncSocket = new WebSocket(wsServerUrl, "echo-protocol");

    syncSocket.onopen = function(event){
        syncSocket.send(JSON.stringify({msg: 'helo'}));
    };

    syncSocket.onmessage = function(event){
        console.log(event.data);
        var data=JSON.parse(event.data);
        switch(data.msg){
        case 'scroll':
            frameDoc.body.scrollTop=data.scrollY;
            break;
        }
    };
}

window.onload = init;
document.getElementsByTagName('iframe')[0].onload=initFrame;


