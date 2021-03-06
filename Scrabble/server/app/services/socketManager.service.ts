/**
 * socketManager.service.ts
 *
 * @authors Félix Boulet
 * @date 2017/02/19
 * @modified by Mikael Ferland, Pierre To on 2017/03/07
 */

import * as io from 'socket.io';
import * as http from 'http';
import { RoomManager } from './roomManager.service';
import { PlayerManager } from './playerManager.service';
import { CommandHandler } from './commandHandler.service';
import { Player } from '../classes/player';
import { Room } from '../classes/room';

export class SocketManager {
    private sio: SocketIO.Server;
    private roomManager: RoomManager;
    private playerManager: PlayerManager;
    private commandHandler: CommandHandler;
    private readySockets: Array<string>;

    constructor(server: http.Server) {
        this.sio = io.listen(server);
        this.roomManager = new RoomManager();
        this.playerManager = new PlayerManager();
        this.commandHandler = new CommandHandler(this.sio, this.roomManager);
        this.readySockets = [];
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {

            socket.on('chat message', (msg: string) => {
                this.sendMessage(socket, msg);
            });

            socket.on('disconnect', (msg: any) => {
                setTimeout(() => {
                    this.disconnectUser(socket);
                }, 4000);
            });

            socket.on('cwValidateName', (name: string) => {
                let validity = this.playerManager.validateName(name);
                socket.emit('wcNameValidated', validity);
            });

            socket.on('cwAddPlayer', (player: any) => {
                this.addPlayer(socket, player);
            });

            socket.on('cwJoinRoom', (player: any) => {
                this.joinRoom(socket, player);
            });

            // Allows client to leave a specific room
            socket.on('cwLeaveRoom', (player: any) => {
                this.leaveRoom(socket, player);
            });

            // Initializes the scrabble game in a specific room
            socket.on('cwStartGame', (roomID: number) => {
                this.initGame(socket, roomID);
            });

            socket.on('cwGameCompLoaded', (roomID: number) => {
                this.initPlayerGame(socket, roomID);
            });
        });
        // Updates the information in the all rooms (waiting or playing)
        setInterval(() => {
            this.updateAllRooms();
        }, 1000);
    }

    private sendMessage(socket: SocketIO.Socket, msg: string): void {
        let player = this.playerManager.getPlayerFromSocketID(socket.id);

        if (player !== undefined) {
            if (this.commandHandler.isACommand(msg)) {
                this.commandHandler.handleCommand(msg, player);
            } else {
                // Regular message
                this.sio.sockets
                    .in(player.getRoomId().toString())
                    .emit('message sent', { username: player.getName(), submessage: msg });
            }
        }
    }

    private addPlayer(socket: SocketIO.Socket, player: any): void {
        // Create a new player in the playerManager
        this.playerManager.addPlayer(player.name, socket.id);
    }

    private joinRoom(socket: SocketIO.Socket, player: any): void {
        // Find (or create) a room in room manager service
        let room = this.roomManager.createRoom(player.capacity);

        let joinPlayer = this.playerManager.getPlayerFromSocketID(socket.id);

        // Allows client to join a specific room
        joinPlayer.setRoomId(room.getRoomInfo().roomID);
        room.addPlayer(joinPlayer);

        socket.join(room.getRoomInfo().roomID.toString());
        this.sio.emit('wcFindRoom', room.getRoomInfo());
    }

    private leaveRoom(socket: SocketIO.Socket, leavingPlayer: any): void {
        let playerInGame = this.playerManager.getPlayerFromSocketID(socket.id);

        if (playerInGame !== undefined) {
            let room = this.roomManager.findRoom(playerInGame.getRoomId());

            // Will skip to the next player if the leaving player was the active player
            this.roomManager.leaveRoom(leavingPlayer.name, leavingPlayer.roomID);
            socket.leave(leavingPlayer.roomID.toString());

            this.sendLeaveMessage(playerInGame, room);
        }
    }

    private initGame(socket: SocketIO.Socket, roomID: number): void {
        let room = this.roomManager.findRoom(roomID);
        let gameMaster = room.getGameMaster();

        if (!gameMaster.isGameStarted()) {
            gameMaster.startGame();
        }
    }

    private initPlayerGame(socket: SocketIO.Socket, roomID: number): void {
        let room = this.roomManager.findRoom(roomID);
        let gameMaster = room.getGameMaster();
        let player = gameMaster.getPlayers().find(p => p.getSocketId() === socket.id);

        if (player) {

            let playerSocket = this.sio.sockets.connected[socket.id];

            if (playerSocket !== undefined) {
                let msg = "Jeu initialisé. Ordre des joueurs :";
                gameMaster.getPlayers().forEach(p => {
                    msg += " " + p.getName();
                });
                msg += ". Joueur actif : " + gameMaster.getActivePlayer().getName() + ".";

                playerSocket.emit('message sent', { username: "Scrabble Game", submessage: msg });

                // Updates the rack of the player that's ready to play.
                playerSocket.emit('wcUpdateRack', player.getLettersRack());

            } else {
                console.log("There is an unconnected player! Player : " + player.getName());
            }
        } else {
            console.log("Could not find player with specified socket ID! Socket : " + socket.id);
        }
    }

    private updateAllRooms(): void {
        for (let room of this.roomManager.getExistingRooms()) {
            let id = room.getRoomInfo().roomID as number;
            let gameMaster = room.getGameMaster();

            // Update informations in playing rooms
            if (gameMaster.isGameStarted()) {
                if (gameMaster.isNextTurn() && !gameMaster.isGameOver()) {
                    // Send !passer message automatically
                    this.commandHandler.handleCommand("!passer", gameMaster.getActivePlayer());
                    // Put nextTurn to false
                    gameMaster.resetNextTurn();
                }
                gameMaster.checkTurnOver();
                this.sio.sockets.in(id.toString()).emit('wcUpdateTurnInfo', gameMaster.getTurnInfo());
            } else { // Update informations in waiting rooms
                this.sio.sockets.in(id.toString()).emit('wcRefresh', room.getRoomInfo());
            }
        }
    }

    private disconnectUser(socket: SocketIO.Socket): void {
        let player = this.playerManager.getPlayerFromSocketID(socket.id);

        if (player !== undefined) {
            let room = this.roomManager.findRoom(player.getRoomId());

            // Will skip to the next player if the leaving player was the active player
            this.roomManager.leaveRoom(player.getName(), player.getRoomId());
            this.playerManager.removePlayer(player.getName());

            this.sendLeaveMessage(player, room);

            // Remove the player's socket from the ready sockets list since it's not in a game anymore.
            this.readySockets.splice(this.readySockets.indexOf(socket.id), 1);
        }
        console.log("User disconnected");
    }

    private sendLeaveMessage(player: Player, room: Room): void {
        // Send a message to every player in the game room
        if (room !== undefined && room.getGameMaster().isGameStarted()) {
            let disconnectMsg = "L'utilisateur a quitté la partie.";

            if (!room.getGameMaster().isGameOver()) {
                disconnectMsg += " Ses lettres vont être remises dans la réserve." +
                    " Le joueur actif est " + room.getGameMaster().getActivePlayer().getName() + ".";
            }

            this.sio.sockets
                .in(player.getRoomId().toString())
                .emit('user disconnect', { username: player.getName(), submessage: disconnectMsg });
        }
    }
}
