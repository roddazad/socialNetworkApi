const express = require("express");
const db = require("./config/connection");

const { User, Thought } = require("./models");
const Reaction = require("./models/Reaction");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//GET all users
app.get("/api/users", (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res.status(200).json(result);
    }
  });
});

// GET a single user by its _id and populated thought and friend data
app.get("/api/users/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .populate("thought")
    .populate({ path: "user", select: "friends" })
    .then((user) =>
      !user
        ? res.status(404).json({ message: "No user with that ID" })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
});

// POST a new user
app.post("/api/users/:userId", (req, res) => {
  User.create(req.body)
    .then((userData) => res.json(userData))
    .catch((err) => res.status(500).json(err));
});

// PUT to update a user by its _id
app.put("/api/users/:userId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.userId },
    { _id: req.prams.userId },
    { new: true }
  );
});

// DELETE to remove user by its _id
app.delete("/api/users/:userId", (req, res) => {
  User.findOneAndDelete({ _id: req.prams.userId }, (err, result) => {
    if (result) {
      res.status(200).json(result);
      console.log(`Deleted: ${result}`);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ message: "something went wrong" });
    }
  });
});

// POST to add a new friend to a user's friend list
app.post("/api/users/:userId/friends/:friendId", (req, res) => {
  User.create(req.body)
    .then((friend) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { friends: friend._id } },
        { new: true }
      );
    })
    .then((friend) =>
      !friend
        ? res
            .status(404)
            .json({ message: "Friend added, but found no user with that ID" })
        : res.json("Added the Friend 🎉")
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE to remove a friend from a user's friend list
app.delete("/api/users/:userId/friends/:friendId", (req, res) => {
  User.findOneAndRemove({ _id: req.params.friendId })
    .then((friend) =>
      !friend
        ? res.status(404).json({ message: "No such friend exists" })
        : User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.userId } },
            { new: true }
          )
    )
    .then((user) =>
      !user
        ? res.status(404).json({
            message: "Friend deleted, but no user found",
          })
        : res.json({ message: "Friend successfully deleted" })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET to get all thoughts
app.get("/api/thoughts", (req, res) => {
  Thought.find({}, (err, result) => {
    if (err) {
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res.status(200).json(result);
    }
  });
});

// GET to get a single thought by its _id
app.get("/api/thoughts/:thoughtId", (req, res) => {
  Thought.findOne({ _id: req.params.userId })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought with that ID" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
});
// POST to create a new thought
//(don't forget to push the created thought's _id to the associated user's thoughts array field)
app.post("/api/thoughts/:thoughtId", (req, res) => {
  Thought.create(req.body)
    .then((thought) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res.status(404).json({
            message: "Thought created, but found no user with that ID",
          })
        : res.json("Created the thought 🎉")
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT to update a thought by its _id
app.put("/api/thoughts/:thoughtId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { _id: req.body.thoughtId },
    { new: true }
  );
});

// DELETE to remove a thought by its _id
app.delete("/api/thoughts/:thoughtId", (req, res) => {
  findOneAndDelete({ _id: req.prams.thoughtId }, (err, result) => {
    if (result) {
      res.status(200).json(result);
      console.log(`Deleted: ${result}`);
    } else {
      console.log("Uh Oh, something went wrong");
      res.status(500).json({ message: "something went wrong" });
    }
  });
});

// POST to create a reaction stored in a single thought's reactions array field
app.post("/api/thoughts/:thoughtId/reactions", (req, res) => {
  Reaction.create(req.body)
    .then((reaction) => {
      return Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
      );
    })
    .then((reaction) =>
      !reaction
        ? res.status(404).json({ message: "No reaction found with that ID :(" })
        : res.json(student)
    )
    .catch((err) => res.status(500).json(err));
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
app.delete("/api/thoughts/:thoughtId/reactions/:reactionId", (req, res) => {
  Reaction.findOneAndRemove({ _id: req.params.reactionId })
    .then((reaction) =>
      !reaction
        ? res.status(404).json({ message: "No such reaction exists" })
        : Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
          )
    )
    .then((user) =>
      !user
        ? res.status(404).json({
            message: "Friend deleted, but no user found",
          })
        : res.json({ message: "Friend successfully deleted" })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
