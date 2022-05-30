"use strict";

module.exports = index;

const path = require('path')
const semver = require("semver");
const colors = require("colors");
const userHome = require("user-home")
const pathExists = require("path-exists").sync
const log = require("@allview-cli/log");

const pkg = require("../package.json");
const constant = require("./const");

let args;


function index() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
  } catch(e) {
    log.error(e.message)
  }
}

/**
 * 检查环境变量
 * 
 * * 将用户主目录中的 .env 读取到 process.env 中
 */
function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    })
  }

  createDefaultConfig()
  log.verbose('process env', process.env)
}

/**
 * 创建默认配置
 */
function createDefaultConfig() {
  const cliHome = path.join(userHome, constant.DEFAULT_CLI_HOME)
  process.env.CLI_HOME = cliHome
}

/**
 * 获取入参
 */
function checkInputArgs() {
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2))
  finalizeLogLevel()
}

/**
 * 根据入参确定日志打印级别
 */
function finalizeLogLevel() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}

/**
 * 检查用户主目录是否存在
 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前用户主目录不存在'))
  }
}

/**
 * 检查启动脚手架时是否是Root权限
 * 
 * * 避免使用类似 SUDO 一类的命令创建项目时项目文件夹权限过高
 */
function checkRoot() {
  const rootCheck = require("root-check")
  rootCheck()
}

/**
 * 检查Node.JS版本号
 */
function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;

  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`allview-cli 需要安装 ${lowestVersion} 以上版本的 Node.js`)
    );
  }
}

/**
 * 检查当前脚手架版本号
 */
function checkPkgVersion() {
  log.info("cli verion", pkg.version);
}
