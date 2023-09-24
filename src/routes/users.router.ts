/* eslint-disable @typescript-eslint/no-unused-expressions */
// External Dependencies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.service';
import User from '../models/userModels';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { auth } from '../middlewares';
const MailSlurp = require('mailslurp-client').default;

// Global Config
export const userRouter = express.Router();
dotenv.config();
const JWT_SECRET = 'dance';

userRouter.use(express.json());

// GET
userRouter.get('/', auth, async (_req: Request, res: Response) => {

  try {
    const users = (await collections.users?.find({}).toArray() || '') as unknown as User[];

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('error.message');
  }
}); 

userRouter.put('/reset', async (req: Request, res: Response) => {
  /*
  * To make the reset work we need to go to 'reset' on the blog.
  * we need to add email and new password.
  */
 
  try {        
    const query = { email: req?.body?.email };
    const filter = { query };
    
    const user = (await collections.users?.findOne(query)) as unknown as User;
    if (user) {
      user.password = req.body.password;
      const updateDoc = { $set: { ...user } };
      (await collections.users?.updateOne(filter, updateDoc, { upsert: false })) as unknown as User;
    }
    res.status(200).send({
      email: user.email,
      message: 'User Updated !!',
      img: user.img,
      status: 200,
    });
  } catch (error) {
    res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
  }
});

// PUT
userRouter.put('/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const updatedGame: User = req.body as User;
    const query = { _id: new ObjectId(id) };
      
    const result = await collections.users?.updateOne(query, { $set: updatedGame });

    result
      ? res.status(200).send(`Successfully updated user with id ${id}`)
      : res.status(304).send(`User with id: ${id} not updated`);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// DELETE
userRouter.delete('/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;

  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Successfully removed user with id ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove user with id ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`User with id ${id} does not exist`);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
});

// logion:
userRouter.post('/login', async (req:Request, res:Response) => {
  try {
    const query = req.body.email;
    console.log(req.body);
    const user = (await collections.users?.findOne({ email: query })) as unknown as User;
    
    if (!user) {
      return res.status(400).send({ message : 'Email does not exists' });
    } else {
      /*
        ~ code aditions for the logout functionality using cookies
      */
      if (user && user?.password === req.body.password) {
        const accessToken = jwt.sign(
          { email: req.body.email },
          JWT_SECRET,
          {
            expiresIn: process.env.NODE_ENV === 'production' ? '6h' : '1h',
          },
        );
        res.header('Authorization', accessToken);
       
        res.status(200).json({
          email: user.email,
          token: accessToken,
          img: user.img,
          status: 200,
        });
      } else {
        res.status(500).json({ 
          message: 'Login error!',
          status: 500,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      msg: 'User Login Error!',
    });
  }
});

// register:
userRouter.post('/register', async (req:Request, res:Response) => {
  
  try {
    const newUser: User = {
      email: req.body.email, 
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };

    const user = (await collections.users?.findOne( { email: newUser.email } )) as unknown as User;
    
    if (user) {
      
      res.status(400).json({ message: 'Sorry this user is already avaliable', status: 400 });
      /* 
        ! might need changing
       */
      Error('Cannot divide by zero'); /* ! might need changing*/
    } else {
      if (newUser && newUser?.password != '') {
        const addedUser = (await collections.users?.insertOne( newUser )) as unknown as User;
        const accessToken = jwt.sign(
          { email: req.body.email },
          JWT_SECRET,
          {
            expiresIn: process.env.NODE_ENV === 'production' ? '6h' : '2 days',
          },
        );

        res.status(200).json({
          email: addedUser.email,          
          token: accessToken,
          img: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?q=75&fm=jpg&w=200&fit=max',          
          status: 200,
        });
      }
    }
  } catch (err) {
    res.status(503).json({ message: 'Sorry, registration Error!!', status: 503 });
  }
});

/*
  * TODO:
  * Add the forgot password functionality.
  * if we find user we will send a link email so that the user can reset the password.
*/

userRouter.post('/forgotpassword', async (req:Request, res:Response) => {
  const query = req.body.email;
  
  try {
    /*
    * set up for sending emails.
    * provide a mailslurp API KEY
    */
    const apiKey = '45ac38d11ed4c010b2c94171f9417d4f94363bc41f1e0623b57292adfaa09485';
    const user = (await collections.users?.findOne( { email: query } )) as unknown as User;
    let config = { apiKey };
    const mailslurp = new MailSlurp(config);
    const server = await mailslurp.getImapSmtpAccessDetails();
    const opts = {
      host: server.smtpServerHost,
      port: server.smtpServerPort,
      secure: false,
      auth: {
        user: server.smtpUsername,
        pass: server.smtpPassword,
        type: 'PLAIN',
      },
    };

    if (user && user.email != '') {
      const inbox = await mailslurp.createInbox();
      const options = {
        to: ['gcabashevukani3@gmail.com'],
        subject: 'Hello',
        body: 'Welcome',
      };
      const sent = await mailslurp.sendEmail(inbox.id, options);
      console.log('sent: \n', sent);
      res.status(200).json({ 
        message: 'Please check your email !!', status: 200, data: sent,
      });
    } else {
      res.status(200).json({ 
        message: 'This email does not exist !!', status: 400,
      });
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      msg: 'User Login Error!',
    });
  }
});

/*
  * TODO:
  * consider cleaning up the code by removing redundant parameters like query params.

*/