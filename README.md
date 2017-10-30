# sqf.js

Tool created with the purpose of manipulating data similar to how it would be done in SQL through Javascript syntax.

Setup
-----

Include the SQF.js class file into your project.

Usage
-----

sqf.js works best with data parsed from a JSON format but it can as well accept as input any kind of iterable within javascript.

### Building a query

```javascript 
const q = new SQF(); //instanciate object
```

Overload query with the usual SQL sentence structure. 

```javascript 
query.select('*').from(departments) //selects all columns within 'departments' collection
```

Execute query with the run command.

```javascript 
query.run();
```

#### Projection or select

Projection receives as argument the names of the colums to be selected separated by commas

```javascript 
query.select("firstname", "lastname").from(employees)
```
Renaming and preprocessing of columns is also supported and they should be enclosed inside an iterable  so that the first element is the name of the target column and the second the new alias.

```javascript 
query.select(
	"email", 
	[ "jobTitle", "job"],	// 'jobTitle' column gets renamed to 'job'
    [
     	(row) => `${ row[ 'firstname' ] } ${ row[ 'lastname' ] }`, 
     	"fullname"		// firstname and lastname get concatenated into 'fullname'
    ]
).from(employees)
```
Anonymous functions can also be passed within the iterable as first argument to perform any kind of processing whose result gets into a whole new column.

#### Join

Join receives as its two first arguments the collections to be joined as well as its alias followed by the function specifiying the atrributes under which the join is going to be executed.

```javascript 
query.from(
    SQF.JOIN( 
        [employees, "emp"], 
        [departments, "dept"], 
        (emp, dept) => emp.departmentId === dept.id  
    ) 
);
```

#### Selection or where

Selecting requires a function per condition, multiple conditions can be added by placing a comma after each function.

```javascript
query.where(
    (row) => row[ "emp.salary" ] > 10000, 
    (row) => row[ "dept.department" ] === "IT"
);
```

### Methods

| Operation  			| Keyword				| Supported	|
| ------------- 		| ----------- 			| ----------|
| Projection (select)	|  .select				|	✅		|
| Join					| SQF.JOIN  			|   ✅  	|
| Left-join  			| SQF.LEFT_JOIN 		|   ✅  	|
| Right-join  			| SQF.RIGHT_JOIN 		|   ✅  	|
| Full outer join  		| SQF.FULL_OUTER_JOIN  	|   ✅  	|
| Selection  (where)	| .where  				|   ✅  	|
| Group by  			| ❌  					|   ❌  	|
| Order by  			| ❌  					|   ❌  	|
| Having  				| ❌  					|   ❌  	|
| Insert  				| ❌  					|   ❌  	|
| Delete  				| ❌  					|   ❌  	|
| Update  				| ❌  					|   ❌  	|