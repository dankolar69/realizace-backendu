const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/article/getAbl");
const ListAbl = require("../abl/article/listAbl");
const CreateAbl = require("../abl/article/createAbl");
const UpdateAbl = require("../abl/article/updateAbl");
const DeleteAbl = require("../abl/article/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
