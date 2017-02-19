/**
 * www.ts - Configure le serveur Node en vue d'accueillir l'application Express.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import { Application } from './app';
import * as http from 'http';
import * as io from 'socket.io';

const application: Application = Application.bootstrap();

// Configuration du port d'écoute
const appPort = normalizePort(process.env.PORT || '3000');
application.app.set('port', appPort);

// Création du serveur HTTP.
let server = http.createServer(application.app);

/**
 *  Écoute du traffic sur le port configuré.
 */
server.listen(appPort);
server.on('error', onError);
server.on('listening', onListening);

let sio = io.listen(server);

sio.on('connection', (socket) => {

    console.log("User connected");
    sio.emit('user connect', socket.id + "~ User has connected to chat.");

    socket.on('chat message', (msg: string) => {
        sio.emit('message sent', socket.id + " ~ " + msg);
        console.log(msg);
    });

    socket.on('disconnect', (msg: any) => {
        sio.emit('user disconnect', socket.id + "~ User has disconnected from chat.");
        console.log("User disconnected");
    });

    socket.on('cwValidateName', (name: string) => {
        sio.emit('wsValidateName', name);
    });

    socket.on('swNameValidated', (validity: boolean) => {
        sio.emit('wcNameValidated', validity);
    });

    socket.on('cwAddPlayer', (player : any) => {
        sio.emit('wsAddPlayer', player.name);
        //player.capacity si vous avez besoin
    });
});



/**
 * Normalise le port en un nombre, une chaîne de caractères ou la valeur false.
 *
 * @param val Valeur du port d'écoute.
 * @returns Le port normalisé.
 */
function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) { return val; }
    else if (port >= 0) { return port; }
    else { return false; }
}

/**
 * Se produit lorsque le serveur détecte une erreur.
 *
 * @param error Erreur interceptée par le serveur.
 */
function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') { throw error; }
    let bind = (typeof appPort === 'string') ? 'Pipe ' + appPort : 'Port ' + appPort;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Se produit lorsque le serveur se met à écouter sur le port.
 */
function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}
