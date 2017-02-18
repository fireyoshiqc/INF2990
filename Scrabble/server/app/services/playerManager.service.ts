/**
 *
 * @authors Vincent Chassé, Yawen Hou
 * @date 2017/02/17
 */

export class PlayerManager {

    playerNames: string[];

    constructor() {
        this.playerNames = new Array<string>();
     }

     validateName(name: string): Boolean {
        console.log("Validating name " + name);
        return this.playerNames.indexOf(name) === -1;
    }

    addPlayer(name: string) {
        this.playerNames.push(name);
    }

    removePlayer(name: string) {
        if (this.playerNames.indexOf(name) !== -1) {
            this.playerNames.splice(this.playerNames.indexOf(name));
        }
    }
}
