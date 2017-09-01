const assert = require( "chai" ).assert;
const SQF = require( "../src/SQF" );

describe( "From - VALID iterable types ", function() {
    const q = new SQF();

    const obj1 = { name: "Antonio", email: "antonio@example.com" };
    const obj2 = { name: "A. Hdez.", email: "ahdez@example.com" };
    const obj3 = { name: "Tony", email: "tony@example.com" };
    const obj4 = { name: "A. Campos", email: "acampos@example.com" };

    it( "Array", function() {
        const array = [ obj1, obj2, obj4 ];
        q.from( array );
        
        assert.lengthOf( q._from, 3 );
    });

    /*it( "Map", function() {
        const map = new Map( obj1, obj3, obj4 );
        q.from( map );
        
        assert.lengthOf( q._from, 3 );
    });

    it( "Set", function() {
        const set = new Set( obj2, obj3, obj4 );
        q.from( set );

        assert.lengthOf( q._from, 3 );
    });*/
});

describe( "From - INVALID iterable types", function() {
    const q = new SQF();
    
    it( "String", function() {
        assert.throws( function() { q.from( "Invalid type" ); }, "Error: Invalid data source" )
    });

});