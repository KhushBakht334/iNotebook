import React from "react";
import noteContext from "./NoteContext";
import { useState } from "react";
const NoteState =({children})=>{
  const host = "http://localhost:5000"
    const notesInitital=[]
          const [notes, setNotes]=useState(notesInitital)
          //Get All Note
    const getNotes=async ()=>{
      //API Call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem(`token`)
        },
      });
      const json = await response.json()
      console.log(json)
      setNotes(json)
    }
    //Add A Note
    const addNote=async (title, description,tag)=>{
      //API Call
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem(`token`)
        },
        body: JSON.stringify({title, description, tag}),
      });
      const note= await response.json();
      setNotes(notes.concat(note))
    }
    //Delete A Note
    const deleteNote=async (id)=>{
      //API call
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem(`token`)
        },
      });
      const json= response.json(); 
      console.log(json)
      //Delete Note
      const newNote= notes.filter((note)=>{return note._id!==id})
      setNotes(newNote);
    }
    //Edit A Note
    const editNote=async (id, title, description, tag)=>{
      //API Call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem(`token`)
        },
        body: JSON.stringify({title, description, tag}),
      });
      const json=await response.json(); 
      console.log(json)
      let newNotes = JSON.parse(JSON.stringify(notes))
      //Logic to edit notes
    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index];
      if(element._id === id){
        newNotes[index].title=title;
        newNotes[index].description=description;
        newNotes[index].tag=tag;
        break;
      }
     
    }  
    setNotes(newNotes);
    }
    return (
        <noteContext.Provider value={{notes, addNote, deleteNote,editNote, getNotes }}>
            {children}
        </noteContext.Provider>
    )
}

export default NoteState;