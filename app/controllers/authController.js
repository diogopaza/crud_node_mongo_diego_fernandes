const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const mailer = require('../../modules/mailer')
const authConfig = require('../../config/auth.json')
const User = require('../models/user')
const router = express.Router();


function generatorToken(params = {}){

    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    } )
}


router.post('/register', async(req, res) => {
    try{
        const{ email } = req.body;
        if(await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists'})
        const user = await User.create(req.body)

        user.password = undefined;

        return res.send( { user,
        token: generatorToken( { id: user.id })
        })
    }catch(err){
        return res.status(400).send({error: 'Registration failed'})
    }

})


router.post('/authenticate', async (req, res) => {
  //res.send('oigg')
    
    const {email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if(!user)
        return res.status(400).send({error: 'User not found'})

    console.log(password)
    console.log( user.password)
    
    if(await password !== user.password )
        return res.status(400).send({error: 'Invalid Password'});
        
             user.password = undefined;    
            
            
        //res.send('Usuário logado')
        

    
        res.send( { user,
                token: generatorToken( {id: user.id }) })
        //res.send( user )
  

        
         

  
})

router.post('/forgot_password', async(req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne( { email } )
        if(!user)
            return res.status(400).send({error: 'User not found' });
        
        const token = crypto.randomBytes(20).toString('hex');
    
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set':{
                passwordResetToken : token,
                passwordResetExpires: now,
            }
        })
        //console.log(token, email)
        mailer.sendMail({
            to:  email ,
            from: 'diogopazacvel@gmail.com',
            template: '/src/app/resources/mail/auth/forgot_password',
            //context: { token },
            html: '<p>Você esqueceu sua senha? Nã tem problema, utilize esse token: ' +  token + '</p>' 
        },(err)=>{
            if(err)
                return res.status(400).send({error: 'Cannot send forgot password email' });
                
            
                
            
                
            return res.send('Email enviado com sucesso. Seu Token é: '+ token );
        })
       
       // console.log("errosss: " + token, now)

    }catch(err){
        res.status(400).send({error: 'Erro on forgot password, try again'})
        console.log(err)
    }

})

router.post('/reset_password', async(req, res) => {
    const {email, token, password } = req.body;
    //console.log(email)
    try{
        const user = await User.findOne( { email } )
            .select('+passwordResetToken passwordResetExpires')
        
        if(!user)
          return res.status(400).send({error: 'User not found'})


        if(token !== user.passwordResetToken)
            return res.status(400).send({error: 'Token invalid'})
        const now = new Date();
        
        if(now > user.passwordResetExpires)
            return res.status(400).send({error: 'Token expired, generate a new one'})

        user.password = 'new password';

        await user.save();
        res.send();

        
    }catch(err) {
        res.status(400).send({error: 'Cannot reset password, try again'});
    }
})






module.exports = app => app.use('/auth', router);