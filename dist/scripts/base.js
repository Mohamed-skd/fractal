function info(o,r){console.info(r?`
ℹ️ ${r}:`:`
ℹ️`),console.log(o)}function todo(o){return console.warn(`
❗ À faire: ${o}
`),!1}function error(o){return console.warn("\n❌ Oups ! An error occured 😔.\n"),console.error(o),console.error("\n"),!1}export{info,todo,error};