import React, { useEffect } from "react";
import ListNoteModel from "../../../model/list-note-model";
import NoteService from "../../../services/note-service";
import './my-tasks.css';
const noteService = new NoteService();

interface Props {
  notes: Array<ListNoteModel>;
  updateNotes: () => Promise<void>
}

const MyTasks = (props: Props) => {
  async function setStatusNote(noteID: string, done: boolean) {
    let note: ListNoteModel = props.notes.find(note =>
      note.noteID === noteID) || new ListNoteModel();
    if (note.noteID !== '') {
      note.done = !done;
      console.log(note);
      noteService.ChangeNote(noteID, note).then((result: any) => {
        console.log(result);
        if (result.status === 204) {
          props.updateNotes();
        }
      }, err => {
        console.error(err);
      });
    }
  }

  async function deleteNote(noteID: string) {
    console.log(noteID);
    noteService.DeleteNote(noteID).then((result: any) => {
      console.log(result)
      if (result.status === 204)
        props.updateNotes();
      else
        alert('Não foi possível deletar a tarefa!');
    }, err => {
      console.error(err);
      alert('Não foi possível deletar a tarefa!')
    });
  }

  useEffect(() => {
    props.updateNotes();
  }, []);

  return (
    <div id="my-tasks">
      {props.notes.map((note, index) => (
        <div className="task" key={index}>
          <div className="description">
            <input
              type='checkbox'
              onChange={(e) => setStatusNote(note.noteID, note.done)}
              checked={note.done}
            />
            <b>{note.description}</b>
            <button
              type="button"
              onClick={(e) => deleteNote(note.noteID)}>
              x
            </button>
          </div>
          <span className="more">
            {note.category} | {new Date(note.intentedDate).toLocaleString().substring(0, 10)}
          </span>
        </div>
      ))}
    </div>
  )
}
export default MyTasks;