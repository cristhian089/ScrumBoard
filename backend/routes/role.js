const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role");

//GET POST PUT DELETE
//http://localhost:3001/api/role/registerRole
router.post("/registerRole", RoleController.registerRole );
//http://localhost:3001/api/role/listRole
router.get("/listRole",RoleController.listRole);

module.exports = router;