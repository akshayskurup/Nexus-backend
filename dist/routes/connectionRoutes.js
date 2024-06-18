"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connectionController_1 = require("../controller/connectionController");
const router = express_1.default.Router();
router.post('/follow', connectionController_1.follow);
router.post('/unfollow', connectionController_1.unFollow);
router.post('/get-connection', connectionController_1.getConnectionController);
// router.get('/get-friends/:userId',getFriends);
exports.default = router;
