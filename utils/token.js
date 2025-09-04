import jwt from 'jsonwebtoken';
import crypto from 'crypto'



export function signAccessToken(payload){
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_LIFE})
}

export function signRefreshToken(payload){
    return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_LIFE})
}

export function verifyAccessToken(token){
    return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
}

export function verifyRefreshToken(token){
    return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
}


export function sha256Hash(data){
    return crypto.createHash('sha256').update(data).digest('hex');
}