const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const glob = require("glob");
const mkdirp = require("mkdirp"); // 创建目录
module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the wonderful ${chalk.red("generator-app-demo")} generator!`
      )
    );

    const prompts = [
      {
        type: "text",
        name: "name",
        message: "项目名字?",
        default: "test-demo"
      },
      {
        type: "text",
        name: "description",
        message: "项目描述?",
        default: ""
      },
      {
        type: "text",
        name: "author",
        message: "亲爱的，项目的作者谁?",
        default: ""
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      console.log(props);
      this.props = props;
    });
  }

  // 创建项目目录
  default() {
    console.log(this.props.name);
    console.log(path.basename(this.destinationPath()));
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(`\nYour generator must be inside a folder named
        ${this.props.name}\n
        I will automatically create this folder.\n`);

      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  }

  writing() {
    this._copyFiles('.*'); // .xxx 配置文件
    this._copyFiles('*');  // 剩下所有文件
    this._writingPackageJSON();
  }

  // 以下划线_开头的是私有方法
  _writingPackageJSON() {
    const packJson = this.fs.readJSON(this.templatePath("package.json"));
    const data = Object.assign(packJson, {
      name: this.props.name,
      description: this.props.description,
      author: this.props.author
    });
    this.fs.writeJSON(this.destinationPath("package.json"), data);
  }

  _copyFiles (pattern) {
    let files = glob.sync(`${this.templatePath()}/${pattern}`);
    files.map(filepath => {
      const fileName = path.basename(filepath);
      this.fs.copy(this.templatePath(fileName), this.destinationPath(fileName));
    });
  }

  install() {
    this.installDependencies();
  }
};
