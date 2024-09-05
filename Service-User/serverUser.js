import express from "express"
import "dotenv/config";
import user from "./src/routes/user.js"
const app = express()
const port = process.env.DEVELOPMENT_PORT
//sử dụng để parse content được gửi dưới dạng json
app.use(express.json());
// tương tự nhưng với x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
app.use("/user", user)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})