import jwt from 'jsonwebtoken';
import crypto from 'crypto'



export function signAccessToken(payload){
    return jwt.sign(payload,"skhdjkaghruu23i7489haskjy",{expiresIn:1000*60*60*24*7})
}

export function signRefreshToken(payload){
    return jwt.sign(payload,"skhdjkaghruu23i7489haskjy786324876328746",{expiresIn:1000*60*60*24*7})
}

export function verifyAccessToken(token){
    return jwt.verify(token,"skhdjkaghruu23i7489haskjy",{expiresIn:1000*60*60*24*7})
}

export function verifyRefreshToken(token){
    return jwt.verify(token,"skhdjkaghruu23i7489haskjy786324876328746",{expiresIn:1000*60*60*24*7})
}


export function sha256Hash(data){
    return crypto.createHash('sha256').update(data).digest('hex');
}