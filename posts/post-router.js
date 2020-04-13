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



module.exports = router;