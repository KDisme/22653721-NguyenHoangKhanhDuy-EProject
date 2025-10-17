const User = require("../models/user");

/**
 * Class to encapsulate the logic for the user repository
 */
class UserRepository {
  async createUser(user) {
    return await User.create(user);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  async getUserById(userId) {
    return await User.findById(userId).select('-password');
  }
}

module.exports = UserRepository;
