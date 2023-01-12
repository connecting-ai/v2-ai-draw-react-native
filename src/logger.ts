class Logger {
    private status:string = '';

    public getLog(){
        return this.status;
    }

    public setLog(val:string){
        console.log(val)
        this.status = val;
    }

}

export default new Logger()