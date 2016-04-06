const express = require('express'),
	app = express(),
	list = require('./modules/list')

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.static('public'))

app.use('/',list)

app.get('/',(req,res) => res.render('index'))

app.listen(8080, () => console.log('run server in port 8080'))

