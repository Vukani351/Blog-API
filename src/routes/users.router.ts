/* eslint-disable @typescript-eslint/no-unused-expressions */
// External Dependencies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.service';
import User from '../models/userModels';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { auth, getBearerToken, SECRET_KEY } from '../middlewares';

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

userRouter.get('/:id', auth, async (req: Request, res: Response) => {
  const id = req?.params?.id;
  // const email = req?.body?.id;

  try {
        
    const query = { _id: new ObjectId(id) };
    // const query = { id: `${id}` };
    const user = (await collections.users?.findOne({ query })) as unknown as User;

    if (user) {
      res.status(200).send(user);
    }
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
  * Add the logout functionality.

*/

userRouter.post('/logout', async (req:Request, res:Response) => {
  try {
    const authHeader = req.headers; /* get the session cookie from request header. */

    if (!(authHeader)) { 
      res.status(200).json({ message: 'You are not logged in my guy!' });
      return res.sendStatus(204); /* No content */
    } else {
      // const expiringToken = jwt.verify(authHeader.authorization || '', SECRET_KEY);
      const expiringToken = jwt.verify(getBearerToken(authHeader.authorization as  string), SECRET_KEY);
      
      console.log('authHeader: ', expiringToken);
  
      // res.setHeader('Clear-Site-Data', '"cookies", "storage"');
      res.status(200).json({ message: 'You are logged out!' });
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