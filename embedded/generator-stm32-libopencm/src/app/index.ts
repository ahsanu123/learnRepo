import Generator, { BaseFeatures, BaseOptions } from "yeoman-generator";


export default class Stm32 extends Generator {
  constructor(args: BaseOptions, opts: BaseFeatures) {
    super(args, opts);
    this.log("Hello!!")
  }

}
