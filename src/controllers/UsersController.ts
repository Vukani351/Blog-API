// /* eslint-disable import/no-extraneous-dependencies */
// import express from 'express';
// import UserModel from '../models/userModels';
// import * as mongoDB from 'mongodb';

// const router = express.Router();
// const mongoconnect = 'mongodb+srv://gcabashevukani3:54zIDSLibmMegl5f@cluster0.uo5k1du.mongodb.net/users?retryWrites=true&w=majority';

// const client: mongoDB.MongoClient = new mongoDB.MongoClient(mongoconnect);
           
// client.connect();

// // type UserResponse = { message:string };

// // interface User {
// //   userId: Number;
// //   id: Number;
// //   email: String;
// //   password: String;
// // }

// // router.get<{}, UserResponse>('/register', (req, res) => {
// //   return res.json({
// //     message: 'Users Details register',
// //   });
// // });

// // router.get<{}, UserResponse>('/login', (req, res) => {
// //   return res.json({
// //     message: 'Users Details login ',
// //   });
// // });

// // router.get<{}, UserResponse>('/getme', (req, res) => {
// //   return res.json({
// //     message: 'Users Details getme ',
// //   });
// // });

// // // updating a post
// // const updatePost = async (req: Request, res: Response, next?: NextFunction) => {
// //   // get the post id from the req.params
// //   let id: string = req.params.id;
// //   // get the data from req.body
// //   let title: string = req.body.title ?? null;
// //   let body: string = req.body.body ?? null;
// //   // update the post
// //   let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
// //     ...(title && { title }),
// //     ...(body && { body }),
// //   });
// //     // return response
// //   return res.status(200).json({
// //     message: response.data,
// //   });
// // };

// // // deleting a post
// // const deletePost = async (req: Request, res: Response, next?: NextFunction) => {
// //   // get the post id from req.params
// //   let id: string = req.params.id;
// //   // delete the post
// //   let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
// //   // return response
// //   return res.status(200).json({
// //     message: 'post deleted successfully',
// //   });
// // }; 

// // // adding a post
// // const addPost = async (req: Request, res: Response, next?: NextFunction) => {
// //   // get the data from req.body
// //   let title: string = req.body.title;
// //   let body: string = req.body.body;
// //   // add the post
// //   let response: AxiosResponse = await axios.post('https://jsonplaceholder.typicode.com/posts', {
// //     title,
// //     body,
// //   });
// //     // return response
// //   return res.status(200).json({
// //     message: response.data,
// //   });
// // };

// // router.post<{}, User>('/register', async (req: Request, res: Response) => {
// //   try {
// //     const newGame = req.body as unknown as User;
// //     const result = await myColl.users.insertOne(newGame);

// // result ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`) : res.status(500).send('Failed to create a new game.');
// //   } catch (error) {
// //     console.error(error);
// //     // res.status(400).send(error.message);
// //   }

// // });

// router.get('/users', async (req, res) => {
//   // get the data from req.body
//   UserModel.find().then(result => {
//     res.send(result);
//   }).catch((e: any) => {
//     console.log('Getting Users error', e);
//   });
// });


// // getting a single post
// // const getPost = async (req: Request, res: Response, next?: NextFunction) => {
// //   // get the post id from the req
// //   let id: string = req.params.id;
// //   // get the post
// //   let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
// //   let post: Post = result.data;
// //   return res.status(200).json({
// //     message: post,
// //   });
// // };

// export default router;