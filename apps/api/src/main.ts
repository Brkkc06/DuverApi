import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import {config }from './config/database';
import usersRoute from './routes/user.routes';
import statisticRoute from './routes/statistic.route';
import { passportFunction } from './config/passport';
import session from 'express-session';


// MongoDB'ye bağlanma
mongoose.connect(config.database)
.then(() => console.log('Veri tabanına başarıyla bağlandı ' + config.database))
.catch(err => console.error('HATA! Veri tabanına bağlanılamadı! ' + err));

const app = express();


const port = 3000;  


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors());
app.use('/users', usersRoute)
app.use('/statistic',statisticRoute)
app.use(session({
    secret: config.secret, resave: true, saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passportFunction(passport);

app.get('/', (req,res)=>{
    res.send("This is Backend")
})


app.listen(port,() => {
    console.log('Server started on port', +port);
 })




 

