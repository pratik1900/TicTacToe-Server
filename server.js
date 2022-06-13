require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const uuidv4 = require("uuid4");

const io = require("socket.io")(server, {
  cors: {
    // origin: "*",
    origin: "http://localhost:3000",
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
});

const connectDB = require("./db/connectDB");
const router = require("./routes");

const port = process.env.SERVER_PORT || 5050;

app.use("/api/v1/", router);

io.on("connection", (socket) => {
  console.log("User connected");

  // Create game
  socket.on("create", (playerName) => {
    console.log("create received server");
    socket.join(`game-${playerName}-${uuidv4()}`);
    console.log("rooms list: ", io.sockets.adapter.rooms);
  });

  //Fetch room list
  socket.on("getRooms", function () {
    // console.log("received getRooms");
    let rooms = Array.from(io.sockets.adapter.rooms);
    // let gameRooms = rooms.filter((room) => /^game-.*$/.test(room[0]));
    const filtered = rooms.filter((room) => !room[1].has(room[0]));
    const res = filtered.map((i) => i[0]);
    console.log("rooms list2: ", res);

    socket.emit("roomList", { rooms: res });
  });
});

const init = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(port, () => {
      console.log(`Server running on port ${port}.`);
    });
  } catch (err) {
    console.log(err);
    // process.exit(1);
  }
};

init();
