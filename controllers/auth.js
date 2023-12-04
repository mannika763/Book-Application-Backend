

const Swal = require('sweetalert2');

const {validationResult} = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../module/user');


exports.signup = async(req,res,next)=>{
     console.log("ddd", req.body)
const errors = validationResult(req);

if(!errors.isEmpty()){
    console.log('error in signup');
    return;
}  

const name = req.body.name;
const email = req.body.email;
const password = req.body.password;
// console.log("check body",name,email)

try{ 
    const hashPassword = await bcrypt.hash(password,12);

    const userDetails ={
        name:name,
        email:email,
        password:hashPassword,
    };

    const result = await User.save(userDetails);
    Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
      }) 
    res.status(201).json({message: "User Registered!"});
}
catch(err){
   if(!err.statusCode){
    err.statusCode = 500;
   }
   next(err);
  }
}
exports.login = async (req,res,next) =>{
    console.log("body of login", req.body)
    const email = req.body.email;
    const password = req.body.password;

    try{
        // finding email from database using find function
        const user = await User.find(email);
      //  console.log(user)
        console.log(user[0][0].name)
        // if email is not present in our db
        if(user[0].length!==1){
            const error = new Error("A user with this email can't be found");
              error.statusCode = 401;
              throw error;
        }

        //if email is present the go into the object
        const storedUser = user[0][0];

        // because our password is hashed so we have use bcrypt to check whether it is equal or not
        const isEqual = await bcrypt.compare(password,storedUser.password);

         if(!isEqual){
           console.log("errrr")
            const error = new Error('Wrong password!');
            error.statusCode = 401;
           
            throw error;
           
         }

         // if password is also equal then generate jwt token
         const token = jwt.sign({
            name: storedUser.name,
            userId: storedUser.id,
         },
         'secretKey',
         {expiresIn: '1h'});
        
        // res.cookie('jwt', token, { httpOnly: true });
         res.status(200).json({ email: storedUser.email, name: user[0][0].name, token });
    }catch(err){
        if(!err.statusCode){
         err.statusCode = 500;
        }
        res.status(err.statusCode).json({ error: err.message });
        // next(err);
    }
 
}