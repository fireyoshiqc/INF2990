/**
 * nameManager.service.ts - Saves and removes active player names to and from the server.
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/03
 */

export class NameManagerService {

    private names: Array<string>;

    constructor() {
        this.names = new Array<string>();
    }

    validateName(name: string): boolean {
        if (name.length > 3 && name.charAt(0) !== " " && name.charAt(name.length - 1) !== " "
            && this.names.findIndex(listedName => (listedName === name)) === -1) {
            this.names.push(name);
            return true;
        }
        else {
            return false;
        }
    }

    removeName(name: string): boolean {
        let index = this.names.findIndex(listedName => (listedName === name));
        if (index !== -1) {
            this.names.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
}
