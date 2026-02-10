function createRoomId(from, to) {
    const roomId    = from < to ? `dm_${from}_${to}`:`dm_${to}_${from}`;
    return roomId;
};

async function createRoom(from, to) {
    let u1, u2;
    if (from < to) {
        u1 = from, u2 = to}
    else {
        u1 = to, u2 = from};
    
    const roomId = `dm_${u1}_${u2}`

    await db.query(
        'INSERT INTO rooms (id, user1_id, user2_id) VALUES (?,?,?)',
        [roomId, u1, u2]
    );
    return { id: roomId};
};

async function findRoom(from, to) {
    let roomId = createRoomId(from, to)
    const [rows] = await db.query(
        'SELECT * FROM rooms WHERE id = ?', [roomId]
    );
    return rows[0] || null 
};

const db = require('./db.js')

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('connected: ' + socket.id);
        /*msg={
            roomId: 
            from:
            to:
        }*/
        socket.on('join_room', async ({from, to}, ack)=> {
            if (typeof ack != 'function') {
                return;
            }
            
            if (from == null ||to == null) {
                ack({ ok: false, error: 'INVALID_PAYLOAD'});
                return;
            };

            let room = await findRoom(from, to);
            if(!room){
                try {
                    room = await createRoom(from, to);
                } catch(e) {
                    room = await findRoom(from, to);
                }
                }

            socket.join(room.id);
            console.log(socket.id, ' joined room: ', room.id);
            ack({ ok: true, roomId: room.id });
            //socket.emit("joined_room", {roomId: room.id})
        });

        socket.on('send_message', async (msg, ack) => {
            if (typeof ack !== 'function') {
                //ack({ ok: false, error: 'ACK_ISNOT_FUNCTION'}); ack 없을시 오류-> 크래시 유발. FE에서 ack 없을시 종료
                console.error('SEND_MESSAGE called WITHOUT ACK');                
                return;
            };

            try {
                const [result] = await db.query(
                    'INSERT INTO chats (room_id, sender_id, content, created_at) VALUES (?,?,?,NOW())',
                    [msg.roomId, msg.from, msg.content]
                );
                socket.to(msg.roomId).emit('receive_message', {
                    ...msg,
                    id: result.insertId
                });

                console.log(result)
                console.log('send_message: ', msg)
                ack({ ok: true, messageId: result.insertId });

            } catch (e) {
                ack({ ok: false, error: "INTERNAL_ERROR"});
                console.log(e);
            }
        });

        socket.on('leave_room', ({roomId}) => {
            socket.leave(roomId);
        });

        socket.on('disconnect', () => {
            console.log('disconnected: ', socket.id);
        })
    });
}
