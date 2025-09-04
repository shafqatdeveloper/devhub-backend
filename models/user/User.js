import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    refreshTokenHash: { type: String, default: null },

    // Profile fields
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    avatar: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },

    // Developer-specific
    skills: {
      type: [String],
      default: [],
    },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    // Community features
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    // Roles & permissions
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    verificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
    resetPasswordTokenExpires: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },
    isVerified: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
