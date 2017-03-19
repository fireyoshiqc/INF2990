import * as express from 'express';

import { SudokuManager } from '../services/sudokuManager.service';
import { Difficulty } from '../services/sudoku.service';
import { NameManagerService } from '../services/nameManager.service';
import { DatabaseService } from '../services/database.service';

const router = express.Router();
let sudokuManager = new SudokuManager();
let nameManager = new NameManagerService();
let database = new DatabaseService();

database.connect();

router.get('/log', function (req, res) {
    console.log(sudokuManager.getNumberOfEasySudokus() +
        " " + sudokuManager.getNumberOfHardSudokus());
    res.render("log",
        {
            easy: sudokuManager.getNumberOfEasySudokus(),
            hard: sudokuManager.getNumberOfHardSudokus(),
            list: sudokuManager.getLogger().getLog()
        });
});

router.get('/getSudoku/easy', (req, res) => {
    let easySudoku = sudokuManager.getSudoku(Difficulty.Easy);
    let clientIp = req.connection.remoteAddress + ":" + req.connection.remotePort;
    if (clientIp.includes("ffff")) {
        clientIp = clientIp.substr(7);
    }
    sudokuManager.getLogger()
        .logEvent("DEMANDE", clientIp);
    res.send({ grid: easySudoku.grid, difficulty: easySudoku.difficulty });
});

router.get('/getSudoku/hard', (req, res) => {
    let hardSudoku = sudokuManager.getSudoku(Difficulty.Hard);
    let clientIp = req.connection.remoteAddress + ":" + req.connection.remotePort;
    if (clientIp.includes("ffff")) {
        clientIp = clientIp.substr(7);
    }
    sudokuManager.getLogger()
        .logEvent("DEMANDE", clientIp);
    res.send({ grid: hardSudoku.grid, difficulty: hardSudoku.difficulty });
});

router.get('/getHighscores', (req, res) => {
    database.getHighscores()
        .then((highscores) => res.send(highscores))
        .catch((error) => res.send(error));
});

router.post('/validateSudoku', (req, res) => {
    let result = sudokuManager.verifySudoku(req.body);
    res.send(result);
});

router.post('/validateName', (req, res) => {
    res.send(nameManager.validateName(req.body.name));
});

router.post('/removeName', (req, res) => {
    res.send(nameManager.removeName(req.body.name));
});

router.put('/addScore', (req, res) => {
    database.addScore(req.body.name, req.body.time, req.body.difficulty)
        .then((added) => res.send(added))
        .catch((error) => res.send(error));
});

export default router;



