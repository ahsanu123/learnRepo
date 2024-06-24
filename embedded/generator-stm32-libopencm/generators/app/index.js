import Generator from "yeoman-generator";
export default class Stm32 extends Generator {
    setupAnswer;
    architecture = '';
    _private_listStm32Family() {
        const family = [];
        for (let i = 0; i < 8; i++) {
            const prefix = 'STM32F';
            family.push({
                name: prefix.toLowerCase() + i,
                value: prefix + i,
                description: prefix + i + " Family"
            });
        }
        return family;
    }
    constructor(args, opts) {
        super(args, opts);
        this.option("name");
    }
    async askQuestion() {
        const listPrompt = [];
        if (this.options.projectName == undefined) {
            listPrompt.push({
                prefix: '📦',
                type: "input",
                name: "projectName",
                message: "What Your Project Name? "
            });
        }
        else {
            this.setupAnswer["projectName"] = this.options.projectName;
        }
        listPrompt.push({
            prefix: '🏰',
            type: "list",
            name: "arch",
            message: "Choose STM32 Architecture ",
            choices: this._private_listStm32Family()
        });
        this.setupAnswer = await this.prompt(listPrompt);
    }
    writing() {
        this.log("Object: ", JSON.stringify(this.options.option));
    }
}
