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
        departmentId: 1
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
        departmentId: 1
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
        departmentId: 2
    },
    {
        id: 4,
        firstname: "Kevin",
        lastname: "B.",
        email: "kevin@sqf.js",
        hireDate: new Date(),
        age: 24,
        jobTitle: "Software Developer",
        salary: 15000,
        departmentId: 1
    },
    {
        id: 5,
        firstname: "JL",
        lastname: "Q.",
        email: "jl@sqf.js",
        hireDate: new Date(),
        age: 24,
        jobTitle: "Manager",
        salary: 20000,
        departmentId: 5
    }
];

const departments = [
    {
        id: 1,
        department: "IT",
        projects: 4
    },
    {
        id: 2,
        department: "Sales",
        projects: 2
    },
    {
        id: 3,
        department: "HR",
        projects: 5
    },
    {
        id: 4,
        department: "Sales",
        projects: 2
    }
];

const query = new SQF(); // Query

query.select( 
    "*",
    [
        (row) => `${ row[ 'emp.firstname' ] } ${ row[ 'emp.lastname' ] }`,
        "fullname"
    ], 
    ["emp.email", "email_address"],
    "dept.department"
);

query.from( 
    SQF.FULL_OUTER_JOIN( 
        [employees, "emp"], 
        [departments, "dept"], 
        (emp, dept) => emp.departmentId === dept.id  
    ) 
);

query.where(
    /*(row) => row[ "emp.salary" ] > 10000, 
    (row) => row[ "dept.department" ] === "IT" */
);

const result = query.run();
console.table(result);