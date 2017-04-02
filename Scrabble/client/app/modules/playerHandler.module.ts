/**
 * player.module.ts - handles a player during a session
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import { Player } from '../classes/player';

export module PlayerHandler {

    let activePlayer: Player;

    export function requestPlayer(): Player {

        if (activePlayer === undefined) {
            activePlayer = new Player();
        }
        return activePlayer;
    }

}
