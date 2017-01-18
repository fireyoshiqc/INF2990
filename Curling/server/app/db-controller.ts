
class DbController  {

    constructor(id: number){
        this.id = id;
    }

    /**
     * name
     */
    public getSomething() {
        return "Something";
    }
    public getId(){
        return this.id;
    }
    private id : number;
};

export {DbController}