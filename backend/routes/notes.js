const express= require('express'); 
const router= express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note=require('../models/Note');
const { body, validationResult } = require('express-validator');


// Route1: Get all the notes
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const notes= await Note.find({user: req.user.id});
        res.json(notes)
        
    } catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
      }
   
})

// Route2: Add a new note
router.post('/addnote', fetchuser, [
    body('description','enter a valid description').isLength({min:3}),
  body('title').isLength({min:3})
], async (req, res)=>{
    try {
        const{title, description, tag}= req.body;
    const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const note= new Note({
    title, description, tag, user: req.user.id
  })
  const savedNote = await note.save()
    res.json(note)
    } catch(error){
        console.error(error.message);
        res.status(500).send("some error occured");
      }
    
})
// Route 3: Update a note
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
  const {title, description, tag}=req.body;
  try {
  //Create a new note object
  const newNote={};
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};

  //Find the note to be updated and update it
  let note=await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not found")}

  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
  }
  note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
  res.json({note});
} catch(error){
  console.error(error.message);
  res.status(500).send("some error occured");
}
})

// Route 4: delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
  try {

  //Find the note to be deleted and delete it
  let note=await Note.findById(req.params.id);
  if(!note){return res.status(404).send("Not found")}

  //Allow deletion only if user owns the note
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
  }
  note = await Note.findByIdAndDelete(req.params.id)
  res.json({"Success": "Note Deleted", note:note});
} catch(error){
  console.error(error.message);
  res.status(500).send("some error occured");
}

})
module.exports= router 