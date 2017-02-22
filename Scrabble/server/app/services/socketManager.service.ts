/**
 * socketManager.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/19
 */

import { Room } from '../classes/room';
import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
    sio: SocketIO.Server;
    constructor(server: http.Server) {
        this.sio = io.listen(server);
        this.handleSockets();
    }
    private handleSockets() {
        this.sio.on('connection', (socket) => {

        });
    }
}
