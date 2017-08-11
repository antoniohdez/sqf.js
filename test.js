const employees = [
    {
        id: 1,
        firstname: "Antonio",
        lastname: "Hernández",
        email: "antonio@sqf.js",
        hireDate: new Date(),
        age: 24,
        jobTitle: "Software Developer",
        salary: 10000,
        department: "IT"
    },
    {
        id: 2,
        firstname: "Juan",
        lastname: "Perez",
        email: "juan@sqf.js",
        hireDate: new Date(),
        age: 23,
        jobTitle: "Software Developer",
        salary: 12000,
        department: "IT"
    },
    {
        id: 3,
        firstname: "Brian",
        lastname: "K.",
        email: "brian@sqf.js",
        hireDate: new Date(),
        age: 27,
        jobTitle: "Sales Manager",
        salary: 10000,
        department: "Sales"
    }
];

const q = new SQF(); // Query

q.select( 
    "id",
    [
        (row) => `${row.firstname} ${row.lastname}`, 
        "fullname"
    ], 
    ["email", "email_address"],
    "department"
);

q.from(employees);

q.where(
    (row) => row.salary > 10000, 
    (row) => row.department === "IT" 
);

const result = q.run();
console.table(result);