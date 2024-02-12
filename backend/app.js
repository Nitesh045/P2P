const http = require('http');
const {Server}= require('socket.io')
  //const io= new Server();
const cors = require('cors');
const express= require('express');
const app= express();
// app.use(cors());

const bodyParser= require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const path = require('path')
//app.use(express.static(path.join(__dirname,"/../Frontend/dist")));
//app.set(io);

// const io= app.listen(80,()=>{
//     cors(true)
//     console.log('hello')
// })
// app.listen(80,()=>{
//     console.log('server start at 80')
// })
const io= new Server(80,{
    cors:true
});
const emailToSocket= new Map();
const socketidEmailMap=new Map();
io.on('connection',(socket)=>{
    socket.on('room:join',(data)=>{
       const{email,room}= data
       emailToSocket.set(email,socket.id)
       socketidEmailMap.set(socket.id,email);
       io.to(room).emit("user:Joined",{email,id:socket.id})
       socket.join(room)
       io.to(socket.id).emit('room:join',data)
    })


    socket.on('user:call',({to,offer})=>{
        io.to(to).emit('incomming:call',{from:socket.id,offer})
    });
    // call accepted 
    socket.on('call:aceepted',({to,ans})=>{
        io.to(to).emit('call:aceepted',{from:socket.id,ans})
    });


    socket.on('peer:nego:needed',({to,offer})=>{
        console.log('peer:nego:needed',offer)
        io.to(to).emit('peer:nego:needed',{from:socket.id,offer})
    });

    socket.on('peer:nego:done',({to,ans})=>{
        console.log('peer:nego:done',ans)
        io.to(to).emit('peer:nego:final',{from:socket.id,ans})
    })

   

    // socket.on('/',async(req,res)=>{
    //        try{
    
    //         res.sendFile(path.join(__dirname,"/../Frontend/dist/index.html"))
    //     } catch (error) {
    //         console.log(error);
    //     }
    // })
    console.log('coneected');
})