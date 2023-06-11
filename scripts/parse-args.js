const parseArgs = () => {
  const args = process.argv.slice(2)
  const config = {}

  for (let i = 0; i < args.length; i += 2) {
    config[args[i].replace('--', '')] = args[i + 1]
  }

  return config
}

module.exports = parseArgs
