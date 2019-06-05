// 引入commander插件
const program = require('commander')
// 引入文档
const pkg = require('../../package.json')
// 监听指令
const {
  version
} = pkg
// cli 初始化
function monitor () {
  let url = ''
  program
    .version(version)
    .option('-n, --number [Number]', '检测的次数,默认一次', 1, parseInt)

  program
    .command('verify <path>')
    .description('检测路径')
    .action((path) => {
      // console.log(`开始检测路径${path}`)
      url = path
    })

  program
    .on('command:*', function () {
      console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
      process.exit(1)
    })

  program.parse(process.argv)
  const {
    number
  } = program
  // 无命令，默认help
  if (process.argv.length === 2) {
    program.help()
  }

  let opts = {
    url,
    number
  }
  global.__hawk__ = opts
  return opts
}

module.exports = monitor