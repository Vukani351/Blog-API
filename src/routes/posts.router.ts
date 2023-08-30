/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { auth } from '../middlewares';
import { collections } from '../services/database.service';

interface Post {
  userId: Number;
  id: Number;
  title: String;
  tzpe: String;
  image: String;
  author: String;
  datePublished: String;
  headline: String;
  dateModified: String;
}
const router = express.Router();

// getting all posts
// const getPosts = async (req: Request, res: Response, next?: NextFunction) => {
//   // get some posts
//   let result: AxiosResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
//   let posts: [Post] = result.data;
//   return res.status(200).json({
//     message: posts,
//   });
// };

router.get('/', auth, async (req, res) => {
  try {
    const posts = (await collections.post?.find({}).toArray()) as unknown as Post[];

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});


// POST
router.post('/publish', auth, async (req: Request, res: Response) => {
  try {
    let post = req.body.post; 
    /* get the data held within the post object */
    
    let existingPost;
    try {
      // existingUser = await collections.posts?.findOne({ email: email });
    } catch {
      const error = new Error('Error! Something went wrong.');
      return (error);
    }
    // if (!existingUser || existingUser.password != password) {
    //   const error = Error('Wrong details please check at once');
    //   return (error);
    // }
    
    // result
    //   ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
    //   : res.status(500).send('Failed to create a new user.');
  } catch (error) {
    console.error(error);
    res.status(400).send('error.message');
  }
});

// updating a post
const updatePost = async (req: Request, res: Response, next?: NextFunction) => {
  // get the post id from the req.params
  let id: string = req.params.id;
  // get the data from req.body
  let title: string = req.body.title ?? null;
  let body: string = req.body.body ?? null;
  // update the post
  let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    ...(title && { title }),
    ...(body && { body }),
  });
    // return response
  return res.status(200).json({
    message: response.data,
  });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next?: NextFunction) => {
  // get the post id from req.params
  let id: string = req.params.id;
  // delete the post
  let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  // return response
  return res.status(200).json({
    message: 'post deleted successfully',
  });
};

// adding a post
const addPost = async (req: Request, res: Response, next?: NextFunction) => {
  // get the data from req.body
  let title: string = req.body.title;
  let body: string = req.body.body;
  // add the post
  let response: AxiosResponse = await axios.post('https://jsonplaceholder.typicode.com/posts', {
    title,
    body,
  });
    // return response
  return res.status(200).json({
    message: response.data,
  });
};

// export { getPosts, getPost, updatePost, deletePost, addPost };
export default router;