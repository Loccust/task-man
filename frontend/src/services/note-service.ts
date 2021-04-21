import axios, { AxiosResponse } from 'axios';
import NoteFilterModel from '../model/note-filter-model';
import ListNoteModel from '../model/list-note-model';
import { servicesSettings } from './services.config';
import InsertNoteModel from '../model/insert-note-model';
const baseApi = axios.create(servicesSettings);

export default class NoteService {
  ListNotes(filter?: NoteFilterModel): Promise<AxiosResponse<Array<ListNoteModel>>> {
    return baseApi.post('/api/Notes/List', filter || {});
  }
  CreateNote(note: InsertNoteModel){
    return baseApi.post('/api/Notes/Create', note)
  }
  DeleteNote(id: string){
    return baseApi.delete('/api/Notes/'+id)
  }
  ChangeNote(id: string, note: InsertNoteModel){
    return baseApi.put('/api/Notes/'+id, note)
  }
}