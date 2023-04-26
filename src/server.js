const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const router = require("./Routes/index");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 2001;

const mongoURI = process.env.MONGOURI;
const allowedOrigin = process.env.CORS_ORIGIN.split(",").map(
   (origin) => origin
);
app.use(
   cors({
      origin: allowedOrigin,
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
app.get("/welcome", (req, res) => {
   console.log("process", process.env, allowedOrigin);
   res.send("Welcome server is running");
});

app.use("/userAuth", router.authUser);
app.use("/follow", router.followUserRouter);
app.use("/post", router.postRouter);
app.use("/user", router.userRouters);

connectMongoDB();
