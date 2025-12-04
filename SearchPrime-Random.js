function search() {
    // 変数の取得
    A = parseFloat( document.getElementById("A").value );
    B = parseFloat( document.getElementById("B").value );
    N = parseInt( document.getElementById("N").value );
    
    if ( isNaN( A ) || isNaN( B ) || isNaN( N ) ) {
        document.getElementById( "result" ).textContent = "数値を入力してね";
        return;
    }

    const Bmax = 100000000;
    const Amax = Bmax - 1;
    const Nmax = 100;


    // 変数の補正
    function fix( x , min , max ) {
        x = Math.max( x , min );
        x = Math.min( x , max );
        return x;
    }
    
    if ( A > B ) {
        [ A , B ] = [ B , A ];
    }

    b = Math.ceil( fix( B , 10 , Bmax ) );
    a = Math.floor( fix( A , b - 1 , Amax ) );
    n = fix( N , 1 , Nmax );

    // 上限bでエラトステネスの篩
    isP = new Array( b + 1 );
    for ( i = 0 ; i <= b ; i ++ ) {
        isP[ i ] = true;
    } 
    isP[ 0 ] = false;
    isP[ 1 ] = false;

    function check( i ) {
        if ( isP[ i ] ) {
            for ( k = i * i ; k <= b ; k += i ) {
                isP[ k ] = false;
            }
            if ( ( A <= i ) && ( i <= B ) ) {
                Prime.push( i );
            }
        }
    }

    // A以上B以下の素数を記録する配列を作成する
    Prime = new Array( 0 );
    check( 2 );
    check( 3 );
    i = 1;
    while ( true ) {
        if ( 6 * i - 1 <= b ) {
            check( 6 * i - 1 );
        }
        else {
            break;
        }
        if ( 6 * i + 1 <= b ) {
            check( 6 * i + 1 );
        }
        else {
            break;
        }
        i ++;
    }
    
    // 答えを出力する
    Save = new Array( 0 );
    Ans = `A = ${ A } , B = ${ B }<br>N = ${ n }<br>`;
    if ( Prime.length <= N ) {
        if ( Prime.length < N ) {
            Ans += `${ Prime.length }個しか見つけられなかったよ<br>`;
        }
        Save = Prime.slice();
    }

    else {
        
        while ( Save.length < n ) {
            r = Math.floor( Math.random() * Prime.length );
            s = Prime.splice( r , 1 );
            Save.push( s[ 0 ] );
        }
        Save.sort( ( a , b ) => a - b );
    }
    
    for ( i = 0 ; i < Save.length ; i ++ ) {
        Ans += `${ Save[ i ] }<br>`;
    }
    document.getElementById( "result" ).innerHTML = Ans;
    return;

}