import express, { Request, Response } from 'express';
import { auth } from '../middlewares';
import * as dotenv from 'dotenv';
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

// Global Config
export const postRouter = express.Router();
// Tell the router what parser to use:
postRouter.use(express.json());
dotenv.config();

/* 
  ~ Get all posts route
  * add auth for testing till we can see that we can remove token from ui.
*/
postRouter.get('/', async (req: Request, res:Response) => {
  try {
    const posts = (await collections.post?.find().toArray()) as unknown as Post[];

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);  
  }
});

/*
  * TODO:
  * change the query to get posts from using the id but using the headline or title of the article.
  * we do this by using body to query not the params.
  * This route is used for when the article already exists but we want to edit the content.
*/
postRouter.post('/edit', auth, async (req:Request, res:Response) => {
  // const update: object = (req.body.updates) as Post;
  
  try {
    // const query = { title: title }; // why does this not work??
    // console.log('Got query: ', query);
    let post = (await collections.post?.updateOne({ title: req.body.title }, { $set: req.body }).then((data) => {
      return data;
    })) as Post;
    // console.log('\npost: ', post);
    res.status(200).send({ message: "Some thing isn' t working with ", post: post });
  } catch (error) {
    res.status(500).send(error);
  }
});


// POST
/*
  * POST /publish
  * This route is for when the user adds a new article then publishes it.
*/
postRouter.post('/publish', auth, async (req:Request, res:Response) => {
  // const title = (req.body as Post);
  // console.log('title: ', title);
  try {
    // let title = req.body.title;
    // const updatedPost: Post = req.body as Post;
    // const query = { title: title };
  
    // const result = await collections.post?.updateOne(query, { $set: updatedPost });

    // result 
    res.status(200).send(`Successfully updated post with id ${999}`);
    //   : res.status(304).send(`Post with id: ${title} not updated`);
  } catch (error) {
    console.error(error);
    res.status(400).send('error.message');
  }
});

// updating a post
// const updatePost = async (req: Request, res: Response, next?: NextFunction) => {
//   // get the post id from the req.params
//   let id: string = req.params.id;
//   // get the data from req.body
//   let title: string = req.body.title ?? null;
//   let body: string = req.body.body ?? null;
//   // update the post
//   let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
//     ...(title && { title }),
//     ...(body && { body }),
//   });
//     // return response
//   return res.status(200).json({
//     message: response.data,
//   });
// };

// // deleting a post
// const deletePost = async (req: Request, res: Response, next?: NextFunction) => {
//   // get the post id from req.params
//   let id: string = req.params.id;
//   // delete the post
//   let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
//   // return response
//   return res.status(200).json({
//     message: 'post deleted successfully',
//   });
// };

// // adding a post
// const addPost = async (req: Request, res: Response, next?: NextFunction) => {
//   // get the data from req.body
//   let title: string = req.body.title;
//   let body: string = req.body.body;
//   // add the post
//   let response: AxiosResponse = await axios.post('https://jsonplaceholder.typicode.com/posts', {
//     title,
//     body,
//   });
//     // return response
//   return res.status(200).json({
//     message: response.data,
//   });
// };

export default postRouter;