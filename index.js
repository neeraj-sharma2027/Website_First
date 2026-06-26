const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const JWT_SECRET = "aonbdibedivh";
const mongoose = require("mongoose")
const {UserModel, TodoModel} = require("./db.js");

mongoose.connect("mongodb+srv://neeraj2004sh_db_user:tqJJUMH9uBR4H81k@cluster0.vlbm8xm.mongodb.net/todo-neeraj-1")
app.use(express.json())

app.post("/signup",async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    
    await UserModel.create({
        email: email,
        password: password,
        name: name
    })

    res.json({
        msg: "you have signup"
    })

});

app.post("/login",async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const user = await UserModel.findOne({
        email: email,
        password: password
    })
    console.log(user);
    if(user){
        const token = jwt.sign({
            id: user._id.toString() 
        },JWT_SECRET);
        res.json({
            token: token
        });
    }
    else{
        res.status(403).json({
            msg:"you are UNauthorized"
        });
    }
});

app.post("/todo",auth,(req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    TodoModel.create({
        title,
        userId
    })
    res.json({
        userId: userId
    });
});

app.get("/todos",auth,async (req,res)=>{
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId
    })
    res.json({
        todos
    });
});

function auth(req,res,next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token,JWT_SECRET);
    if(decodedData){
        req.userId = decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            msg:"you are using incorrect credits"
        });
    }
};

app.listen(3000);