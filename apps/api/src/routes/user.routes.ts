import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {UserModel} from '../schemas/user.schema';
import {getUserByUsername} from '../services/users.service';
import { addUser } from '../services/users.service';
import { comparePassword } from '../services/users.service';
import { getUsers } from '../services/users.service';
import { config } from '../config/database';
const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(req.body);
    let newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    const user = await addUser(newUser);
    res.json({ success: true, msg: 'Kaydolma Başarılı şekilde gerçekleşti', user: user });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ user: (req as any).user });
    
});

router.get('/getUsers', async (req,res) => {
        const users = await getUsers();
        if(users) {
            return res.json({success:true, msg:'All User Found  ',users})
        }
        else{
            return res.json({success:false,msg:'An error occurred in getAllUser ! check users'})
        }
})


router.post('/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await getUserByUsername(username);

        if (!user) {
            return res.json({ success: false, msg: 'User not Found!' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
            const token = jwt.sign(user.toJSON(), config.secret, {
                expiresIn: 604800 // 1 week in seconds
            });
            return res.json({
                success: true,
                token: 'BEARER ' + token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.json({ success: false, msg: 'Wrong Password!' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, msg: 'An error occurred', error: err.message });
    }
});

router.get("/users", async (req, res) => {
    try {
        const usersDB = await UserModel.find();
        res.json(usersDB);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server ERROR' });
    }
});

export default router;
