import jwt from 'jsonwebtoken';
import envConfig from '../Configs/envConfig.js';

const generateToken = (userId)=>{
    return jwt.sign({id: userId} , envConfig.jwt_secret , {expiresIn: "7d"})
}

export default generateToken;