const { Server } = require('socket.io')

module.exports = {
    getIo: (server) => {
        const io = new Server(server, {
            //...
        });
        io.on("connection", (socket) => {

            console.log('webSocket is connected');
            socket.on('disconnect', () => {
                console.log("webSocket is disconnected");
            })

            socket.on('test', (data) => {
                console.log('test is runned');
            })
        })
        //your other functions
        return io;
    }
}


