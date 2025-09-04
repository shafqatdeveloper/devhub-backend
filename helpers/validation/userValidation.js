import Joi from "joi";



export const objectId = Joi.string().length(24).hex(); 
const url = Joi.string().uri({ scheme: ["http", "https"] });


const name = Joi.string().trim().min(2).max(50).required();
const username = Joi.string()
  .trim()
  .lowercase()
  .pattern(/^[a-z0-9_]+$/)
  .min(3)
  .max(30)
  .required();
const email = Joi.string().trim().lowercase().email().required();
const password = Joi.string().min(6).required();
const confirmPassword = Joi.any().valid(Joi.ref("password")).required().messages({ "any.only": "Passwords do not match" });

const bio = Joi.string().max(200);
const avatar = url;
const location = Joi.string().max(100);
const website = url;
const skills = Joi.array().items(Joi.string().trim().min(1)).max(50);

const socials = Joi.object({        
  github: url.allow(""),
  twitter: url.allow(""),
  linkedin: url.allow(""),
  portfolio: url.allow(""),
}).unknown(false);


export const registerSchema = Joi.object({
  name,
  username,
  email,
  password,
  confirmPassword,
  bio: bio.optional(),
  avatar: avatar.optional(),
  location: location.optional(),
  website: website.optional(),
  skills: skills.optional(),
  ...socials.describe().keys,
}).unknown(false);


export const loginSchema = Joi.object({
  emailOrUsername: email.optional(),     
  password: Joi.string().required(),
}).unknown(false);

