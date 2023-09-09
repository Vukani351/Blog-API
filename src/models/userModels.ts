/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ObjectId } from 'mongoose';

// interface IUser {
//   name: string;
//   email: string;
//   avatar?: string;
// }

// const userSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   avatar: String,
// });

// const UserModel = model<IUser>('User', userSchema);

// export default UserModel;

/*
first_name: { type: String, required: true },
last_name: { type: String, required: true },
gender: { type: String, required: false },
ip_address: { type: String, required: true }, */

export default class User {
  constructor(
    public email: string, 
    public password: string,
    public firstName: string, 
    public lastName: string, 
    public img?: string,
    public id?: ObjectId) {}
}
