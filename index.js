var securePassword = require('secure-password')
var pg = require('pg')

var db = new pg.Client('postgres://localhost/example_users')
var pwd = securePassword()

var examplePassword = Buffer.from('u donut no da wae')

var insert = `
INSERT INTO users (username, email, password)
  VALUES ($1, $2, $3);
`

var select = `
SELECT password FROM users WHERE username = 'cooluser'
`

db.connect(function (err) {
  if (err) console.log(err)
  pwd.hash(examplePassword, function (err, hash) {
    if (err) throw err
    db.query(insert, ['cooluser', 'no@da.wea', hash.toString('hex')], function (err, res) {
      if (err) throw err
      verify()
    })
  })
})

function verify () {
  db.query(select, function (err, res) {
    if (err) console.log(err)
    var hash = res.rows[0].password
    pwd.verify(examplePassword, Buffer.from(hash, 'hex'), function (err, result) {
      if (err) throw err
      if (result === securePassword.VALID) return console.log('cooluser is verified')
    })
  })
}
