import { spawnSync } from "child_process";
import Generator from "yeoman-generator";
export default class Stm32 extends Generator {
    setupAnswer;
    stm32List = [];
    genlinkPath = './generators/app/templates/genlink.py';
    deviceDataPath = './generators/app/templates/devices.data';
    programDependencies = [
        {
            name: 'cmake',
            args: ['--version']
        },
        {
            name: 'arm-none-eabi-c++',
            args: ['--version']
        },
        {
            name: 'python',
            args: ['--version']
        }
    ];
    argumentsHelp() {
        return "hello";
    }
    help() {
        const help = {
            projectName: {
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
            sourceFolder: {
                command: "--option",
                description: "this is option to disable some option"
            },
            buildFolder: {
                command: "--option",
                description: "this is option to disable some option"
            },
        };
        return `Project Name: ${help.projectName.description}, Version: ${help.version.description}`;
    }
    constructor(args, opts) {
        super(args, opts);
        this.option("name");
        const listStm32DeviceRegex = /(stm32[\w][\d])/g;
        const deviceData = this.fs.read(this.deviceDataPath);
        this.stm32List = [...new Set(deviceData?.match(listStm32DeviceRegex))];
    }
    // Your initialization methods (checking current project state, getting configs, etc)
    initializing() {
        this.log("🧼 Checking Dependencies...");
        this.programDependencies.forEach((program) => {
            try {
                this.spawnSync(program.name, program.args, {
                    stdio: 'ignore'
                });
                this.log(`\t✔️Found ${program.name}`);
            }
            catch (error) {
                const execaError = error;
                this.log(`\t❌ Not Found ${program.name}: ${execaError.code}, Please Install After Configuration Complete`);
            }
        });
    }
    //  Where you prompt users for options (where you’d call this.prompt())
    async prompting() {
        let isFail = true;
        let archDev;
        this.setupAnswer = await this.prompt([
            {
                prefix: '📦',
                type: "input",
                name: "projectName",
                message: "What Your Project Name? ",
                validate: (answer) => {
                    if (answer === '')
                        return "Please Enter Project Name";
                    else
                        return true;
                },
            },
            {
                prefix: '🛁',
                type: "input",
                name: "sourceFolder",
                message: "Source Folder Name?",
                default: 'src',
                validate: (answer) => {
                    if (answer === '')
                        return "Please Enter Project Source Folder Name (default: src)";
                    else
                        return true;
                },
            },
            {
                prefix: '🔨',
                type: "input",
                name: "buildFolder",
                message: "Build Folder Name?",
                default: 'build',
                validate: (answer) => {
                    if (answer === '')
                        return "Please Enter Project build Folder Name (default: build)";
                    else
                        return true;
                },
            }
        ]);
        while (isFail) {
            archDev = await this.prompt([
                {
                    prefix: '🏰',
                    type: "list",
                    name: "arch",
                    message: "Choose STM32 Architecture",
                    choices: this.stm32List
                },
                {
                    prefix: '🍚',
                    type: 'input',
                    name: 'fullDeviceName',
                    message: 'What Your Full Device Name (ex: stm32f407vgt6)',
                    validate: (answer) => {
                        if (answer === '')
                            return "Please Enter Device Name";
                        try {
                            const result = spawnSync('python', [this.genlinkPath, this.deviceDataPath, answer, "FAMILY"], {
                                encoding: 'utf8'
                            });
                            return result.stdout !== '' ? true : 'Device Not Found';
                        }
                        catch (error) {
                            return 'Error!';
                        }
                    },
                }
            ]).then((answer) => {
                if (!answer.fullDeviceName.includes(answer.arch)) {
                    this.log(`❌ Make Sure To Choose Correct Architecture and Full Device Name, ${answer.fullDeviceName} not compitable with ${answer.arch}`);
                }
                else {
                    isFail = false;
                }
                return answer;
            });
        }
    }
    // Saving cnfigurations and configure the project (creating .editorconfig files and other metadata files)
    configuring() {
    }
    // Where you write the generator specific files (routes, controllers, etc)
    writing() {
        this.log(this.setupAnswer);
    }
    // Where installations are run (npm, bower)
    install() {
    }
    // Called last, cleanup, say good bye, etc
    end() {
    }
}
