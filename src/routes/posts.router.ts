/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { auth } from '../middlewares';
import { collections } from '../services/database.service';
import { ObjectId } from 'mongodb';

interface Post {
  userId: Number;
  _id: ObjectId;
  title: String;
  tzpe: String;
  image: String;
  author: String;
  datePublished: String;
  headline: String;
  dateModified: String;
}
const router = express.Router();

// getting all posts:
router.get('/', auth, async (req, res) => {
  try {
    const posts = (await collections.post?.find({}).toArray()) as unknown as Post[];

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
  * TODO:
  * change the query to get posts from using the id but using the headline or title of the article.
  * we do this by using body to query not the params.
*/
router.get('/:title', auth, async (req, res) => {
  const title = req.body?.title;
  try {
    const query = { title: title };
    const posts = (await collections.post?.find({ query }).toArray()) as unknown as Post[];

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});


// POST
router.post('/publish', auth, async (req: Request, res: Response) => {
  try {
    let title = req.body.title;
    const updatedPost: Post = req.body as Post;
    const query = { title: title };
  
    const result = await collections.post?.updateOne(query, { $set: updatedPost });

    result 
      ? res.status(200).send(`Successfully updated post with id ${title}`)
      : res.status(304).send(`Post with id: ${title} not updated`);
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

export default router;