const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return false if any user with the same username is found, otherwise True
  if (userswithsamename.length > 0) {
      return false;
  } else {
      return True;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 600 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Retrieve the isbn parameter from the request URL and add username and its review to the corresponding book's reviews
    const isbn = req.params.isbn;
    const reviewText=req.body.reviewtext
    const userName=req.body.username
    let foundBook= Object.keys(books).find(key => books[key].ISBN === isbn)
    books[foundBook].reviews[userName]=reviewText;
    res.send(`Review adde to book with ISBN: ${isbn} `);
});
// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the isbn parameter from the request URL and add username and its review to the corresponding book's reviews
    const isbn = req.params.isbn;
    const userName=req.body.username
    let foundBook= Object.keys(books).find(key => books[key].ISBN === isbn)
    foundreview=books[foundBook].reviews[userName];
    if (foundreview) {
        delete books[foundBook].reviews[userName]
        return res.send(`Review deleted from book with ISBN: ${isbn} `);
    } else{
        return res.send(`Review not found for book with ISBN: ${isbn} `);
    }

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
