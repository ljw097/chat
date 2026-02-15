const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const validator = require('validator');

router.post('/signup', async (req, res) => {
    const { uid, upw, upw_c, email, phone } = req.body;

    console.log('signup: ', req.body);

    if (!validator.isLength(uid, { min: 3, max: 20 })) {
        return res.status(400).json({ ok:false, error: 'UID_LENGTH' });
    };

    if (/\s/.test(uid)) {
        return res.status(400).json({ ok:false, error: 'UID_NO_WHITESPACE' });
    };

    if (!validator.isAlphanumeric(uid)) {
        return res.status(400).json({ ok:false, error: 'UID_ONLY_ALPHANUMERIC' });
    };

    if (!validator.isLength(upw, { min: 8, max: 20 })) {
    return res.status(400).json({ ok:false, error: 'PW_LENGTH_INVALID' });
    };

    if (/\s/.test(upw)) {
    return res.status(400).json({ ok:false, error: 'PW_NO_BLANK' });
    };

    if (!/[A-Za-z]/.test(upw)) {
    return res.status(400).json({ ok:false, error: 'PW_NO_LETTER' });
    };

    if (!/\d/.test(upw)) {
    return res.status(400).json({ ok:false, error: 'PW_NO_NUMBER' });
    };

    if (!/[!@#$%^&*]/.test(upw)) {
    return res.status(400).json({ ok:false, error: 'PW_NO_SPECIAL_CHAR' });
    };

    const hashed = await bcrypt.hash(upw, 11);
    console.log('upw: ', upw, 'hashed: ', hashed);


    try {
        const [rows] = await db.query(
            `SELECT id FROM users WHERE uid = (?)`, [uid]
        );

            if (rows.length > 0) {
                return res.status(400).json({ ok:false, error: 'ID_ALREADY_EXISTS'});
            } else {
                try {
                    await db.query(
                        `INSERT INTO users (uid, upw, email, phone) VALUES (?,?,?,?)`,
                        [uid, hashed, email, phone]
                    );
                    return res.status(201).json({ ok: true });
                } catch (err) {
                    return res.status(500).json({ ok: false, error: 'INTERNAL_SERVER_ERROR' });
                };
            };
    } catch (err) {
        return res.status(500).json({ ok: false, error: 'INTERNAL_SERVER_ERROR'});
    };    
});    


router.post('/login', async (req, res) => {
    const { uid, upw } = req.body;

    if (!uid || !upw ) {
        return res.status(400).json({ ok: false, error: 'UID_UPW_BLANK'});
    };

    try {
        const [rows] = await db.query(
            `SELECT uid,upw FROM users WHERE uid = (?)`, [uid]
        );
        if (rows.length === 0 ) {
            return res.status(400).json({ ok:false, error:'LOGIN_FAIL' });
        } else {
            const hashed = rows[0].upw;
            if (await bcrypt.compare(upw, hashed)) {
                const token = jwt.sign({ userId: rows[0].uid });
                return res.json({ ok: true, token });
            } else {
                return res.status(400).json({ ok:false, error:'LOGIN_FAIL' });
            };
        }
    } catch (err) {
        return res.status(500).json({ ok: false, error: 'INTERNAL_SERVER_ERROR' });
    }
});

module.exports = router;