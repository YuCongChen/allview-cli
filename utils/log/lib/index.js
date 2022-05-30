"use strict";

const npmlog = require("npmlog");

const LOG_LEVEL = process.env.LOG_LEVEL;

// 判断是否开启DeBug模式的日志输出
npmlog.level = LOG_LEVEL ? LOG_LEVEL : "info";

// 日志前缀
npmlog.heading = "allview";

// 添加自定义level
npmlog.addLevel("success", 2000, { fg: "green", bold: true });

module.exports = npmlog;

