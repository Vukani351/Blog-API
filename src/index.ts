// import app from './app';
import express from 'express';
import { connectToDatabase } from './services/database.service';
import { userRouter } from './routes/users.router';
import postsRouter from './routes/posts.router';


const app = express();
connectToDatabase()
  .then(() => {
    app.use('/posts', postsRouter);
    app.use('/user', userRouter);
   
    app.listen('5000', () => {
      console.log(`Server started at http://localhost:${5000}`);
    });
  })
  .catch((error: Error) => {
    console.error('Database connection failed', error);
    process.exit();
  });