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
    const posts = (await collections.post?.find().toArray()) as Post[];

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: error, status: 500 });  
  }
});

/*
  * TODO:
  * change the query to get posts from using the id but using the headline or title of the article.
  * we do this by using body to query not the params.
  * will add new one if its not there because of the { upsert: true } flag
  * This route is used for when the article already exists but we want to edit the content.
  ! Still having an error because editing the headline does not change
*/
postRouter.put('/edit', auth, async (req:Request, res:Response) => {
  try {
   
    const filter = { title: req.body.title };
    const updateDoc = { $set: { ...req.body.body } };

    let articleUpdateStatus = await collections.post?.updateOne(filter, updateDoc, { upsert: true });
    res.status(200).send({ message: `Successfully edited ${req.body.title}`, data: articleUpdateStatus, status: 200  });
  } catch (error) {
    res.status(500).send({ message: 'Edit Error!! ', status: 500 });
  }
});


/*
  * POST /publish
  * This route is for when the user adds a new article then publishes it.
  ! currently not needed because edit actually adds
*/
// postRouter.post('/publish', auth, async (req:Request, res:Response) => {
//   try {
   
//     // result 
//     res.status(200).send(`Successfully updated post with id ${999}`);
//     //   : res.status(304).send(`Post with id: ${title} not updated`);
//   } catch (error) {
//     console.error(error);
//     res.status(400).send('error.message');
//   }
// });



export default postRouter;