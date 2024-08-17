const express= require('express')
const router= new express.Router()
const auth= require('../middlewear/auth')
const Task= require('../models/task')
const { TopologyDescription } = require('mongodb')



router.get('/test', (req,res)=>{
    res.send('testing')
})

router.post('/tasks', auth,  async (req,res)=>{

    const task= new Task({
       ...req.body,
       owner: req.user._id

    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

})


router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const options = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.limit) {
        options.limit = parseInt(req.query.limit);
    }

    if (req.query.skip) {
        options.skip = parseInt(req.query.skip);
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        options.sort = {
            [parts[0]]: parts[1] === 'desc' ? -1 : 1
        };
    }

    try {
        const tasks = await Task.find({ owner: req.user._id, ...match }, null, options)
                                .sort(options.sort)
                                .limit(options.limit)
                                .skip(options.skip);
        res.send(tasks);
    } catch (e) {
        res.status(500).send();
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
        const task= await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if(!task){
     return   res.send(404).send()
    }
    res.send(task)
        }catch(e){
            res.send(500).send(e)
}
})




module.exports= router