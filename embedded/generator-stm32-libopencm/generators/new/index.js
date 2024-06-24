import Generator from "yeoman-generator";
export default class subCommand extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.log("new Templates Hello");
    }
}
