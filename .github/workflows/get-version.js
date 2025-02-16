let fs = require('fs')
console.log(JSON.parse(fs.readFileSync('./module.json')).version)