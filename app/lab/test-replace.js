var msg='this is yasser href="docs/" href="sunc.js"\nas a href=\'dumv.css\' yasser\n and href="http://bing.com" not a yasser';
//msg="yasser is a ...";
//msg=msg.replace(/yasser/g, 'soroosh');
var host="http://localhost/";
msg=msg.replace(/href=(["'])(((?!http)\w)+)/g, 'href=$1'+host+"$2");
console.log(msg);
