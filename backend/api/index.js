import express from "express";
import cors from "cors";
import {
  getUserInfo,
  getMentees,
  addUser,
  getWishlist,
  getConnections,
  createWishlist,
  addNewConnectionsList,
  updateUserInfo,
  updateWishlist,
  updateConnectionsList,
  getMentors,
} from "./fetch.js";
import { verifyToken } from "./middlewere.js";

const app = express();
app.use(cors(), express.json({ limit: "5mb" }));

app.get("/", (req, res) => res.send("Express on Vercel"));
// GET route to send user information with specified user id to frontend
app.get("/api/user/:uid", getUserInfo);

// GET route to send all the homeless people in the database to frontend
app.get("/api/mentees", getMentees);

app.get("/api/mentors", getMentors);

// GET route to send wishlist of user with specified user id to frontend
app.get("/api/wishlist/:uid", getWishlist);

// GET route to send connections for the user with specified user id to frontend
app.get("/api/connections/:uid", getConnections);

// POST route to add user to database
app.post("/api/user", addUser);

// POST route to create wishlist
app.post("/api/wishlist", verifyToken, createWishlist);

// POST route to add new connections list
app.post("/api/connections", addNewConnectionsList);

// PUT route to update user information
app.put("/api/user", verifyToken, updateUserInfo);

// PUT route to update wishlist for a specified user
app.put("/api/wishlist", verifyToken, updateWishlist);

// PUT route to update connections list for a specified user
app.put("/api/connections", updateConnectionsList);


// FOR LOCAL TESTS
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;
