#! /usr/bin/env node

const importLocal = require('import-local')

const lib = require('../lib/index')

if (importLocal(__filename)) {

} else {
  lib()
}
