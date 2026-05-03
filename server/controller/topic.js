const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/topic/getAbl");
const ListAbl = require("../abl/topic/listAbl");
const CreateAbl = require("../abl/topic/createAbl");
const UpdateAbl = require("../abl/topic/updateAbl");
const DeleteAbl = require("../abl/topic/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
