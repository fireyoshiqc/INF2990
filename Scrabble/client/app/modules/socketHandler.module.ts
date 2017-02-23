import * as io from 'socket.io-client';


export module SocketHandler {

    let activeSocket: SocketIOClient.Socket;

    export function requestSocket(server: string): any {

        if (activeSocket === undefined) {
            activeSocket = io.connect(server);
        }
        return activeSocket;
    }

    export function disconnectSocket() {
        console.log(activeSocket);
        activeSocket.disconnect();
        activeSocket = undefined;
    }

}
