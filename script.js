const API = "http://localhost:5000/students";

let editingId = null;


// Display students
async function displayStudents() {

    let response = await fetch(API);
    let students = await response.json();

    let table = document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(function(student) {

        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.course}</td>

                <td>
                    <button onclick="editStudent(${student.id})">
                        Edit
                    </button>

                    <button onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// Add / Update student
async function addStudent() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let course = document.getElementById("course").value;

    if (name === "" || email === "" || phone === "" || course === "") {
        alert("Please fill all fields");
        return;
    }


    // UPDATE
    if (editingId !== null) {

        await fetch(`${API}/${editingId}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                course: course
            })
        });

        alert("Student updated successfully");

        editingId = null;

    }

    // ADD
    else {

        await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                course: course
            })
        });

        alert("Student added successfully");
    }


    clearForm();

    displayStudents();
}


// Edit student
async function editStudent(id) {

    let response = await fetch(API);

    let students = await response.json();

    let student = students.find(function(s) {
        return s.id == id;
    });


    if (student) {

        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;
        document.getElementById("course").value = student.course;

        editingId = id;

        document.querySelector(".form-box button").textContent =
            "Update Student";
    }
}


// Delete student
async function deleteStudent(studentId) {

    await fetch(`${API}/${studentId}`, {
        method: "DELETE"
    });

    alert("Student deleted");

    displayStudents();
}


// Clear form
function clearForm() {

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("course").value = "";

    document.querySelector(".form-box button").textContent =
        "Add Student";
}


// Search student
function searchStudent() {

    let search =
        document.getElementById("search").value.toLowerCase();

    let rows =
        document.querySelectorAll("#studentTable tr");


    rows.forEach(function(row) {

        let name =
            row.cells[1].textContent.toLowerCase();

        row.style.display =
            name.includes(search) ? "" : "none";
    });
}


// Load students when page opens
displayStudents();