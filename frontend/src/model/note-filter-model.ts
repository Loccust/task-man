export default class NoteFilterModel {
  public description: string = '';
  public dateFrom: string = new Date().toISOString();
  public dateTo: string = new Date(Date.now() + 7*24*60*60*1000).toISOString();
  public categoryID: number = 0;
  public done: boolean = false;
}