import { Server } from "socket.io";

const defineRoom = (a, b) => {
    if (a > b) {
        let tmp = a;
        a = b;
        b = tmp;
    }
    return "" + a + b
}

const socketSetUp = server => {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`)
        // socket.emit("message", "who are there?????")

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`)
        })
        socket.on("joinRoom", arg => {
            socket.join(defineRoom(arg.srcId, arg.desId));
        })
        socket.on("leaveRoom", (arg) => {
            socket.leave(defineRoom(arg.srcId, arg.desId));
        })
        socket.on("message", (arg) => {
            socket.broadcast.to(defineRoom(arg.srcId, arg.desId)).emit("message", arg)
        })
    })
}

export default socketSetUp;