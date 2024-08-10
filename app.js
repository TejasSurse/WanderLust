if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const port = 8080;
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review")
const userRouter = require("./routes/user");

const session = require("express-session");
//const { secureHeapUsed } = require("crypto");
const { cookie } = require("express/lib/response");
// for cookies we use session to store site data for small time 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const dbURL = process.env.ATLASDB_URL;
const MongoStore = require("connect-mongo");


// Connect with Mongodb
async function main(){
    await mongoose.connect(dbURL);
}
main().then(()=>{
    console.log("Database is Connected ");
}).catch((err)=>{
    console.log(err.message);
});

// Setting ejs  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// To parse all data come form url get req
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : "mysuperseceretcode",
    },
    touchAfter : 24 * 3600,
});

store.on("error", ()=>{
    console.log("Error in Mongo Session Store", err);
})
;
// session opetions to store 
const sessionOptions = {
    store,
    secret: "mysuperseceretcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
    },
    httpOnly : true,
};


app.use(session(sessionOptions));
app.use(flash());// use flash before routes always 


// general steps to initilize passport and use passport package
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
   // console.log(res.locals.success);
   res.locals.currUser =  req.user;
   next();
});


// Ai Generation Description 


const cors = require('cors');  // Import the cors package
const { GoogleGenerativeAI } = require('@google/generative-ai');


// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Fetch your API_KEY
const API_KEY = process.env.GEMINIAI;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// this  is parent route 

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next)=>{
   let {statusCode = 500 , message = "Something Went Wrong !! "} = err;
    res.status(statusCode).render("error", {err});
   //res.status(statusCode).send(message);

});



app.listen(port, ()=>{
    console.log("server is listening ");
});
 