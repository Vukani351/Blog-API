/* eslint-disable import/no-extraneous-dependencies */
// External Dependencies
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

// Global Variables
export const collections: { users?: mongoDB.Collection, post?: mongoDB.Collection } = {};


// Initialize Connection

export async function connectToDatabase() {
  dotenv.config();
 
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || 'mongodb+srv://gcabashevukani3:54zIDSLibmMegl5f@cluster0.uo5k1du.mongodb.net/users?retryWrites=true&w=majority');
            
  await client.connect();
        
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
  const userCollection: mongoDB.Collection = db.collection(process.env.USER_COLLECTION_NAME || 'user');
  const postCollection: mongoDB.Collection = client.db(process.env.DB_NAME).collection('post');
  
  collections.post = postCollection;
  collections.users = userCollection;
       
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${userCollection.collectionName}`);
}