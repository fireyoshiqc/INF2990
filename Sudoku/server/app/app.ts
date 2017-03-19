/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

// TODO : Remove comment below when routers will be required
// IDEA: import * as indexRoute from './routes';

import { SudokuManager } from './services/sudokuManager.service';
import { Difficulty } from './services/sudoku.service';
import { NameManagerService } from './services/nameManager.service';
import { DatabaseService } from './services/database.service';

export class Application {

    public app: express.Application;
    public sudokuManager: SudokuManager;
    public nameManager: NameManagerService;
    public database: DatabaseService;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    public static bootstrap(): Application {
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // Application instantiation
        this.app = express();

        // Instantiate sudoku manager
        this.sudokuManager = new SudokuManager();
        this.nameManager = new NameManagerService();
        this.database = new DatabaseService();

        // Configure this.application
        this.config();

        // Configure routes
        this.routes();
    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
        this.database.connect();

        this.app.set("view engine", "pug");
        this.app.set("views", path.join(__dirname, '../app/views'));
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes() {

        let self = this;

        // TODO : Remove comments below when routers will be required
        /*
         * let router: express.Router;
         * router = express.Router();
         *
         * create routes
         * const index: indexRoute.Index = new indexRoute.Index();
         *
         * home page
         * router.get('/', index.index.bind(index.index));
         */

        this.app.get('/', function (req, res) {
            console.log(self.sudokuManager.getNumberOfEasySudokus() +
                " " + self.sudokuManager.getNumberOfHardSudokus());
            res.render("log",
                {
                    easy: self.sudokuManager.getNumberOfEasySudokus(),
                    hard: self.sudokuManager.getNumberOfHardSudokus(),
                    list: self.sudokuManager.getLogger().getLog()
                });
        });

        this.app.get('/getSudoku/easy', function (req, res) {
            let easySudoku = self.sudokuManager.getSudoku(Difficulty.Easy);
            let clientIp = req.connection.remoteAddress + ":" + req.connection.remotePort;
            if (clientIp.substr(0, 7) === "::ffff:") {
                clientIp = clientIp.substr(7);
            }
            self.sudokuManager.getLogger()
                .logEvent("DEMANDE", clientIp);
            res.send({ grid: easySudoku.grid, difficulty: easySudoku.difficulty });
        });

        this.app.get('/getSudoku/hard', function (req, res) {
            let hardSudoku = self.sudokuManager.getSudoku(Difficulty.Hard);
            self.sudokuManager.getLogger()
                .logEvent("DEMANDE", req.connection.remoteAddress + ":" + req.connection.remotePort);
            res.send({ grid: hardSudoku.grid, difficulty: hardSudoku.difficulty });
        });

        this.app.get('/getHighscores', function (req, res) {
            self.database.getHighscores()
                .then((highscores) => res.send(highscores))
                .catch((error) => res.send(error));
        });

        this.app.post('/validateSudoku', function (req, res) {
            let result = self.sudokuManager.verifySudoku(req.body);
            res.send(result);
        });

        this.app.post('/validateName', function (req, res) {
            res.send(self.nameManager.validateName(req.body.name));
        });

        this.app.post('/removeName', function (req, res) {
            res.send(self.nameManager.removeName(req.body.name));
        });

        this.app.put('/addScore', function (req, res) {
            self.database.addScore(req.body.name, req.body.time, req.body.difficulty)
                .then((added) => res.send(added))
                .catch((error) => res.send(error));
        });

        // TODO : Remove comment below when routers will be required
        // IDEA : this.app.use(router);

        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            let err = new Error('Not Found');
            next(err);
        });

        // Development error handler
        // Will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        // Production error handler
        // No stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }
}
