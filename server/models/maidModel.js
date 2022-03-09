const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const maidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name! "],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "There is already an account with this email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password length must be more than 7"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  mobileNumber: {
    type: String,
    required: [true, "Please provide your mobile number! "],
    // validate: [
    //   validator.isMobilePhone(),
    //   "Please eneter a valid mobile number! ",
    // ],
  },
  address: {
    type: [String],
    required: [true, "Please provide your address"],
    trim: true,
  },

  dob: {
    type: Date,
    required: [true, "please provide you date of birth! "],
    min: ["1960-01-01", "invalid date of birth"],
    max: ["2015-01-01", "invalid date of birth"],
  },
  gender: {
    type: String,
    required: [true, "please provide your gender"],
    enum: ["Male", "Female", "Other"],
  },
  aadhaarNumber: {
    type: String,
    required: [true, "Please provide your aadhar card number! "],
  },

  services: [
    {
      type: String,
      enum: ["Cleaning", "Cooking", "Laundry", "Elderly Care", "Baby Sitting"],
    },
  ],
  price: {
    type: Number,
    min: 2000,
    max: 50000,
    default: 2000,
  },

  availability: {
    type: Boolean,
    default: true,
  },
  experience: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//middlewares works only when creating and saving

//1. record time of password changing
maidSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //because token get send before saving password
  next();
});

//2.encrypting password
maidSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//methods on this schema
//checking password
maidSchema.methods.correctPassword = async function (password, truePassword) {
  return await bcrypt.compare(password, truePassword);
};

const Maid = mongoose.model("Maid", maidSchema);
module.exports = Maid;