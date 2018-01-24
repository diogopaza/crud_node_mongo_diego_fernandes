const path = require('path')
const nodemailer = require('nodemailer')

const hbs = require('nodemailer-express-handlebars')

//const {host, port, user, pass} = require('../config/mail.json')
/*
const transport = nodemailer.createTransport({
  
    host,
   port,
   auth: {user, pass},
   
  


  })
*/
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "3a97c7ed461cf5",
      pass: "1fb3fc2f0e3be4"
    }
  })

/*
transport.use('compile', hbs({
    viewEngine: 'handlebars',
   // viewPath: ('../resources/mail/auth/forgot_password'), //path.resolve('./src/resources/mail/'),
    extName: '.html',
}))
*/
module.exports = transport;