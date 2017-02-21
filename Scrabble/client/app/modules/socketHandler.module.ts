import * as io from 'socket.io-client';


export module SocketHandler {

    let activeSockets: any = [];

    export function requestSocket(name?: string): any {
        let socket = io.connect('http://localhost:3000');
        if (name) {
            activeSockets[name] = socket;
        }
        return socket;
    }

    export function saveSocket(name: string, socket: any) {
        activeSockets[name] = socket;
    }

    export function getSavedSocket(name: string) {
        return activeSockets[name];
    }

}
