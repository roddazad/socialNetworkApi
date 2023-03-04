const express = require("express");
const db = require("./config/connection");

const User = require("./models/User");
const Thought = require("./models/Thought");
const Reaction = require("./models/Reaction");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//______________________________________________________________________//

//GET all users
app.get("/api/users", (req, res) => {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.status(500).json(err));
});

//______________________________________________________________________//

// GET a single user by its _id and populated thought
//and friend data
app.get("/api/users/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .populate("thoughts")
    .populate("friends")
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user with that ID" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

//______________________________________________________________________//

// POST a new user
app.post("/api/users/", (req, res) => {
  User.create(req.body)
    .then((userData) => res.json(userData))
    .catch((err) => res.status(500).json(err));
});

//______________________________________________________________________//

// PUT to update a user by its _id
app.put("/api/users/:userId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user with this id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});
//______________________________________________________________________//

// DELETE to remove user by its _id
app.delete("/api/users/:userId", (req, res) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user with this id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// POST to add a new friend to a user's friend list
app.post("/api/users/:userId/friends/", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.body} },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user with this id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

//______________________________________________________________________//

// DELETE to remove a friend from a user's friend list
app.delete("/api/users/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull:  { friends: {friendId: req.body.friendId} } },
    { runValidators: true, new: true }
  )
    .then((application) =>
      !application
        ? res.status(404).json({ message: "No application with this id!" })
        : res.json(application)
    )
    .catch((err) => res.status(500).json(err));
});
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// GET to get all thoughts
app.get("/api/thoughts", (req, res) => {
  Thought.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.status(500).json(err));
});
//______________________________________________________________________//

// GET to get a single thought by its _id
app.get("/api/thoughts/:thoughtId", (req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with that ID" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});
//______________________________________________________________________//
// POST to create a new thought
//(don't forget to push the created thought's _id to the associated user's thoughts array field)
app.post("/api/thoughts/", (req, res) => {
  Thought.create(req.body)
    .then((thoughtData) => res.json(thoughtData))
    .catch((err) => res.status(500).json(err))
    // .then((user) => {
    //   User.findOneAndUpdate(
    //     { username: req.body.username },
    //     { $addToSet: { thoughts: {thoughtId: req.body._id }} },
    //     { runValidators: true, new: true }
    //   );
    // })
    // .then((user) =>
    //   !user
    //     ? res.status(404).json({ message: "No user with this id!" })
    //     : res.json(user)
    // )
    // .catch((err) => res.status(500).json(err));
});
//______________________________________________________________________//

// PUT to update a thought by its _id
app.put("/api/thoughts/:thoughtId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user with this id!" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});
//______________________________________________________________________//
// DELETE to remove a thought by its _id
app.delete("/api/thoughts/:thoughtId", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with this id!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

// POST to create a reaction stored in a single thought's reactions array field
app.post("/api/thoughts/:thoughtId/reactions", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { new: true }
  )
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought found with that ID " })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});
//______________________________________________________________________//

// DELETE to pull and remove a reaction by the reaction's reactionId value
app.delete("/api/thoughts/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: {reactionid: req.body.reactionId} } },
    { new: true }
  )
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No thought found with that ID :(' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});  
//______________________________________________________________________//
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
