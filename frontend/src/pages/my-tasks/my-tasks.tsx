import {
  Container, Grid, Button, TextField, FormControl, Select, MenuItem, InputLabel,
  FormControlLabel, Checkbox
} from '@material-ui/core';
import { DataGrid, GridRowsProp, GridColDef, GridCellParams } from '@material-ui/data-grid';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import NoteFilterModel from '../../model/note-filter-model';
import NoteService from '../../services/note-service';
import ListNoteModel from '../../model/list-note-model';
import DateFnsUtils from '@date-io/date-fns';
import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Delete, Edit, Search, Check } from '@material-ui/icons';
import InsertNoteModel from '../../model/insert-note-model';
import CategoryService from '../../services/category-service';
import CategoryModel from '../../model/categories-model';
import './my-tasks.css'
import 'date-fns';

export default function MyTasks() {
  const noteService: NoteService = new NoteService();
  const categoryService: CategoryService = new CategoryService();

  const [filter, setFilter] = React.useState(new NoteFilterModel());
  const [rows, setRows] = React.useState(new Array<GridRowsProp>());
  const [categories, setCategories] = React.useState(new Array<CategoryModel>());

  const handleDescriptionFilterChange = (event: any) =>
    setFilter({ ...filter, description: event.target.value as string });
  const handleDoneFilterChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFilter({ ...filter, done: event.target.checked as boolean });
  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) =>
    setFilter({ ...filter, categoryID: Number(event.target.value as string) });
  const handleDateToChange = (date: Date | null) => {
    if (date)
      setFilter({ ...filter, dateTo: date.toString() });
  };
  const handleDateFromChange = (date: Date | null) => {
    if (date)
      setFilter({ ...filter, dateFrom: date.toString() });
  };
  const [snack, setSnack] = React.useState({ open: false, message: '' });
  const handleCloseSnack = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnack({ open: false, message: '' });
  };

  const searchCategories = () => {
    categoryService.ListCategories().then((response: any) => {
      if (response)
        if (response.data.length > 0) {
          setCategories(response.data);
        }
    }).catch(err => {
      console.error(err);
      setSnack({ open: true, message: 'Não foi possível obter tarefas!' });
    });
  };
  const searchNotes = () => {
    noteService.ListNotes(filter).then((response: any) => {
      if (response)
        if (response.data.length > 0) {
          let notes = response.data.map((note: ListNoteModel) => {
            const { noteID, ...rest } = note;
            return { id: noteID, edited: false, ...rest }
          })
          notes.splice(0, 0, { id: 0, description: '', category: '', intentedDate: '', done: false, edited: true });
          setRows(notes);
        }
    }).catch(err => {
      console.error(err);
      setSnack({ open: true, message: 'Não foi possível obter tarefas!' });
    });
  };

  const DeleteNote = (id: string) => {
    noteService.DeleteNote(id).then((response: any) => {
      console.log(response)
      if (response)
        setSnack({ open: true, message: 'Tarefa(id:' + id + ')deletada.' });
    }).catch(err => {
      console.error(err);
      setSnack({ open: true, message: 'Não foi possível deletar tarefa!' });
    });
  };

  const InsertTask = (note: InsertNoteModel) => {
    noteService.CreateNote(note).then((response: any) => {
      console.log(response)
      if (response)
        setSnack({ open: true, message: 'Tarefa criada com sucesso.' });
    }).catch(err => {
      console.error(err);
      setSnack({ open: true, message: 'Não foi possível criar tarefa!' });
    });
  }

  useEffect(() => {
    searchNotes();
    searchCategories();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: ' Tarefa',
      sortable: false,
      width: 300,
      disableClickEventBubbling: true,
      renderCell: (params: GridCellParams) => {
        const handleNewDescriptionChange = (event: any) => {
          const newRows: any[] = {...rows};
          newRows[params.row.id].description += event.target.value;
          // setRows(newRows);
        };
        return (
          <TextField
            id="description"
            label="Descrição"
            type="text"
            variant="outlined"
            disabled={!params.row.edited}
            InputLabelProps={{
              shrink: true,
            }}
            value={params.row.description}
            onChange={handleNewDescriptionChange}
          />
        );
      }
    },
    {
      field: 'category',
      headerName: 'Categoria',
      sortable: false,
      width: 300,
      disableClickEventBubbling: true,
      renderCell: (params: GridCellParams) => {
        const handleCategoryChange = (event: any) => {
          console.log(event.target.value);
        };
        return (
          <FormControl id="category">
            <InputLabel id="category-select-label">Categoria</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              disabled={!params.row.edited}
              value={params.row.categoryID}
              onChange={handleCategoryChange}
              onClick={searchCategories}
            >
              <MenuItem value={0}>Selecione</MenuItem>
              {categories.forEach((category: CategoryModel) => {
                <MenuItem value={category.categoryID}> {category.description} </MenuItem>
              })}
            </Select>
          </FormControl>
        );
      }
    },
    {
      field: 'intentedDate',
      headerName: 'Previsão',
      sortable: false,
      width: 300,
      disableClickEventBubbling: true,
      renderCell: (params: GridCellParams) => {
        const handleIntentedDateChange = (event: any) => {
          console.log(event.target.value);
        };
        return (
          <TextField
            id="date"
            label="Previsão"
            type="datetime-local"
            variant="outlined"
            disabled={!params.row.edited}
            InputLabelProps={{
              shrink: true,
            }}
            value={params.row.intentedDate}
            onChange={handleIntentedDateChange}
          />
        );
      }
    },
    {
      field: "done",
      headerName: "Status",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params: GridCellParams) => {
        const handleDoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log(event.target.checked);
        };
        return <Checkbox color="primary" checked={params.row.done} onChange={handleDoneChange} />;
      }
    },
    {
      field: "edt",
      headerName: "",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params: GridCellParams) => {
        const handleEditClick = (event: any) => {
          if (params.row.edited)
            params.row.edited = !params.row.edited;
          else {
            let insertNote = new InsertNoteModel();
            const { id, description, categoryID, intentedDate, done } = params.row;
            insertNote = { noteID: id, description, categoryID, intentedDate, done }
            InsertTask(insertNote)
          }
        };
        return (
          <Button onClick={handleEditClick}>
            {params.row.edited ?
              <Check fontSize="small" /> :
              <Edit fontSize="small" />}
          </Button>);
      }
    },
    {
      field: "del",
      headerName: "",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params: GridCellParams) => {
        const handleDeleteClick = (event: any) => {
          DeleteNote(params.row.id);
          searchNotes();
        };
        return (
          <Button onClick={handleDeleteClick} disabled={params.row.id == 0}>
            <Delete fontSize="small" />
          </Button>);
      }
    },
  ];

  return (
    <Container>
      <h2> Minhas tarefas</h2>
      <form noValidate autoComplete="off">
        <Grid container className="filters">
          <div>
            <Button onClick={searchNotes}>
              <Search />
            </Button>
          </div>
          <TextField id="standard-basic" label="Descrição" value={filter.description} onChange={handleDescriptionFilterChange} />
          <FormControl id="category">
            <InputLabel id="category-select-label">Categoria</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={filter.categoryID}
              onChange={handleCategoryChange}
              onClick={searchCategories}
            >
              <MenuItem value={0}>Selecione</MenuItem>
              {categories.forEach((category: CategoryModel) => {
                <MenuItem value={category.categoryID}> {category.description} </MenuItem>
              })}
            </Select>
          </FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-initial"
              label="Data Inicial"
              value={filter.dateFrom}
              onChange={handleDateFromChange}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-final"
              label="Data Final"
              value={filter.dateTo}
              onChange={handleDateToChange}
            />
          </MuiPickersUtilsProvider>
          <FormControlLabel
            control={<Checkbox
              color="primary"
              checked={filter.done}
              onChange={handleDoneFilterChange}
              name="done"
            />}
            label="Concluídas"
          />
        </Grid>
      </form>
      <div className="grid">
        <DataGrid
          disableColumnFilter
          rows={rows}
          columns={columns}
          pageSize={10}
          autoHeight={true} />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={snack.open}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message={snack.message}
        />
      </div>
    </Container >
  );
}