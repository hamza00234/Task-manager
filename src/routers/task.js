const express= require('express')
const router= new express.Router()
const auth= require('../middlewear/auth')
const Task= require('../models/task')
const { TopologyDescription } = require('mongodb')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types;


router.get('/test', (req,res)=>{
    res.send('testing')
})

router.post('/tasks', auth, async (req, res) => {
    const { description,owner } = req.body;  // Only take description from the request body
  
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
  
    try {
      const newTask = new Task({
        description,
        owner: owner   // Automatically set the owner to the logged-in user
      });
  
      await newTask.save();
  
      res.status(201).json(newTask);
    } catch (e) {
      console.error('Error creating task:', e);
      res.status(500).send({ message: 'Server error creating task' });
    }
  });
  router.get('/tasks', auth, async (req, res) => {
    try {
    
      const tasks = await Task.find({ owner: new ObjectId(req.user.userId) });
  
      // Log the tasks fetched from the database
      console.log('Fetched tasks:', tasks);
  
      if (tasks.length === 0) {
        console.log('No tasks found for this user.');
      }
  
      res.send(tasks);
    } catch (e) {
      console.error('Error during task fetch:', e);  // Log detailed error information
      res.status(500).send({ message: 'Error fetching tasks', error: e.message });
    }
  });
  


router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const task= await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
            }
            res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const allowed= ['description','completed' ]
    const update= Object.keys(req.body)
    const isfound= update.every((updates)=>allowed.includes(updates))
    if(!isfound){
     return  res.status(400).send("error: invalud update")
    }
    try{
       const task= await Task.findOne({_id: req.params.id, owner: req.user._id})
      
        if(!task){
            return res.status(404).send()
        }

        update.forEach((updates)=> task[updates]= req.body[updates])
        await task.save()

        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res)=>{
    try{
        const task= await Task.findOneAndDelete({_id: req.params.id})
    if(!task){
     return   res.sendStatus(404)
    }
    res.send(task)
        }catch(e){
            res.status(500).send(e)
}
})




module.exports= router