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

import * as indexRoute from './routes';

import { NameManagerService } from './services/nameManager.service';

export class Application {

    public app: express.Application;
    public nameManager: NameManagerService;

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

        // Instantiate name manager
        this.nameManager = new NameManagerService();

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
    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../../client')));
        this.app.use(cors());
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes(): void {
        let router: express.Router;
        router = express.Router();

        let nameManager = this.getNameManager();

        // Create routes
        const index: indexRoute.Index = new indexRoute.Index();

        // Home page
        router.get('/', index.index.bind(index.index));

        // Use router middleware
        this.app.use(router);

        this.app.post('/validateName', (req, res) => {
            res.send(nameManager.validateName(req.body.name));
        });

        this.app.post('/removeName', (req, res) => {
            res.send(nameManager.removeName(req.body.name));
        });

        // Serve the Angular 2 app
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../client/index.html'));
            res.redirect('/');
        });

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
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // Production error handler
        // No stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }

    public getNameManager(): NameManagerService {
        return this.nameManager;
    }

}
