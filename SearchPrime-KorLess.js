function search() {
    // 変数の取得と確認
    var k = parseFloat( document.getElementById("K").value );
    var n = parseFloat( document.getElementById("N").value );
    
    const max = 100000000;

    if ( isNaN( k ) || isNaN( n ) ) {
        document.getElementById( "result" ).textContent = "数値を入力してね";
        return;
    }
 
    // 変数修正プログラム
    function fix( x , a , b ) {
        x = Math.max( x , a );
        x = Math.min( x , b );
        x = Math.floor( x );
        return x;
    }

    k = fix( k , 2 , max );
    n = fix( n , 1 , 100 );
 
    // エラトステネスの篩
    isP = new Array( k + 1 );
    for ( i = 0 ; i <= k ; i ++ ) {
        isP[ i ] = true;
    }
    isP[ 0 ] = false;
    isP[ 1 ] = false;

    function check( a ) {
        if ( isP[ a ] ) {}
            for ( b = a ; a * b <= k ; b ++ ) {
                isP[ a * b ] = false;
            }
        }

    check( 2 );
    check( 3 );
    i = 1;
    T = true;
    while ( T ) {
        if ( 6 * i - 1 > k ) {
            T = false;
        }
        else {
            check( 6 * i - 1 );
        }
        if ( 6 * i + 1 > k ) {
            T = false;
        }
        else {
            check( 6 * i + 1 );
        }
        i ++;
    }

    // 出力
    Ans = "";
    i = k;
    a = 0;
    while ( ( i > 1 ) && ( a < n ) ) {
        if ( isP[ i ] ) {
            
            a ++;
            if ( a == 0 ) {
                Ans = `${ i }`;
            }
            else {
                Ans = `${ i }<br>` + Ans;
            }

        }
        i --;
    }
    
    if ( a < n ) {
        Ans = `${ a }個しか見つけられなかったよ<br>`+ Ans;
    }
    Ans = `K = ${ k } , N = ${ n }<br>`+ Ans;
    document.getElementById( "result" ).innerHTML = Ans;
    return;

}