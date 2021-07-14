const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : true,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});


userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }

            console.log("The hash is :\n",hash);
            user.password = hash;
            next();
        });
    });  
});

/* 
    This is what we refer to a pre save hook
    In other words this is a function thats going to run
    before we attempt to actually save an instance of a user
    into our database.

    Here we write the code to look at password currently attached to a user.
    and if it is a plain text password we're then going to attempt that salt.
    Then we will hash that salt and the password together 
    and then we will store the actual result inside of our database.

    10 in bcrypt.genSalt is a number that reflects how complex the salt 
    being generating will be.


*/



userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err) {
                return reject(err);
            }

            if(!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    });
}

mongoose.model('User', userSchema);


/* 
    Code to automate the password checking process : userSchema.methods.comparePassword 

    This fucntion will be called with some password that we want ot test 
    like the password that the user is trying to login with.
    we are calling it candidatePassword.

    Inside of the function we are going to return a new promise.
    
    Whenever we create a promise we pass it a callback funtion.
    That callback function is going to be invoked automatically with
    two arguments namely : resolve and reject.

    If some code inside there behaves as expected we will call resolve
    and that will resolve the entire promise.

    Otherwise if something goes wrong, we will call reject instead
    and that will reject the promise.

    The only reason we are creating a promise ourselves 
    here is so we can make use of the async await syntax 
    whenever we tried ot compare a password.

    The bcrypt library that we're going to use for the actual comparison
    relies upon callbacks entirely which is not super nice.

    bcrypt.compare
    first arg :  candidatePassword 
    which is the password that the user is trying to login with.
    second arg : the salted hashed password in the database.
    third arg : callback function (err, boolran : isMatch)

    If isMatch is true :
    the candidate password and the salted hashes password are the same

*/


