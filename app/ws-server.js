var WebSocketServer = require('websocket').server
var _ = require('underscore');

module.exports = function(server){

    var clients={};

    wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	console.log('origin:',origin);
	return true;
    }

    wsServer.on('request', function(request) {
	if (!originIsAllowed(request.origin)) {
	    // Make sure we only accept requests from an allowed origin
	    request.reject();
	    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
	    return;
	}

	var connection = request.accept('echo-protocol', request.origin);

	console.log((new Date()) + ' Connection accepted.');
	connection.on('message', function(message) {
            if (message.type === 'utf8') {
		console.log('Received Message: ' + message.utf8Data);
		// connection.sendUTF(message.utf8Data);
		processMsg(connection, message.utf8Data);
		//broadcast(msg);
            }
            else if (message.type === 'binary') {
		console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
		connection.sendBytes(message.binaryData);
            }
	});
	connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	    removeClient(connection);
	});
    });

    function unicast(conn, data){
	var msg=JSON.stringify(data);
	conn.sendUTF(msg);
	console.log('unicast: sent to %s, msg=%s', data.id,  msg);
    }
    function broadcast(data) {
	// console.log('clients#='+clients.length);
	var msg=JSON.stringify(_.omit(data,'id'));
	for (var i in clients){
	    console.log('broadcast: sent to %s, msg=%s',i, msg);
	    clients[i].conn.sendUTF(msg);
	}
    }

    function removeClient(conn){
	var deleted=false;
	for(var i in clients){
	    if(clients[i]===conn){
		delete clients[i];
		deleted=true;
		console.log('client removed');
	    }
	}
	if(!deleted){
	    console.log('can\'t remove client: no such client exists');
	}
    }

    function findClient(conn){
	for(var i in clients){
	    if(clients[i].conn===conn){
		return clients[i];
	    }
	}
	return undefined;
    }
    
    var clientId=0;

    function processMsg(conn, data){
	data=JSON.parse(data);
	switch(data.msg){
	case 'helo':
	    // var conns = _.pluck(clients, conn);
	    clientId++;
	    clients[clientId]={conn: conn};
 	    data.id = clientId;
	    unicast(conn, data);
	    break;
        case 'scroll':
	    broadcast(data);
            break;
	case 'win-resize':
	    if (client=findClient(conn)){
	    // if(clients[data.id]){
		client.frameWidth = data.frameWidth;
		var widths= _.pluck(clients, 'frameWidth');
		data.frameWidth = Math.min.apply(null, widths);
		broadcast(data);
	    } else {
		console.log('failed to find client');
	    }
	    break;
	case 'navigate':
	    if (client=findClient(conn)){
		broadcast(data);
	    } else {
		console.log('failed to find client');
	    }
        }

	
    }
};
