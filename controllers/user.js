const User = require("../models/user");

module.exports.formsignup = (req, res)=>{
    res.render("users/signup");
}

module.exports.signup = async (req, res)=>{
    try{
        let { username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser =  await User.register(newUser, password);
       // console.log(registeredUser);
        // for auto signin after login 
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.formLogin = (req, res)=>{
    res.render("users/login");
}

module.exports.login = async(req, res)=>{
    req.flash("success", "Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } // this  if for if error occurred in fun then go to error 
        req.flash("success", "Logged Out");
        res.redirect("/listings");
    })
}