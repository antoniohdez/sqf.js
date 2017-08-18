class SQF {
    constructor() {
        this._select = [];
        this._from = [];
        this._where = [];

    }

    select( ...statements ) {
        function getStatement( value, type, alias ) {
            return { value, type, alias };
        }
        const arrayLength = 2; // Valid legth for array select statements
        const statementIndex = 0; // Statement [string|function] index
        const aliasIndex = 1; // Alias index

        
        let isValid = false;

        isValid = statements.every(
            (statement) => {
                let selectStatement = {};

                if ( typeof statement === "string" ) {

                    if ( statement === "*" ) {
                        selectStatement = getStatement( statement, "star" );
                    } else {
                        selectStatement = getStatement( statement, "column" );
                    }

                    this._select.push( selectStatement );
                    return true;
                }

                if ( Array.isArray( statement ) && statement.length === arrayLength ) {

                    if ( statement.every( ( e ) => typeof e === "string" ) ) { 
                        selectStatement = getStatement( statement[ statementIndex ], "alias", statement[ aliasIndex ] );

                    } else if ( typeof statement[ statementIndex ] === "function" && typeof statement[ aliasIndex ] === "string" ) {
                        selectStatement = getStatement( statement[statementIndex], "function", statement[aliasIndex] );

                    } else {
                        return false;
                    }

                    this._select.push( selectStatement );
                    return true;
                }

                return false;
            }
        );

        console.log( this._select );

        if ( !isValid ) { 
            throw "Error: Invalid select statement."; 
        }

        console.log( this );
        return this;
    }

    from( source ) {
        const data = Array.from( source );

        const isValid = data.every( 
            ( obj ) => typeof obj === "object" 
        );

        if ( isValid ) { 
            this._from = data;
        }
        else { 
            throw "Error: Invalid data source.";
        }
        
        console.log( this );
        return this;
    }

    where( ...clauses ) {
        const isValid = clauses.every( 
            (condition) => typeof condition === "function" 
        );
        
        if ( isValid ) { 
            this._where = clauses; 
        } else { 
            throw "Error: Invalid where clause."; 
        }

        console.log( this );
        return this;
    }

    _projection( row ) {
        let projection = {};

        for ( const statement of this._select ) {
            
            switch ( statement.type ) {
                case "star":
                    projection = row;
                    break;

                case "column":
                    projection[ statement.value ] = row[ statement.value ];
                    break;

                case "alias":
                    projection[ statement.alias ] = row[ statement.value ];
                    break;

                case "function":
                    projection[ statement.alias ] = statement.value( row );
                    break;
            }
        }

        return projection;
    }

    run() {
        console.log( this );
        let result = [];

        // Where
        result = this._from.filter( 
            ( row ) => {
                return this._where.every(
                    ( clause ) => {
                        return clause( row );
                    }
                );
            }
        );

        // Select
        result = result.map( (row) => this._projection( row ) );

        return result;
    }

    *cursor() {
        const rows = this._from;

        for ( let i = 0; i < rows.length; i++ ) {
            const row = rows[ i ];

            const validRow = this._where.every(
                ( clause ) => {
                    return clause( row );
                }
            );
            if ( validRow ) {
                yield this._projection( row );
            }

        }
    }

    static LEFT_JOIN( t1, t2, joinFunc ) {
        return this.JOIN( t1, t2, joinFunc, "left_join" );
    }

    static RIGHT_JOIN( t1, t2, joinFunc ) {
        return this.JOIN( t1, t2, joinFunc, "right_join" );
    }

    static FULL_OUTER_JOIN( t1, t2, joinFunc ) {
        return this.JOIN( t1, t2, joinFunc, "full_outer_join" );
    }

    static JOIN( t1, t2, joinFunc, type = "inner_join" ) {
        const _joinRows = ( rowT1, rowT2, aliasT1, aliasT2 ) => {
            const joinedRow = {};

            for ( const key in rowT1 ) {
                joinedRow[ `${ aliasT1 }.${ key }` ] = rowT1[ key ];
            }
            for ( const key in rowT2 ) {
                joinedRow[ `${ aliasT2 }.${ key }` ] = rowT2[ key ];
            }

            return joinedRow;
        };

        const result = [];

        // Inner, left, full outer join.
        if ( type === "inner_join" || type === "left_join" || type === "full_outer_join" ) {
            t1[ 0 ].forEach(
                ( rowT1 ) => {
                    let leftMatchFound = false; // Used for left join

                    // Inner join
                    t2[ 0 ].forEach(
                        ( rowT2 ) => {
                            if ( joinFunc( rowT1, rowT2 ) ) {
                                leftMatchFound = true;

                                const joinedRow = _joinRows( rowT1, rowT2, t1[ 1 ], t2[ 1 ] );
                                
                                result.push( joinedRow );
                            }
                        }
                    );

                    // Left join ( when objects doesn't match )
                    // If object for left site is not found, add left object to results
                    if ( ( type === "left_join" || type === "full_outer_join" ) && ! leftMatchFound ) {
                        const joinedRow = _joinRows( rowT1, {}, t1[ 1 ], undefined );

                        result.push( joinedRow );
                    }
                }
            );    
        }

        // Right and full outer join 
        if ( type === "right_join" || type === "full_outer_join" ) {
            t2[ 0 ].forEach(
                ( rowT2 ) => {
                    let rightMatchFound = false;

                    t1[ 0 ].forEach(
                        ( rowT1 ) => {
                            if ( joinFunc( rowT1, rowT2 ) ) {
                                rightMatchFound = true;

                                if ( type === "right_join" ) {
                                    const joinedRow = _joinRows( rowT1, rowT2, t1[ 1 ], t2[ 1 ] );

                                    result.push( joinedRow );    
                                }
                            }
                        }
                    );

                    // Right join ( when objects doesn't match )
                    // If object for right site is not found, add right object to results
                    if ( ( type === "right_join" || type === "full_outer_join" ) && ! rightMatchFound ) {
                        const joinedRow = _joinRows( rowT2, {}, t2[ 1 ], undefined );
                        
                        result.push( joinedRow );
                    }
                }
            );
        }

        return result;
    }
}









