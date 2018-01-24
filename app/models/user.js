const mongoose = require('../../database/index')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

var UserSchema = new Schema({

    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        unique:true,
        require:true,
        lowercase:true,
    },
    password:{
        type:String,
        require:true,
        select:false,
    },
    passwordResetToken:{
        type: String,
        select: false
    },
    passwordResetExpires:{
        type:Date,
        select:false
    },
    createAdd:{
        type:Date,
        default: Date.now

    },


})
/*
UserSchema.pre('save', async  (next) => {
    const hash =  await bcrypt.hash(this.password, 2);
    this.password = hash;
    console.log(hash);
    next();

})
*/

const User = mongoose.model('User',UserSchema)




module.exports = User;

