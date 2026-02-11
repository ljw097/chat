const express = require('express');
const router = express.Router();
const db = require('../db/db');

function userExists( type, uid ) {
    if (type = 'signup') {
        [id] = db.query(
                'SELECT id FROM users WHERE uid = (?) ', [uid]
            );
        
    }
}


router.post('/signup', (req, res) => {
    const { uid, upw, upw_c, email, phone } = req.body;

    if (!uid || !upw) {
        return res.status(400).json({ error: 'UID_UPW_INVALID' });
    };

    if (upw !== upw_c) {
        return res.status(400).json({ error: 'UPW_MISMATCH' });
    };






});    
module.exports = router;