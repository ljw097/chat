const { io } = require('socket.io-client')

const socket = io("http://localhost:3000")

// ===============BE code==============//
/*
async function join_room(from, to) {
    socket.emit('join_room', {from, to}, async (res) => {
        if (res.ok) {
            openRoomUi();
            let roomId = await res.roomId;
            console.log('roomId: ', roomId)
            return roomId;
        } else{
            console.error('join_room: ', res.error);
        };
    });
};
*/
async function join_room(from, to) {
    return new Promise((resolve, reject) => {
        socket.emit('join_room', { from, to }, (res) => {
            if (res.ok) {
                openRoomUi();
                resolve(res.roomId); // 여기서 실제 roomId 반환
            } else {
                console.error('join_room: ', res.error);
                reject(res.error);
            }
        });
    });
}

async function send_message(msg) {
    socket.emit('send_message', msg, (res) => {
        if (res.ok) {
            addMessageToUi({ ...msg, status:'sent' });
            console.log('send_message: ', msg);
        } else {
            addMessageToUi({ ...msg, status:'failed'});
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
socket.on("connect", async () => {
    console.log('server connected');

    //temp user id for dev
    const from  = '1'; //user's id
    const to = '2'; //oppnent's id

    //let roomId = joinRoom(from, to); //joinroom은 처리하지 않아야 함. 
    let roomId = await join_room(from, to);
    console.log('Joined room: ', roomId);
    //방 화면에 접속했다 가정
    let content = 'hi'

    //fake text
    msg = {
        from: `${from}`,
        content: `${content}`,
        roomId: `${roomId}`
    };


    send_message(msg);

});

