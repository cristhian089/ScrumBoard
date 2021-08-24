const User = require("../models/user");
const bcrypt = require("bcrypt");
const Role = require("../models/role");
const mongoose = require("mongoose");

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send("Process failed: Incomplete data");

  let existingUser = await User.findOne({ email: req.body.email });
  if (existingUser)
    return res
      .status(400)
      .send("Process failed: The email user is already registered");

  let hash = await bcrypt.hash(req.body.password, 10);

  let role = await Role.findOne({ name: "user" });
  if (!role)
    return res.status(400).send("Process failed: No role was assigned");

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    dbStatus: true,
  });

  let result = await user.save();
  if (!result) return res.status(400).send("Failed to register user");

  try {
    let jwt = user.generateJWT();
    return res.status(200).send({ jwt });
  } catch (e) {
    return res.status(400).send("Failed ");
  }
};

// ('/Az\25/&&'%')
const listUser = async (req, res) => {
  let user = await User.find({ name: new RegExp(req.params["name"], "i") })
    .populate("roleId")
    .exec();
  if (!user || user.length === 0) return res.status(400).send("No users");
  return res.status(200).send({ user });
};

const registerAdmin = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send("Process failed: Incomplete data");

  let validId = await mongoose.Types.ObjectId.isValid(req.body.roleId);
  if (!validId) return res.status(400).send("Porcess failed: Invalid role Id");

  let existingUser = await User.findOne({ email: req.body.email });
  if (existingUser)
    return res
      .status(400)
      .send("Process failed: The email user is already registered");

  let hash = await bcrypt.hash(req.body.password, 10);

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    roleId: req.body.roleId,
    dbStatus: true,
  });

  let result = await user.save();
  if (!result) return res.status(400).send("Failed to register user");

  try {
    let jwt = user.generateJWT();
    return res.status(200).send({ jwt });
  } catch (e) {
    return res.status(400).send("Failed ");
  }
};
const updateUser = async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send("Process failed: Incomplete data");

  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    let userFind = await User.findOne({ email: req.body.email });
    pass = userFind.password;
  }

  let user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });

  if (!user) return res.status(400).send("Process failed: Error editing user");
  return res.status(200).send({ user });
};
const deleteUser = async (req, res) => {
  if (!req.body._id)
  return res.status(400).send("Process failed: Incomplete data");

  const user = await User.findByIdAndUpdate(req.body._id,{
    dbStatus:false,
  })
  if(!user) return res.status(400).send("Process failed: Error delete user")
  return res.status(200).send({ user });
};

module.exports = {
  registerUser,
  listUser,
  registerAdmin,
  updateUser,
  deleteUser,
};
