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

//import * as indexRoute from './routes';

import { SudokuManager } from './services/sudokuManager';

export class Application {

  public app: express.Application;
  public sudokuManager: SudokuManager;

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

    //configure this.application
    this.config();

    //configure routes
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
  }

  /**
   * The routes function.
   *
   * @class Server
   * @method routes
   */
  public routes() {

    let sudokuManager = this.getMananager();

    //let router: express.Router;
    //router = express.Router();

    //create routes
    //const index: indexRoute.Index = new indexRoute.Index();

    //home page
    //router.get('/', index.index.bind(index.index));
    this.app.get('/', function(req, res){
        res.send('Hello Erica');
    });

    this.app.get('/getSudoku/easy', function(req, res){
        // Get from mongo and remove it
        let easySudoku = sudokuManager.getEasySudoku();
        res.send(easySudoku);
    });

    this.app.get('/getSudoku/hard', function(req, res){
        // Get from mongo and remove it
        let hardSudoku = sudokuManager.getHardSudoku();
        res.send(hardSudoku);
    });

    // How validate sudoku while obeying rest api? Need to send something to the server and get a result back?
    // /sudoku/check (get the filled sudoku)
    this.app.post('/validateSudoku', function(req, res){
        let result = sudokuManager.verifySudoku(req.body);
        res.send(result);
    });

    //use router middleware
    //this.app.use(router);

    // Gestion des erreurs
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        let err = new Error('Not Found');
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
  }

  getMananager() : SudokuManager {
      return this.sudokuManager;
  }
}
