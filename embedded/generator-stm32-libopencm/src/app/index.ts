import { DistinctQuestion } from "inquirer";
import
Generator,
{
  BaseOptions,
  Storage
} from "yeoman-generator";


type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
  type?: never;
};

type Stm32Arguments = Stm32ArgumentsImpl & BaseOptions

type LocalPromptQuestion = DistinctQuestion & {
  name: string;
  storage?: Storage;
  store?: boolean;
}

interface Stm32ArgumentsImpl {
  projectName?: string,
  version?: number,
  option?: string
}

type SetupAnwer = 'projectName' | 'version'

export default class Stm32 extends Generator<Stm32Arguments> {
  private setupAnswer?: Record<SetupAnwer, any>;
  private architecture: string = ''

  _private_listStm32Family() {
    const family: Choice<string>[] = [];
    for (let i = 0; i < 8; i++) {
      const prefix = 'STM32F';
      family.push({
        name: prefix.toLowerCase() + i,
        value: prefix + i,
        description: prefix + i + " Family"
      })
    }
    return family;
  }

  constructor(args: any, opts: any) {
    super(args, opts);
    this.option("name")
  }

  async askQuestion() {
    const listPrompt: Array<LocalPromptQuestion> = []

    if (this.options.projectName == undefined) {
      listPrompt.push({
        prefix: '📦',
        type: "input",
        name: "projectName",
        message: "What Your Project Name? "

      })
    }
    else {
      this.setupAnswer!["projectName"] = this.options.projectName
    }

    listPrompt.push({
      prefix: '🏰',
      type: "list",
      name: "arch",
      message: "Choose STM32 Architecture ",
      choices: this._private_listStm32Family()

    })

    this.setupAnswer = await this.prompt(listPrompt)
  }
  writing() {
    this.log("Object: ", JSON.stringify(this.options.option))
  }
}