const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    // Send JSON response with formatted books data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    let foundBook= Object.keys(books).find(key => books[key].ISBN === isbn)
    if (foundBook) {
      res.send(JSON.stringify(books[foundBook],null,4));
    } else {
      res.send("Book not found.");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author parameter from the request URL and send the corresponding book's details
    // if there is redundancy in author return all of them
    const author = req.params.author;
    let foundBooks= Object.values(books).filter(book=> book.author === author);
    res.send(JSON.stringify(foundBooks,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title parameter from the request URL and send the corresponding book's details
    // if there is redundancy in title return all of them
    const title = req.params.title;
    let foundBooks= Object.values(books).filter(book=> book.title === title);
    res.send(JSON.stringify(foundBooks,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's reviews
    const isbn = req.params.isbn;
    let foundBook= Object.keys(books).find(key => books[key].ISBN === isbn)
    res.send(books[foundBook].reviews);
});

module.exports.general = public_users;
