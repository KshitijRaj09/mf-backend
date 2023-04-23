const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./Routes/index");
const cors = require("cors");

dotenv.config();

const PORT = 2000;

const mongoURI = process.env.MONGOURI;

app.use(
   cors({
      origin: "http://localhost:5000",
   })
);

app.use(express.json());
app.use(helmet());
app.use(morgan("short"));

async function connectMongoDB() {
   try {
      const {connections} = await mongoose.connect(mongoURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });

      app.listen(PORT, () => {
         console.log(
            `Server listening @ PORT ${PORT} && MongoDB running @ PORT ${connections[0].port})`
         );
      });
   } catch (error) {
      console.log("error inside connectMongoDB", error);
   }
}

app.use("/userAuth", router.authUser);
app.use("/follow", router.followUserRouter);
app.use("/post", router.postRouter);
app.use("/user", router.userRouters);

connectMongoDB();
