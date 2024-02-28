var express = require('express');
var mysql = require('mysql');
var app = express();
var cors = require('cors');
var url = require('url');



app.use(cors(
    {
        origin: '*',
    }
))

const pool= mysql.createPool({
    host:'localhost',
    user:'root',
    password:'Root@123',
    database:'studentdb',
    connectionLimit:50
})




app.use(function(req,res,next){

    console.log( `${req.ip}
    ${req.method}
    ${req.url}`);
    next();
})



app.get("/students",(req,res)=>{
   pool.getConnection(function(error,temcont){
    if(!!error){
        temcont.release();
        console.log("Error");
    }else{
        console.log("connected");
        temcont.query("select * from studentdetails;",function(err,result,field){
            temcont.release();
                if(!!err){
                console.log('Error!');
            }else{
                res.json(result);
            }
        });
    }
   });
    
    
});

app.get("/insertNewPerson",function(req,res){
    pool.getConnection(function(error,temcont){
        if(error){
        temcont.release();
        console.log("Error");
    }else{       
         var queryString = "insert into studentdetails(FirstName,LastName)values('"+req. query.FirstName +"','" +req.query.LastName +"')";
        temcont.query(queryString,function(err,result,fields){
            temcont.release();
            if(error){
                console.log('error'+err);
            }else{
                return res.json(1);
            }
        });
    }
    });
});

app.get("/deleteperson",function(req,res){
    pool.getConnection(function(error,temcont){
        if(error){
            temcont.release();
            console.log("Error");
        }
        else{
            var url_parts = url.parse(req.url, true);
                var query = url_parts.query;
            temcont.query("delete from studentdetails where studentid="+parseInt(query.FirstName),function(err,result,fields){
                temcont.release();
                if(err){
                    console.log("Error"+err)
                }else{
                    res.json(1);
                }
            });
        }
    });
});

app.get("/updateperson",function(req,res){
    pool.getConnection(function(error,temcont){
        if(error){
            temcont.release();
            console.log("Error");
        }else{
            var url_demo = url.parse(req.url,true);
                    var query = url_demo.query;
                    console.log("person updated" + query.studentid);
                    temcont.query("update studentdetails set FirstName = '"+ query.FirstName + "' , LastName ='"+query.LastName +"' where studentid ="+ parseInt(query.studentid),function(err,result,fields){
                     temcont.release();
                     if(!!err){
                        console.log("Error"+err);
                     }else{
                        res.json(1);
                     }
                    })
        }
    });
});


app.listen(8080)

