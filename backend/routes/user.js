const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const Auth = require("../middleware/auth");
const ValidateUser = require("../middleware/validateUser");
const Admin = require("../middleware/admin");

router.post("/registerUser", UserController.registerUser);

//http://localhost:3001/api/user/listUser/Pepa
router.get(
  "/listUser/:name?",
  Auth,
  ValidateUser,
  Admin,
  UserController.listUser
);
router.post(
  "/registerAdmin",
  Auth,
  ValidateUser,
  Admin,
  UserController.registerAdmin
);
router.put("/updateUser", Auth, ValidateUser, Admin, UserController.updateUser);
router.put("/deleteUser", Auth, ValidateUser, Admin, UserController.deleteUser);

module.exports = router;
