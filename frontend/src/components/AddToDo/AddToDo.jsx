import React from 'react'
import { Button } from '@mui/material'
import './AddToDo.scss'

export default function AddToDo(props) {

// Zapis do PostgreSql
const saveDateToPostgreSql = async () => {
    try {
      const response = await fetch('http://localhost:5000/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ describe: props.describe }),
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


  return (
    <div className='addtodo'>
        <h2>Dodaj do bazy danych</h2>
        <div className="addtodo__item">
                    <input 
                className='addtodo__item-inputnumber'
                value={props.number}
                onChange={(e) => props.setNumberId(e.target.value)}
                type="number" />
                <input 
                className='addtodo__item-inputtext'
                value={props.describe}
                onChange={(e) => props.setDescibe(e.target.value)}
                type="text" />
                <Button 
                variant='contained'
                onClick={saveDateToPostgreSql}>Zapisz</Button>
        </div>
    </div>
  )
}
