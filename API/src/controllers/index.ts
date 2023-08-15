import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import registerUser from './UsersController';
import posts from './postsController';
import mongoose from 'mongoose';
// import { gamesRouter } from '../routes/games.router';

const router = express.Router();
const uri = 'mongodb+srv://gcabashevukani3:54zIDSLibmMegl5f@cluster0.uo5k1du.mongodb.net/users?retryWrites=true&w=majority';

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

mongoose.connect(uri).then(() => {
  console.log('\nConnected to DB');
}).catch((error) => {
  console.log('connection error', error);
});

router.use('/users', registerUser);

router.use('/emojis', emojis);

router.use('/posts', posts);
router.use('/test', posts);
// router.use('/games', gamesRouter);

export default router;


// 'mongodb+srv://gcabashevukani3:54zIDSLibmMegl5f@cluster0.uo5k1du.mongodb.net/users?retryWrites=true&w=majority';