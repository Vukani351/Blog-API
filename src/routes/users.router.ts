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

// Global Config
export const userRouter = express.Router();
dotenv.config();
const JWT_SECRET = 'dance';

userRouter.use(express.json());

// GET
userRouter.get('/', async (_req: Request, res: Response) => {

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

// POST
userRouter.post('/', auth, async (req: Request, res: Response) => {
  try {
    const newUser = req.body as User;
    const result = await collections.users?.insertOne(newUser);

    // let { email, password } = req.body;
 
    // let existingUser;
    // try {
    //   existingUser = await collections.users?.findOne({ email: email });
    // } catch {
    //   const error = new Error('Error! Something went wrong.');
    //   return (error);
    // }
    // if (!existingUser || existingUser.password != password) {
    //   const error = Error('Wrong details please check at once');
    //   return (error);
    // }
    
    result
      ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
      : res.status(500).send('Failed to create a new user.');
  } catch (error) {
    console.error(error);
    res.status(400).send('error.message');
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
      return res.status(400).send('Email already exists ');
    } else {
      if (user && user?.password === req.body.password) {
        const accessToken = jwt.sign(
          { email: req.body.email },
          JWT_SECRET,
          {
            expiresIn: process.env.NODE_ENV === 'production' ? '6h' : '2 days',
          },
        );
        res.header('Authorization', accessToken);
        // res.status(200).send('User Loged In.');
        res.status(200).json({
          succes: true,          
          email: user.email,
          token: accessToken,   
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
    // const {email, firstName, lastName, password } = req.body;
    const newUser: User = {
      email: req.body.email, 
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };

    const user = (await collections.users?.findOne( { email: newUser.email } )) as unknown as User;
    
    if (user) {
      return res.json({ msg: 'Sorry this user is already avaliable' });
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
        
        res.header('auth-token', accessToken);
        res.status(201).json({
          succes: true,
          email: addedUser.email,          
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(503).json({ msg: 'Server error!' });
  }
});