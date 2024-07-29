import { UserModel } from '../schemas/user.schema';
import bcrypt from 'bcryptjs';



export const getUserById = async(id) => {
    return UserModel.findById(id).then(user => {
        return user;
    }).catch(err => console.log('getUserById ERROR',err))
}

export const getUserByUsername = async(username) => {
    const query = {username:username}
    return UserModel.findOne(query).then(user => {
        return user;
    }).catch(err => console.log('getUserByUsername ERROR',err))
}

export const addUser = async(newUser) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password,salt);
        newUser.password = hash;
        const user = newUser.save();
        return user;
    }
    catch(err){
        console.log('addUser ERROR',err)
    }
}

export const comparePassword = async(candidatePassword,hash) => {
   const isMatch = await bcrypt.compare(candidatePassword,hash)
   return isMatch;
}
export const getUsers = async () => {
    return UserModel.find().then(users => {
        return users;
    }).catch(err => console.log("getUsers ERROR ! ",err))
}
