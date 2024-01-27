const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user']
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: [true, 'Email is required'],
    unique: true
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String,
  avatarUrl: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  verificationToken: {
    type: String,
  }
}, {versionKey: false, timestamps: true}
);

const User = model("User", userSchema);


module.exports = {
  User,
  userSchema,
};