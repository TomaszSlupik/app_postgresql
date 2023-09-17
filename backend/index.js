const express = require('express')
const app = express()
const cors = require('cors')
const pool = require("./db")

// middleware Cors
app.use(cors())
app.use(express.json())


// Załadowanie do bazy danych
app.post('/todo', async (req, res) => {
    try {
        const { describe } = req.body;
        const newToDo = await pool.query(
            "INSERT INTO todo (describe) VALUES ($1) RETURNING *", 
            [describe] 
        );
        res.json(newToDo.rows[0]);
    }
    catch (err) {
        console.log(err.message)
    }
})

// Usuniecie 
app.delete('/todo/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const deleteToDo = await pool.query (
            "DELETE FROM todo WHERE todo_id = $1",
            [id]
        );
        res.json({message: "Rekord został usunięty"})
    }
    catch (err){
        console.error(err)
    }
})

// Edycja 
app.put ('/todo/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {describe} = req.body;
        const updateToDo = await pool.query(
            "UPDATE todo SET describe = $1 where todo_id = $2",
            [describe, id]
        );
        res.json({message: "Rekord został zaktualizowany"})
    }
    catch (err){
        console.error(err)
    }
})

// Wyswietelenie 
app.get('/todo', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
        console.log(allTodos)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Wystąpił błąd podczas pobierania danych z bazy danych." });
    }
});


// Port serwera
app.listen(5000, () => {
    console.log('serwer działa')
})