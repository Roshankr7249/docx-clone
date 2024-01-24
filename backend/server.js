const io=require('socket.io')(3001, {
    cors:{
        origin: 'http://localhost:3000/',
        methods:['GET', 'POST'],
    }
})
io.on("connection", socket=>{

    socket.on("send-changes", delta=>{

        console.log("connected to the server");
        console.log(delta);
    })
})
