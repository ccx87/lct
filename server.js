var express = require('express')
var path = require('path')
var compression = require('compression')

var app = express()

app.use(compression())

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})
//|| process.env.PORT 
console.log(process.env.NODE_ENV +"=================="+ path.dirname(__dirname));
var PORT = 3010; 
app.listen(3010, function() {
  console.log('Production Express server running at localhost:' + PORT)
  var newDate = new Date();
  console.log("编译时间："+ newDate.toLocaleDateString()+" "+newDate.getHours()+":"+newDate.getMinutes()+":"+newDate.getSeconds())  
})

