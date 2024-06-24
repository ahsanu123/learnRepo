import Generator, { BaseFeatures, BaseOptions } from "yeoman-generator";

export default class subCommand extends Generator {
  constructor(args: BaseOptions, opts: BaseFeatures) {
    super(args, opts);
    this.log("new Templates Hello")
  }

}

