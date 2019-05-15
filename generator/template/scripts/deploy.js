const fs = require("fs");
const ora = require("ora");
const path = require("path");
const chalk = require("chalk");
const { prompt } = require("inquirer");
const { spawn } = require("child_process");

class Deploy {
  constructor() {
    const { presetPrompt, optionsPrompt, hasPresets } = this.resolvePrompts();
    this.hasPresets = hasPresets;
    this.presetPrompt = presetPrompt;
    this.optionsPrompt = optionsPrompt;

    this.spinner = ora();

    this.promptAndResolvePreset();
  }

  async promptAndResolvePreset() {
    const prompts = this.resolveFinalPrompts();
    const answers = await prompt(prompts);

    let options;

    if (answers.preset && answers.preset !== "__manual__") {
      options = await this.resolvePreset(answers.preset);
    } else {
      // 手动配置
      const { save, saveName, ...scpOptions } = answers;
      options = scpOptions;

      // save preset
      if (save && saveName) {
        savePreset(saveName, options);
      }
    }

    this.scpOptions = options;
    this.build();
  }

  // 加载交互式弹窗列表
  resolvePrompts() {
    const presets = this.getPresets();
    const presetChoices = Object.keys(presets).map(name => {
      return {
        name: `${name} (${presets[name]["host"]})`,
        value: name
      };
    });

    const presetPrompt = {
      type: "list",
      name: "preset",
      message: `检测到该项目存在预设的部署配置，请选择`,
      choices: [
        ...presetChoices,
        {
          name: "不使用预设，手动配置部署",
          value: "__manual__"
        }
      ]
    };

    const optionsPrompt = [
      {
        type: "input",
        name: "host",
        message: "部署服务器地址",
        validate(input) {
          if (!input) return "请输入[服务器ip地址]或[网站域名]";
          return true;
        }
      },
      {
        type: "input",
        name: "username",
        message: "部署服务器登录用户名",
        default() {
          return "root";
        }
      },
      {
        mask: "*",
        type: "password",
        name: "password",
        message: "部署服务器登录密码",
        validate(input) {
          if (!input) return "请输入服务器登录密码";
          return true;
        }
      },
      {
        type: "input",
        name: "path",
        message: "部署路径",
        default() {
          return "/www/public";
        }
      },
      {
        type: "input",
        name: "dist",
        message: "本地路径",
        default() {
          return path.resolve(process.cwd(), "./dist");
        }
      },
      {
        type: "confirm",
        name: "save",
        message: "是否保存当前配置",
        default: false
      },
      {
        type: "input",
        name: "saveName",
        when: answers => answers.save,
        message: "请输入当前配置别名"
      }
    ];

    return {
      presetPrompt,
      optionsPrompt,
      hasPresets: presetChoices.length > 0
    };
  }

  // 加载预设配置
  getPresets() {
    const globalOptions = loadOptions();
    return Object.assign({}, globalOptions.presets);
  }

  // 组合最终的交互列表
  resolveFinalPrompts() {
    if (this.hasPresets) {
      // 拦截 prompt.when
      this.optionsPrompt.forEach(prompt => {
        const originalWhen = prompt.when || (() => true);
        prompt.when = answers => {
          return isManualMode(answers) && originalWhen(answers);
        };
      });

      return [this.presetPrompt, ...this.optionsPrompt];
    } else {
      return this.optionsPrompt;
    }
  }

  async resolvePreset(name) {
    let preset;
    const savedpresets = loadOptions().presets || {};
    if (name in savedpresets) {
      preset = savedpresets[name];
    }

    if (!preset) {
      console.log(chalk.red(`预设配置 "${name}" 不存在`));
      const presets = Object.keys(savedpresets);
      if (presets.length) {
        console.log();
        console.log(`已保存的预设配置有：\n${presets.join(`\n`)}`);
      } else {
        console.log(`暂无已保存的预设配置`);
      }
      process.exit(1);
    }

    return preset;
  }

  // 打包项目
  build() {
    const build = spawn("yarn", ["build"], {
      stdio: "inherit",
      // windows 下启用 shell，隐式调用 cmd
      shell: process.platform === "win32"
    });

    build.on("exit", code => {
      code === 0 &&
        (console.log("\n"),
        this.spinner.succeed("静态资源构建成功，开始上传静态文件"),
        this.spinner.start("正在上传...，请耐心等待"),
        this.uploadByScp(),
        build.kill());
    });

    build.on("error", err => {
      console.log(err);
    });
  }

  uploadByScp() {
    return new Promise((resolve, reject) => {
      const client = require("scp2");
      const { dist, ...options } = this.scpOptions;
      client.scp(dist, options, err => {
        err ? reject(err) : resolve();
      });
    })
      .then(() => {
        this.spinner.succeed("上传完毕，部署成功");
      })
      .catch(err => {
        console.log(
          chalk.bgRed(`\n上传文件出错：\n`) + chalk.red(`    ${err.toString()}`)
        );
        console.log(err);
        process.exit(1);
      });
  }
}

/**------------------------
 *  utils
 **-----------------------**/

// 配置文件绝对路径
const rcPath = path.resolve(process.cwd(), ".deployrc");

// 加载全局配置项
let globalOptions;
function loadOptions() {
  if (globalOptions) return globalOptions;

  if (fs.existsSync(rcPath)) {
    try {
      globalOptions = JSON.parse(fs.readFileSync(rcPath, "utf-8"));
    } catch (err) {
      console.log(chalk.bgRed("加载配置文件失败：\n"));
      console.log(
        chalk.red(
          `    ` +
            chalk.underline(rcPath) +
            ` 文件损坏或存在语法错误，请修复或直接移除该文件\n`
        )
      );
      console.log(err);
      process.exit(1);
    }

    return globalOptions;
  }

  return {};
}

// 保存全局配置
function saveOptions(toSave) {
  // 简版 cloneDeep
  // TODO cloneDeep
  const globalOptions = JSON.parse(JSON.stringify(loadOptions()));
  const options = Object.assign({}, globalOptions, toSave);
  fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
}

// 保存预设
function savePreset(name, preset) {
  // 简版 cloneDeep
  // TODO cloneDeep
  const presets = JSON.parse(JSON.stringify(loadOptions().presets || {}));
  presets[name] = preset;
  saveOptions({ presets });
}

// 判断是否选择手动设置部署选项
const isManualMode = answers => answers.preset === "__manual__";

new Deploy();
