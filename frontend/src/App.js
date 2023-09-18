import './App.scss';
import {useEffect, useState} from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import AddToDo from './components/AddToDo/AddToDo';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


function App() {

// Stany dla tabeli todo
const [number, setNumberId] = useState('')
const [describe, setDescibe] = useState('')
const [todos, setTodos] = useState([]); // Stan przechowujący dane z bazy

// Funkcja do pobierania danych z serwera i aktualizacji stanu "todos"
const fetchTodos = async () => {
  try {
    const response = await fetch('http://localhost:5000/todo');

    if (response.ok) {
      const data = await response.json();
      setTodos(data); 
      console.error('Wystąpił błąd podczas pobierania danych z PostgreSQL.');
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas żądania do serwera.', error);
  }
};

// Wywołanie funkcji fetchTodos po pierwszym renderowaniu komponentu
useEffect(() => {
  fetchTodos();
}, []);





// Usuwanie z PostgreSql
const DeleteDateWithPostgreSql = async (todo_id) => {
  try {
      const res = await fetch (`http://localhost:5000/todo/${todo_id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        console.log('Rekord został usunięty')
        window.location.reload();
      }
      else {
        console.log('Wystąpił błąd')
      }
  }
  catch (error){
      console.error('Błąd - nie usunięto', error)
  }
}


// Edycja 
const [updateDescribe, setUpdateDescribe] = useState("")

const EditDateWithPostgreSql = async (todo_id, updateDescribe) => {
    try {
      const res = await fetch (`http://localhost:5000/todo/${todo_id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ describe:  updateDescribe}),
      })
      if (res.ok) {
        window.location.reload()
        console.log('Edycja nastąpiła poprawnie do bazy')
      }
      else {
        console.log('Błąd edycji danych do bazy')
      }
    }
    catch (error) {
        console.error(error)
    }
}


// Otwieranie okna edycjo
const [open, setOpen] = useState(false);
const [selectedTodo, setSelectedTodo] = useState(null);


  const handleClickOpen = (todo_id, describe) => {
    setSelectedTodo({ todo_id, describe })
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

// Otwieranie okdna usuwania 
const [deleteOpen, setDeleteOpen] = useState(false)
const [selectedDeleted, setSelectedDeleted] = useState(null)

const handleClickOpenAndDelete = (todo_id, describe) => {
      setSelectedDeleted({ todo_id, describe })
      setDeleteOpen(true)
}

const handleClickCloseAndDelete = () => {
      setDeleteOpen(false)
}

  return (
    <div className="App">
      <AddToDo 
      number={number}
      setNumberId={setNumberId}
      describe={describe}
      setDescibe={setDescibe}
      />
      
      <h2>Lista zadań:</h2>
      <div className='App__todo'>
      <ul className='App__todo'>
        {todos.map((todo) => (
          <>
          <li 
          className='App__todo-task'
          key={todo.todo_id}>
            <div
            className='App__todo-task--header'
            >{todo.describe}
            </div>
            <div
             className='App__todo-task--icon'
            >
                          <Button
        variant="outlined"
        onClick={() => handleClickOpen(todo.todo_id, todo.describe)}
        >
                Edytuj <EditIcon />
        </Button>
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edycja: {selectedTodo ? selectedTodo.describe : ''}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <TextField
            label="nowy opis"
            variant='outlined'
            value={updateDescribe}
            onChange={(e) => setUpdateDescribe(e.target.value)}
            >

            </TextField>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus 
          onClick={
            () => {EditDateWithPostgreSql(selectedTodo.todo_id, updateDescribe);
            handleClose ()
            }}>
            Zapisz
          </Button>
        </DialogActions>
      </BootstrapDialog>


          <DeleteIcon 
          style={{color: 'red', cursor: 'pointer'}}
          onClick={() => handleClickOpenAndDelete(todo.todo_id, todo.describe)}
          />

        <BootstrapDialog
        onClose={handleClickCloseAndDelete}
        aria-labelledby="customized-dialog-title"
        open={deleteOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title"
        style={{marginTop: '1em'}}
        >
          Usuwanie z bazy danych: 
          
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClickCloseAndDelete}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {selectedDeleted ? selectedDeleted.describe : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus 
          onClick={
            () => {DeleteDateWithPostgreSql(selectedDeleted.todo_id, selectedDeleted.describe);
            handleClickCloseAndDelete()
            }}>
            Zapisz
          </Button>
        </DialogActions>
      </BootstrapDialog>


            </div>

          </li>
          

          </>
        ))}
      </ul>
      </div>

          
    </div>
  );
}

export default App;
