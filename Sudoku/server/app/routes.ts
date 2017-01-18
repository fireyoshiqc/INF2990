import * as express from 'express';

module Route {

  export class Index {

    public index(req: express.Request, res: express.Response, next: express.NextFunction) {
      res.send('Hello world');
    }
  }
}

export = Route;
