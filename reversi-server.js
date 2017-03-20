'use strict'
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'testdb.csav22kzu2dd.ap-northeast-1.rds.amazonaws.com',
	user: 'admin',
	password: 'a123321123',
	database: 'test',
});

connection.connect();

let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server);

server.listen(4747, function() {
    console.log('listening on:4747, Server opened');
});

let MAX = 60;
let hall = null;
let queue = null;
let rooms = [];

function Hall() {
    this.people = 0;
    this.socket = null;
}

function Room(){
	this.people = 0;
    this.socket = null;
}

function Queue(){
    this.people = 0;
    this.socket = null;
}

hall = new Hall();

queue = new Queue();

for(let n = 0;n < MAX;n++){
	rooms[n] = new Room();
}

function getFreeRoom(){
	for(let n = 0;n < MAX;n++){
		if(rooms[n].people === 0){
			return n;
		}
	}
	return -1;
}

io.people = 0;
io.on('connection',function(socket){
    io.people++;
    
    socket.on('disconnect',function(){
        io.people--;
        
    });
})

hall.socket = io.of('/hall').on('connection', function(socket) {

	hall.people++;

    console.log('[Hall]a player connected.There are '+hall.people+' people in hall');

	hall.socket.emit('people changed',hall.people);

    socket.on('disconnect',function(){
        hall.people--;
		console.log('[Hall]a player disconnected.There are '+hall.people+' people in hall');
		hall.socket.emit('people changed',hall.people);
    });
});

queue.socket = io.of('/queue').on('connection',function(socket){

	queue.people++;

    console.log('[Queue]someone connect queue socket.There are '+queue.people+' people in queue');

    if(queue.people === 1){
		socket.emit('set stand','black');
	}else if(queue.people === 2){
		socket.emit('set stand','white');
		let roomId = getFreeRoom();
        console.log(roomId+"roomId");
		if(roomId >= 0){
			queue.socket.emit('match success',roomId);
            console.log('[Queue]match success.There are '+queue.people+' people in queue');
		}else{
            console.log('[Warning]no free room!');
        }
	}

	socket.on('cancel match',function(){
		queue.people--;
        console.log('[Queue]someone cancel match.There are '+queue.people+' people in queue');
	});

    socket.on('disconnect',function(){
        queue.people--;
        console.log('[Queue]someone disconnected match.There are '+queue.people+' people in queue');
    });

});

for(let i = 0;i < MAX;i++){
	rooms[i].socket = io.of('/rooms'+i).on('connection',function(socket){

		rooms[i].people++;
		function CountPeople(){
		if(rooms[i].people===1){
			console.log('[Room]A player connected to room ' + i);
		}else if(rooms[i].people===2){
			console.log('[Room]Second player connected to room ' + i);
			var testid = socket.id;
			
			console.log('[Room]Unique ID: '+socket.id);
			
			connection.query('INSERT INTO test2 '+'SET ID = ?', [testid], function (error, results){
				if (error) throw error
				console.log(results)
			});
			
		}else
			console.log('Ghost');
	}
		CountPeople();
		socket.on('update chessboard',function(chessCoor){
			socket.broadcast.emit('update chessboard',chessCoor);
		});

		socket.on('force change turn',function(){
			socket.broadcast.emit('force change turn');
		});

		socket.on('disconnect',function(){
			rooms[i].people--;
            console.log('someone disconnected room'+i+'.There are '+rooms[i].people+' people in the room');
		});

	});
}
