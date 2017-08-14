class SQF {
    constructor() {
        this._select = [];
        this._from = undefined;
        this._where = [];
    }

    select( ...statements ) {
        const isValid = statements.every(
            (statement) => {
                if ( typeof statement === "string" ) { 
                    return true; 
                }

                if ( Array.isArray( statement ) && statement.length === 2 ) {
                    if ( statement.every( ( e ) => typeof e === "string" ) ) { 
                        return true; 
                    }
                    if ( typeof statement[0] === "function" && typeof statement[1] === "string" ) { 
                        return true; 
                    }
                }

                return false;
            }
        );

        if ( isValid ) { 
            this._select = statements; 
        } else { 
            throw "Error: Invalid select statement."; 
        }

        return this;
    }

    from( dataSource ) {
        const data = Array.from( dataSource );

        const isValid = data.every( 
            ( obj ) => typeof obj === "object" 
        );

        if ( isValid ) { this._from = data; }
        else { throw "Error: Invalid data source."; }
        
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

        return this;
    }

    run() {
        let result = [];

        // Where
        result = this._from.filter( 
            ( row ) => {
                return this._where.every(
                    (clause) => {
                        return clause(row);
                    }
                );
            }
        );

        // Select
        result = result.map(
            ( row ) => {
                const projection = {};
                for ( const statement of this._select ) {

                    if ( typeof statement === "string" ) {
                        if ( row.hasOwnProperty( statement ) ) { 
                            projection[ statement ] = row[ statement ];
                        }
                    }

                    if ( Array.isArray( statement ) && statement.length === 2 ) {
                        if ( statement.every( ( e ) => typeof e === "string" && row.hasOwnProperty( statement[ 0 ] ) ) ) {
                            projection[ statement[ 1 ] ] = row[ statement[ 0 ] ];
                        }

                        if ( typeof statement[ 0 ] === "function" && typeof statement[ 1 ] === "string" ) { // Inherited properties can still be used via functions
                            projection[ statement[ 1 ] ] = statement[ 0 ]( row );
                        }
                    }
                }

                return projection;
            }
        );

        return result;
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
        const result = [];

        // Inner and left join.
        if ( type === "inner_join" || type === "left_join" ) {
            t1[ 0 ].forEach(
                ( rowT1 ) => {
                    let leftMatchFound = false; // Used for left join

                    // Inner join
                    t2[ 0 ].forEach(
                        ( rowT2 ) => {
                            if ( joinFunc( rowT1, rowT2 ) ) {
                                leftMatchFound = true;

                                const joinedRow = {};

                                for ( const key in rowT1 ) {
                                    joinedRow[ `${ t1[ 1 ] }.${ key }` ] = rowT1[ key ];
                                }
                                for ( const key in rowT2 ) {
                                    joinedRow[ `${ t2[ 1 ] }.${ key }` ] = rowT2[ key ];
                                }
                                result.push( joinedRow );
                            }
                        }
                    );

                    // Left join ( when objects doesn't match )
                    // If object for left site is not found, add left object to results
                    if ( type === "left_join" && ! leftMatchFound ) {
                        const joinedRow = {};
                        for ( const key in rowT1 ) {
                            joinedRow[ `${ t1[ 1 ] }.${ key }` ] = rowT1[ key ];
                        }
                        result.push( joinedRow );
                    }
                }
            );    
        }

        // Right join
        if ( type === "right_join" ) {
            t2[ 0 ].forEach(
                ( rowT2 ) => {
                    let rightMatchFound = false;

                    t1[ 0 ].forEach(
                        ( rowT1 ) => {
                            if ( joinFunc( rowT1, rowT2 ) ) {
                                rightMatchFound = true;

                                const joinedRow = {};

                                for ( const key in rowT1 ) {
                                    joinedRow[ `${ t1[ 1 ] }.${ key }` ] = rowT1[ key ];
                                }
                                for ( const key in rowT2 ) {
                                    joinedRow[ `${ t2[ 1 ] }.${ key }` ] = rowT2[ key ];
                                }
                                result.push( joinedRow );
                            }
                        }
                    );

                    // Right join ( when objects doesn't match )
                    // If object for right site is not found, add right object to results
                    if ( type === "right_join" && ! rightMatchFound ) {
                        const joinedRow = {};
                        for ( const key in rowT2 ) {
                            joinedRow[ `${ t2[ 1 ] }.${ key }` ] = rowT2[ key ];
                        }
                        result.push( joinedRow );
                    }
                }
            );
        }

        return result;
    }
}









