const { io } = require('socket.io-client')

const socket = io("http://localhost:3000")


function sendMessage(socket, room_id, from, content) {
    const tempId = Date.now();
    
    const msg = {
        room_id, from, content, tempId
    };

    socket.emit('send_message', msg, (res) => {
        if (res.ok) {
            //res = { ok: true, messageId: ~, error:~}
            console.log('send_message: ', res.messageId);

            addMessageToUi({ ...msg, id: res.messageId, status: 'sent'});
        } else {
            console.error('send_message: ', res.error);
            addMessageToUi({ ...msg, status: 'failed', error: res.error });
        }
    });
};

function joinRoom(from, to) {
    socket.emit('join_room', msg, (res) => {
        if (res.ok) {
            console.log('room joined: ', res.roomId);
            openRoomUi();
            return res.roomId;
        } else {
            console.error('Join_room: ', res.error);
        };
    });
};

// ===============FE code==============//
function addMessageToUi() {
    //FE
};

function openRoomUi() {
    //FE
};

// ===============Socket===============//
socket.on("connect", () => {
    console.log('server connected');

    //temp user id for dev
    const from  = '1'; //user's id
    const to = '2' //oppnent's id

    let roomId = joinRoom(from, to);
    
    //fake text
    let context1 = 'hi' //by 'from'

    sendMessage(socket, roomId, from, to);



});

