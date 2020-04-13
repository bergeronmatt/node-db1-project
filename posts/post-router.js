// initialize express object
const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');
const router = express.Router();

/**  ENDPOINTS */

// READ

// Read the entire database 
router.get('/', (req, res) => {
    db.select('*') //read the entire database
        .from('accounts') //from accounts wihin the accounts.js
        .then(accounts => { //create an account variable
            res.status(200).json({data: accounts}) //use json to render the account data in the browser
        })
        .catch(err => { //error code if the data could not be found
            res.status(500).json({error: 'there was an error retrieving the data', err})
        })
})

// Read individual database objects based on their id

router.get('/:id', (req, res) => {
    db('accounts') //read the database
        .where({ //set up the conditions to finding the information
            id: req.params.id //access the requested dataset through the id parameter
        })
        .then(accounts => {//take the accessed dataset and render it to the browser via json
            res.status(201).json({data: accounts}) //send success message and render the data
        })
        .catch(err => { //catch statement in the event the data cannot be rendered
            res.status(500).json({error: err.message})
        })
})

// CREATE

router.post('/', (req, res) =>{
    const accountData = req.body //set up a variable to handle the data that's being pushed to the database
    db('accounts') //access the database
    .insert(accountData, 'id')//insert the data being presented and assign it an id
    .then(ids => { //then statement to being generating the id for the account posted
        const id = ids[0]; //setting up an id variable and then searching for a place in the array for it
        db('accounts') //accessing the accounts database again
            .where({id}) //checking the next available id in the chain
            .first()
            .then(account => { //render the account to the browser with success message
                res.status(201).json({data: account})
            });
    })
    .catch(err => { //catch statment with error message in the event it cannot be saved to the database
        res.status(500).json({error: err.message})
    })
})

//UPDATE - will be attempting the PATCH route handler instead of the standard PUT 
router.patch('/:id', (req, res) => {
    const changes = req.body; //set up variable to store the changes to the account information
    const {id} = req.params; //set up an id object to store and handle the parameters of the information being changed
    db('accounts') //access the accounts database in accounts.js
        .where({id}) //stipulation clause searching for the id of the object being updated
        .update(changes) //update function to pass the changes variable
        .then(count => { //setting up an if/else statement to parse through data to find the specific id of the account being updated
            if (count > 0){
                res.status(200).json({mesage: 'success'})
            } else {
                res.status(404).json({message: 'could not find the account'})
            }
        })
})


module.exports = router;