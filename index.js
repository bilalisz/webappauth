const express=require('express');
const session=require('express-session');
const sql=require('mysql');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const app=express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
 app.use(session({secret: 'bilal',}))
 app.set('view engine','ejs');


 // database connection
 let db={
     host:'localhost',
     user:'root',
     password:"",
     database:'webapp_db'
 }

const conn =sql.createConnection(db);
conn.connect(()=>{console.log('data is connected !')});


// create session and check
let checkSession=(req)=>req.session.username;
function sessionFun(req){
    req.session.loggedin = true;
    req.session.username = req.body.name;
}









// home API
app.get('/home',(req,res)=>{
   if (checkSession(req)){
    res.render('home',{data:req.session.username || ''})
   }else{
       res.render('login')
   }
});

// login API
app.get('/login',(req,res)=>{

    req.session.destroy();
    res.render('login')
});


//singup API
app.get('/signup',(req,res)=>{

    res.render('signup')

});


// post API for signup
app.post('/signup',(req,res)=>{
    let user={
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
    }
    conn.query('insert into users SET ?',user,function(err,data){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            
            res.redirect('/login');
        
        }
    });
});


//post API for Login
app.post('/login',(req,res)=>{
let user={
    name:req.body.name,
    password:req.body.password
}
conn.query('select * from users where name= ? AND password= ?',[user.name,user.password],(err,data)=>{
    if (data[0]) {
        if(data[0].name ===user.name && data[0].password ===user.password){
        sessionFun(req);
         res.redirect('/home');   
        }else{
            res.redirect('/login')
            
        }
    } else {
        res.send('invaild !')
    }			
    res.end();

    console.log(data)
});
});
    





app.listen(3300,()=>{console.log('server is running')});



