import * as express from 'express';

module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
      res.send('Hello world');
    }
    public glComponent(req: express.Request, res: express.Response, next: express.NextFunction): void {
      res.redirect('/glcomp');
    }

  }
}

export = Route;
