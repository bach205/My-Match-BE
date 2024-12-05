import { collection as mongodb } from "../config/mongoDB.js"
const loadMessage = async (req, res) => {
    const query = {
        srcId: { $eq: parseInt(req.query.srcId) },
        desId: { $eq: parseInt(req.query.desId) },
    }
    // Sắp xếp theo trường `createdAt` giảm dần, lấy 20 tài liệu cuối cùng
    const message = await mongodb.find(query).sort({ createdAt: -1 }).limit(20).toArray();
    // Sau đó, sắp xếp lại theo thứ tự tăng dần của `createdAt`
    message.sort((a, b) => a.createdAt - b.createdAt);
    res.status(200).json(message)
}
export { loadMessage }