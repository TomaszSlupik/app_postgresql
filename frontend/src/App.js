import './App.css';
import {useEffect, useState} from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

function App() {

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


// Zapis do PostgreSql
const saveDateToPostgreSql = async () => {
  try {
    const response = await fetch('http://localhost:5000/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ describe }),
    });

    if (response.ok) {
      console.log('Dane zostały zapisane do PostgreSQL.');
      window.location.reload();
    } else {
      console.error('Wystąpił błąd podczas zapisywania danych do PostgreSQL.');
    }
  } catch (error) {
    console.error('Wystąpił błąd podczas żądania do serwera.', error);
  }
}


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


  return (
    <div className="App">
      <h2>Dodaj do bazy danych</h2>
      <input 
      value={number}
      onChange={(e) => setNumberId(e.target.value)}
      type="number" />
      <input 
      value={describe}
      onChange={(e) => setDescibe(e.target.value)}
      type="text" />
      <button onClick={saveDateToPostgreSql}>Zapisz</button>
      <h2>Lista zadań:</h2>
      <ul>
        {todos.map((todo) => (
          <>
          <li key={todo.todo_id}>{todo.describe}</li>
          <DeleteIcon 
          onClick={() => DeleteDateWithPostgreSql(todo.todo_id)}
          />
          </>
        ))}
      </ul>

    </div>
  );
}

export default App;
