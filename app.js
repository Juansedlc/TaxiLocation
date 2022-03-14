const express = require('express')
const app = express();
const dgram = require('dgram');
const path = require("path");
const socket = dgram.createSocket('udp4');
var port =80;


var lat = ''
var lon = ''
var date = ''
var time = ''


// settings
const server = app.listen(port);

const mysql = require('mysql')
var data;

var con = mysql.createConnection({
  host: "localhost",  
  user: "root",  
  password: "password", 
  database: "taxi"
})

con.connect((err) => {
    if (err) {
        console.error('error conecting: ' + err.stack);
        return;
    }
    else{
        console.log("Connected to Data base")
        
    }
});


//listening the server
function main (){
    //routes
    app.get("/", (req, res) => {
  
        res.sendFile(path.join(__dirname + "/index.html"));
      });
      

      const server = app.listen(app.get('port'), () =>{
        console.log('Server on port', port);
        socket.on('message',(message)=>{
          
            console.log('message: '+ message)
            lat = String(message).substr(9,10)
            lon = String(message).substr(30,11)
            time = String(message).substr(53,13)
            date = String(message).substr(44,10)

            var mysql = "INSERT INTO base (Latitud, Longitud, Fecha, Hora) VALUES ?";
            var values = [
                [lat,lon,date,time],
              ];
              con.query(mysql, [values], function (err)  {
              if (err) throw err;
              console.log("1 record inserted");
            });
        });
        
        socket.bind(3020)  
    });

    app.get('/gps', (req, res)=>{
        res.json(
            {
                lat: lat,
                lon: lon,
                date: date,
                time: time
            }
        );
    })

    }
main();

