const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "thiru@mysql",
    database: "student_db"
});


// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("MySQL connection failed:", err);
        return;
    }

    console.log("MySQL connected successfully");
});


// GET - Get all students
app.get("/students", (req, res) => {

    db.query("SELECT * FROM students", (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});


// POST - Add student
app.post("/students", (req, res) => {

    const { name, email, phone, course } = req.body;

    const id = Date.now();

    const sql =
        "INSERT INTO students (id, name, email, phone, course) VALUES (?, ?, ?, ?, ?)";

    db.query(
        sql,
        [id, name, email, phone, course],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                id: id,
                name: name,
                email: email,
                phone: phone,
                course: course
            });
        }
    );
});


// PUT - Update student
app.put("/students/:id", (req, res) => {

    const { name, email, phone, course } = req.body;
    const id = req.params.id;

    const sql =
        "UPDATE students SET name=?, email=?, phone=?, course=? WHERE id=?";

    db.query(
        sql,
        [name, email, phone, course, id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});


// DELETE - Delete student
app.delete("/students/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM students WHERE id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Student deleted successfully"
            });
        }
    );
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});