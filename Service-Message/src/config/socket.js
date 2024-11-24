import { Server } from "socket.io";
import { collection as mongodb } from './mongoDB.js'
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
        // socket.emit("message", { srcId: 1, message: "who are there???", type: "text" })

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`)
        })
        socket.on("joinRoom", arg => {
            socket.join(defineRoom(arg.srcId, arg.desId));
        })
        socket.on("leaveRoom", (arg) => {
            socket.leave(defineRoom(arg.srcId, arg.desId));
        })
        socket.on("message", async (arg, callback) => {
            arg = {
                ...arg,
                createAt: new Date(),
            };
            await mongodb.insertOne(arg);
            socket.broadcast.to(defineRoom(arg.srcId, arg.desId)).emit("message", arg)
            callback({ status: "send" })
        })
        socket.on("LoadMessage", async (arg, callback) => {
            const query = {
                srcId: { $eq: arg.srcId },
                desId: { $eq: arg.desId },
            }
            // Sắp xếp theo trường `createdAt` giảm dần, lấy 20 tài liệu cuối cùng
            const message = await mongodb.find(query).sort({ createdAt: -1 }).limit(20).toArray();

            // Sau đó, sắp xếp lại theo thứ tự tăng dần của `createdAt`
            message.sort((a, b) => a.createdAt - b.createdAt);
            callback({ message });
        })
    })
}

export default socketSetUp;