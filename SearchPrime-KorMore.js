function search() {
    // 変数の取得
    K = parseFloat( document.getElementById("K").value );
    N = parseInt( document.getElementById("N").value );
    
    const Kmax = 100000000;
    const Nmax = 100;

    if ( isNaN( K ) || isNaN( N ) ) {
        document.getElementById( "result" ).textContent = "数値を入力してね";
        return;
    }

    // 変数の補正
    function fix( x , a , b ) {
        x = Math.max( x , a );
        x = Math.min( x , b );
        x = Math.floor( x );
        return x;
    }

    k = fix( K , 2 , Kmax );
    n = fix( N , 1 , Nmax );

    // エラトステネスの篩。上限：K + 10000
    k2 =  k + 10000;
    isP = new Array( k2 + 1 );
    for ( i = 0 ; i <= k2 ; i ++ ) {
        isP[ i ] = true;
    }
    isP[ 0 ] = false;
    isP[ 1 ] = false;

    function check( i ) {
        if ( isP[ i ] ) {
            for ( k = i ; k * i <= k2 ; k ++ ) {
                isP[ k * i ] = false;
            }
            if ( i >= K ) {
                Prime.push( i );
            }
        }
    }

    // K以上の素数をN個見つけるまで、素数を探索する
    Prime = new Array( 0 );
    check( 2 );
    check( 3 );
    i = 1;
    while ( Prime.length < n  ) {
        if ( 6 * i - 1 <= k2 ) {
            check( 6 * i - 1 );
        }
        else {
            break;
        }
        if ( 6 * i + 1 <= k2 ) {
            check( 6 * i + 1 );
        }
        else {
            break;
        }
        i ++;
    }

    // 答えを出力する
    Ans = `K = ${ K } , N = ${ n }<br>`;
    if ( Prime.length < n ) {
        Ans += `${ Prime.length }個しか見つけられなかったよ<br>`;
    }
    for ( i = 0 ; i < Prime.length ; i ++ ) {
        Ans += `${ Prime[ i ] }<br>`;
    }
    document.getElementById( "result" ).innerHTML = Ans;
    return;
}
