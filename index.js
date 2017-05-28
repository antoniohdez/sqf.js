class SQF {
	constructor() {
		this.selectExpressions = []; // Select
		this.dataSource = undefined; // From
		this.conditions = []; // Where
	}

	select(...expressions) { // Or just use arguments instead of the spread operator
		for (const expression of expressions) {
			this.selectExpressions.push(expression);
		}
		return this;
	}

	from(source) {
		this.dataSource = source;
		return this;
	}

	where(...conditions) {
		for (const condition of conditions) {
			this.conditions.push(condition);
		}
		return this;
	}

	run() {		
		return this.dataSource.filter((row) => { // Where processing
			return this.conditions.every((condition) => {
				return condition(row);;
			});
		}).map((row) => { // Select processing
			const projection = {};
			for (const expression of this.selectExpressions) {
				projection[expression] = row[expression];
			}
			return projection;
		});
	}
}

const employees = [
	{
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
	"firstname", 
	"lastname",
	"department" 
);

q.from(employees);

q.where(
	(row) => row.salary > 10000, 
	(row) => row.department === "IT" 
);

const result = q.run();
console.log(result);

/*
q.select( 
	"column1", 
	"column2", 
	["column3", "AliasC"], 
	[(row) => `${row.column1 + row.column2}`, "AliasB"] 
);
*/