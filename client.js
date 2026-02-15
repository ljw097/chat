const { io } = require('socket.io-client');
const axios = require('axios');



async function signup(uid, upw, upw_c, email, phone) {

    try {
        const res = await axios.post('http://localhost:3000/auth/signup', {
            uid: `${uid}`,
            upw: `${upw}`,
            upw_c: `${upw_c}`,
            email: `${email}`,
            phone: `${phone}`
        });
        console.log(res);
    } catch (err) {
        console.log(err.response.data.ok);
        console.log(err.response.data.error)
    };
};


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


const uid = 'test';
const upw = 'testtest123!@';
const upw_c = 'testtest123!@';
const email = 'njbsandrewlee@gmail.com';
const phone = '01072684290';
signup(uid, upw, upw_c, email, phone);
// ===============Socket===============//
/*
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

*/