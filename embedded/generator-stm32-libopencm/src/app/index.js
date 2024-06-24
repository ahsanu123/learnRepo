import Generator from "yeoman-generator";
export default class Stm32 extends Generator {
    setupAnswer;
    argumentsHelp() {
        return "hello";
    }
    help() {
        return "this is general help";
    }
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
        const help = {
            "projectName": {
                command: "--option",
                description: "this is option to disable some option"
            },
            version: {
                command: "--option",
                description: "this is option to disable some option"
            },
            fullDeviceName: {
                command: "--option",
                description: "this is option to disable some option"
            },
        };
        this.log(`Project Name: ${help.projectName.description}, Version: ${help.version.description}`);
    }
}
