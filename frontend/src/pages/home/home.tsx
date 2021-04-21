import React from "react";
import ListNoteModel from "../../model/list-note-model";
import NoteService from "../../services/note-service";
import MyTasks from "./my-tasks/my-tasks";
import NewTask from "./new-task/new-task";
import './home.css'
const noteService = new NoteService();

export default function Home() {
  const [notes, setNotes] = React.useState(new Array<ListNoteModel>());
  async function getNotes() {
    noteService.ListNotes().then((result: any) => {
      if (result.data.length > 0)
        setNotes(result.data);
    }, err => {
      console.error(err);
    });
  }
  return (
    <div id="container">
      <NewTask notes={notes} updateNotes={getNotes} />
      <MyTasks notes={notes} updateNotes={getNotes}/>
    </div>
  )
}