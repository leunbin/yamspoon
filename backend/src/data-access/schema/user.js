const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId : {
      type : String,
      required : true,
    },

    name : {
      type : String,
      required : true,
    },

    email : {
      type : String,
      required : true,
    },

    password : {
      type : String,
      required : true,
    },

    nickname : {
      type : String,
      required : true,
    },

    isAdmin : {
      type : Boolean,
      default : false
    },

    recipe : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Recipe',
    }],

    ingredients : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Ingredients'
    }],

  }
);

module.exports = userSchema;