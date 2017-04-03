/**
 * rest.api.ts
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import * as express from 'express';
import * as indexRoute from '../routes';

import { NameManagerService } from '../services/nameManager.service';
import { DatabaseService } from '../services/database.service';

const router = express.Router();
let nameManager = new NameManagerService();
let database = new DatabaseService();

database.connect();

// Create routes
const index: indexRoute.Index = new indexRoute.Index();

// Home page
router.get('/', index.index.bind(index.index));

router.get('/getHighscores', (req, res) => {
    database.getHighscores()
        .then((highscores) => res.send(highscores))
        .catch((error) => res.send(error));
});

router.post('/validateName', (req, res) => {
    res.send(nameManager.validateName(req.body.name));
});

router.post('/removeName', (req, res) => {
    res.send(nameManager.removeName(req.body.name));
});

router.put('/addScore', (req, res) => {
    database.addScore(req.body.name, req.body.playerScore, req.body.aiScore, req.body.difficulty)
        .then((added) => res.send(added))
        .catch((error) => res.send(error));
});

export default router;
