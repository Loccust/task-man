import { CheckSharp } from "@material-ui/icons";
import React, { useEffect } from "react";
import CategoryModel from "../../../model/categories-model";
import InsertNoteModel from "../../../model/insert-note-model";
import ListNoteModel from "../../../model/list-note-model";
import NoteFilterModel from "../../../model/note-filter-model";
import CategoryService from "../../../services/category-service";
import NoteService from "../../../services/note-service";
import './new-task.css';
const categoryService = new CategoryService();
const noteService = new NoteService();

interface Props{
  notes: Array<ListNoteModel>;
  updateNotes: () => Promise<void>
}

const NewTask = (props: Props) => {
  const [newNote, setNewNote] = React.useState(new InsertNoteModel());
  const [categories, setCategories] = React.useState([new CategoryModel()]);
  let loading: boolean = false;

  async function getCategories() {
    categoryService.ListCategories().then((result: any) => {
      if (result.status === 200)
        setCategories([new CategoryModel(), ...result.data]);
    }, err => {
      console.error(err);
    });
  }

  async function setNote() {
    loading = true;
    noteService.CreateNote(newNote).then((result: any) => {
      if (result.status === 201) {
        setNewNote(new InsertNoteModel());
        getCategories();
        props.updateNotes();
      }
      else
        alert('Não foi possível salvar a tarefa!');
    }, err => {
      console.error(err);
      alert('Não foi possível salvar a tarefa!')
    });
  }

  async function setCategory(): Promise<boolean> {
    let success = false;
    categoryService.CreateCategory(categories[0].description).then((result: any) => {
      if (result.status === 200)
        success = true;
      else
        alert('Não foi possível salvar a categoria!');
    }, err => {
      console.error(err);
      alert('Não foi possível salvar a categoria!')
    });
    return success;
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    if (newNote.categoryID === 0) {
      if (await setCategory())
        setNote();
    }
    else
      setNote();
  }

  function findCategoryIndex() {
    let index = categories.findIndex(category =>
      category.categoryID === Number(newNote.categoryID));
    if (index > 0)
      return index
    return 0;
  }

  const changeCategory = (event: any) => {
    newNote.categoryID = 0;
    let newCategories = [...categories];
    let newCategory = new CategoryModel();
    newCategory.description = event.target.value;
    newCategories[0] = newCategory;

    setCategories(newCategories);
  }

  const checkEmpty = () => {
    let hasPropEmpty = Object.values(newNote).some(prop => prop === "") || false;
    let hasNewCategoryEmpty = (newNote.categoryID == 0 && categories[0].description === "")
    return hasPropEmpty || hasNewCategoryEmpty || loading;
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder="Descrição"
          value={newNote.description}
          onChange={(event: any) => setNewNote({ ...newNote, description: event.target.value })}
        />
        <br />
        <div className="input-group">
          <input
            type='text'
            placeholder="Selecione a Categoria"
            value={categories[findCategoryIndex() || 0].description}
            onChange={changeCategory}
          />
          <select
            id="categories"
            value={newNote.categoryID}
            onChange={(event: any) => setNewNote({ ...newNote, categoryID: event.target.value })
            }>
            {(categories || []).map((category, index) => (
              <option key={index} value={category.categoryID}>
                {category.description}
              </option>
            ))}
          </select>
        </div>
        <input
          type='date'
          placeholder="Previsão"
          value={newNote.intentedDate}
          onChange={(event: any) => setNewNote({ ...newNote, intentedDate: event.target.value })}
        />
        <input disabled={checkEmpty()} type='submit' />
      </form>
    </div>
  )
}
export default NewTask;