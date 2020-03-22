var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var port=5400;
var app=express();
var routes=require('./routes');

// midlleware 
app.use(bodyParser());
app.use(session({secret: 'secret'}));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//database connection
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'login_auth_database'
});
connection.connect(()=>{console.log('database is connected !')});

// create session and check
let checkSession=(req)=>req.session.username;
    

function sessionFun(req){
    req.session.loggedin = true;
    req.session.username = req.body.name;
}




//login get API
app.get('/login',function(req,res){
    req.session.destroy();
  res.render('login');
})

//signup get API
app.get('/signup',function(req,res){
     res.render('signup');
});

// signup post API
app.post('/signup',function(req,res){

    let user={
        username:req.body.name,
        password:req.body.password,
        email:req.body.email
    }
    connection.query('insert into accounts SET ?',user,function(err,data){
        if(err){
            console.log(err);
            res.send(err);
        }else{
            res.send('<h1>data is inserted !</h1>'+user.username);
        
        }
    });

   
});




//login post API
app.post('/login',function(req,res){
    var username = req.body.name;
    var password = req.body.password;
     connection.query('select * from accounts where username= ? AND password= ?',[username,password],function(error,data,fields){
            if (data[0]) {
                if(data[0].username === username && data[0].password === password){
				sessionFun(req);
                 res.redirect('/home');   
                }else{
                    res.redirect('/login')
                    
                }
			} else {
				res.send('Invalid');
			}			
			res.end();
		});
    });



// home get API
app.get('/home',function(req,res){
   
    if(checkSession(req)){
    res.render('home');
    }else{
        res.redirect('/login');
    }
    

});



app.get('/homepage',function(req,res){
    if(checkSession(req)){
        res.send("this is homepage");
}else{
        res.redirect('/login');
    }
    
});

 app.listen(port,()=>{console.log(`your server is running on port ${port}`)});














