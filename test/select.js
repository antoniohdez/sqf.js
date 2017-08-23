var assert = require( "chai" ).assert;
var SQF = require( "../src/SQF" );

function throwNextTick(error) {
    process.nextTick(function () {
        throw error
    })
}


describe( "Select - Column type statements ", function() {
    var q = new SQF();
    q.select( "name", "email" );
    
    it( "Should add 'name' as column value", function() {
        assert.equal( q._select[0].value, "name" );
    });

    it( "Should set 'column' type", function() {
        assert.equal( q._select[0].type, "column" );
    });

    it( "Should not add column alias", function() {
        assert.equal( q._select[0].alias, undefined );
    });

});


describe( "Select - Star type statements", function() {
    var q = new SQF();
    q.select( "*" ); 

    it( "Should add '*' as column value", function() {
        assert.equal( q._select[0].value, "*" );
    });

    it( "Should set 'star' type", function() {
        assert.equal( q._select[0].type, "star" );
    });

    it( "Should not add column alias", function() {
        assert.equal( q._select[0].alias, undefined );
    });
});


describe( "Select - Alias type statements", function() {
    var q = new SQF();
    q.select( [ "name", "firstname" ] );
    var statement = q._select[ 0 ];

    it( "Should add 'name' as column value", function() {
        assert.equal( statement.value, "name" );
    });

    it( "Should set 'alias' type", function() {
        assert.equal( statement.type, "alias" );
    });

    it( "Should add 'firstname' as column alias", function() {
        assert.equal( statement.alias, "firstname" );
    });
});


describe( "Select - Function type statements", function() {
    var q = new SQF();
    q.select( [ (row) => row.name, "firstname" ] );
    statement = q._select[ 0 ];

    it( "Should add a function as column value", function() {
        assert.typeOf( statement.value, "function" );
    });

    it( "Should set 'function' type", function() {
        assert.equal( statement.type, "function" );
    });

    it( "Should add 'firstname' as column alias", function() {
        assert.equal( statement.alias, "firstname" );
    });
});


describe( "Select - General tests", function() {
    var q = new SQF();
    q.select( [ (row) => row.name, "firstname" ], "*", [ "email", "email_address" ] );

    it( "Should be length 3", function() {
        assert.equal( q._select.length, 3 );
    });
});


describe( "Select - Invalid statements (throw error)", function() {
    var q = new SQF();

    it( "Function without alias", function() {
        assert.throws( function() { q.select( (row) => row ) }, "Error: Invalid select statement." );
    });

    it( "Star type with alias", function() {
        assert.throws( function() { q.select( [ "*", "alias" ] ) }, "Error: Invalid select statement." );
    });

    it( "Invalid statements type", function() {
        assert.throws( function() { q.select( 2 ) }, "Error: Invalid select statement." );
    });

    it( "Double star type statement", function() {
        assert.throws( function() { q.select( "*", "*" ) }, "Error: Invalid select statement." )
    });
    
});