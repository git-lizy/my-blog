const withCss = require('@zeit/next-css')
const withScss = require('@zeit/next-sass')
//
//
if(typeof require !== 'undefined'){
	require.extensions['.css']=file=>{}
}


module.exports = withScss(withCss({}))