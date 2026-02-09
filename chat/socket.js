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

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('connected' + socket.id);
        /*msg={
            roomId: 
            from:
            to:
        }*/
        socket.on('join_room', async ({from, to})=> {
            if (from == null ||to == null) {return;}

            let room = await findRoom(from, to);
            if(!room){
                try {
                    room = await createRoom(from, to);
                } catch(e) {
                    room = await findRoom(from, to);
                }
                }

            socket.join(room.id)
            socket.emit("joined_room", {roomId: room.id})
        });

        socket.on('send_message', async (msg) => {
            socket.to(msg.roomId).emit('receive_message', msg);
            await db.query(
                'INSERT INTO chats (roomId, sender, created_at) VALUES (?, ?, NOW())',
                [msg.roomId, msg.from]);

            console.log('send_message: ', msg);
        });

        socket.on('leave_room', ({roomId}) => {
            socket.leave(roomId);
        });

        socket.on('disconnect', () => {
            console.log('disconnected: ', socket.id);
        })
    });
}
