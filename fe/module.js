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
        return res.data;   

    } catch (err) {
        return err.response.data;
    };
};

async function login(uid, upw) {
    try {
        const res = await axios.post('http://localhost:3000/auth/login', {
            uid: `${uid}`,
            upw: `${upw}`
        });

        return res.data
    } catch (err) {
        return err.response.data;
    }
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


module.exports = {signup, login, join_room, send_message};