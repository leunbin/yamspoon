const { all } = require('../router/recipeRouter');
const { User } = require('./model');
const { Ingredient } = require('./model');
const { Recipe } = require('./model');

class UserDAO {

  //@desc get userInfo
  async findUserById (id) {
    const user = await User.findById(id);
    return user;
  }

  //@desc find user by userId
  async findUserByUserId (userId) {
    const user = await User.findOne({ userId });
    return user;
  }

  //@desc find user by nickname
  async findUserByNickname (nickname) {
    const user = await User.findOne({ nickname });
    return user;
  }

  //@desc create userInfo
  async create ({ userId, name, email, password, nickname, isAdmin }) {
    const user = await User.create({ userId, name, email, password, nickname, isAdmin });
    return user;
  }

  //@desc update userInfo
  async updateUser (id, { userId, name, email, password, nickname, isAdmin, ingredients, recipe }) {
    const updateUser = await User.findByIdAndUpdate (
      id, 
      { userId, 
        name, 
        email, 
        password, 
        nickname, 
        isAdmin,
        ingredients,
        recipe
      },
      {
        runValidators: true,
        new: true,
      });

      // console.log(updateUser);

    return updateUser;
  }

  //@desc delete userInfo
  async deleteUser (id) {
    return User.findByIdAndDelete(id);
  }

  //@ get user fridge
  async findFirdgeById (id) {
    const userFridge = await User.findById(id).populate('ingredients').lean();

    if (!userFridge ) {
      throw new Error ('userFridge not found');
    }

    return userFridge;
  }

  //@desc update ingredients in fridge
  async updateIngredients(id, ingredientInfo) {
    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }
  
    const ingredients = await Promise.all(ingredientInfo.map(async (ingredientId) => {
      const ingredient = await Ingredient.findById(ingredientId);

      if(!ingredient) {
        throw new Error(`Invalid Ingredient ID : ${ingredientId}`);
      }
      return ingredient;
    }))

    user.ingredients = ingredients;
    
    await user.save(); 
  
    return user;
  }
  
  //@desc update bookmark recipe 
  async updateBookmark(id, recipeInfo) {
    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }
  
    const recipes = await Promise.all(recipeInfo.map(async (recipeId) => {
      
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        throw new Error(`Invalid Recipe ID: ${recipeId}`);
      }
      return recipe;
    }));

    user.recipe = recipes;
  
    await user.save(); 
  
    return user;
  }

  //@desc find userId
  async finduserId ( name, email ) {
    const user = await User.findOne ( { name, email });
    return user;
  }

  //@desc find user password
  async finduserPassword ( userId, email ) {
    const user = await User.findOne ( { userId, email });
    return user;
  }

  //@desc find own's recipe
  async findOwnRecipe (id) {
    const recipe = await Recipe.find({creatorId : id});
    console.log(id);
    return recipe;
  }

}

module.exports = new UserDAO();
