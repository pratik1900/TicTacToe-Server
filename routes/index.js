const router = require("express").Router();
const { startGame } = require("../conrollers");

router.route("/play").post(startGame);

module.exports = router;
