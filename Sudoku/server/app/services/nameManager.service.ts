
export class NameManagerService {

    names: Array<string>;

    constructor() {
        this.names = new Array<string>();
    }

    validateName(name: string): boolean {
        if (name.length >= 4 && this.names.findIndex(listedName => (listedName === name)) === -1) {
            this.names.push(name);
            console.log(this.names);
            return true;
        }
        else {
            return false;
        }
    }
    removeName(name: string): boolean {
        let index = this.names.findIndex(listedName => (listedName === name));
        console.log(this.names);
        if (index !== -1) {
            this.names.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
}