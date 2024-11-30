const express = require('express');
const model = require('../models/forumModel.js')
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/new',authMiddleware,  (req, res) => {
    //console.log('body: ',req.body)
    const {Thread,Desc,Token} = req.body

    return model
    .createForum(Thread,Desc,Token)
    .then(function (result) {
      console.log(result)
      return res.json(result);
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ error: "error in uploading file" });
    });
    
});

router.get('/getAllForums',authMiddleware,(req, res)=>{
  console.log('inside get all forums')
  console.log(req.query)
  const token =  req.query.token
 
  return model
    .getAllForums(token)
    .then(function (results) {
      if (results == null) {
        return res.status(404).json({ message: 'Error retrieving item details' });
      }
      
      return res.status(200).json(results);
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ error: "unknown error" });
    });
})

  module.exports = router;


  router.delete('/:threadId/delete', (req,res)=>{
    console.log('delete forum')
    const {threadId} = req.params
    console.log(threadId)
    return model
    .deleteForum(threadId)
    .then(function (result) {
      console.log(result)
      return res.status(200).json(result)
    })
    .catch(function (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    })
  })