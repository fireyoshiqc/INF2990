import { CurlingStone } from '../entities/curlingStone';

export class CurlingStonesManager {

    private curlingStones: CurlingStone[] = new Array();

    constructor() {
        this.curlingStones = new Array() as Array<CurlingStone>;
    }

    add(curlingStone: CurlingStone) {
        this.curlingStones.push(curlingStone);
    }

    get(): Array<CurlingStone> {
        return this.curlingStones;
    }
}
