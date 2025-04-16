function info(o,n){console.info(n?`
ℹ️ ${n}:`:`
ℹ️`),console.log(o)}function todo(o){return console.warn(`
❗ To do: ${o}
`),!1}function error(o){return console.warn("\n❌ Oups ! An error occured 😔.\n"),console.error(o),console.error("\n"),!1}export{info,todo,error};