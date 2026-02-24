function Calculate() {
    // 変数を取得
    const NumData = document.getElementById( "inputNum" );
    const NumMin = NumData.min;
    const NumMax = NumData.max;
    var N = parseInt( NumData.value );

    if ( isNaN( N ) ) {
        document.getElementById( "result" ).innerHTML = "自然数を入力してね";
        return;
    }
    
    // 変数修正
    N = Math.max( N , NumMin );
    N = Math.min( N , NumMax );

    // 順にかけていく
    function Factorial( n ) {
      Product = "1";
      for ( i = 1 ; i <= n ; i ++ ) {
          Product = Multiple( Product , i );
      }
      
      return Product;
    }
  
    // 大きい数値用の掛け算
    function Multiple( a , b ) {
      // 文字列aを配列に変換し、各桁にbをかける
      A = a.split( "" ).map( Number );
      for ( k = 0 ; k < A.length ; k ++ ) {
          A[ k ] *= b;
      }
      
      // 繰り上げる
      k = A.length - 1;
      while ( k > 0 ) {
          if ( A[ k ] >= 10 ) {
              
              // k = 0の時、桁を伸ばす特殊な処理
              if ( k == 0 ) {
                  A.unshift( Math.floor( A[ k ] / 10 ) );
                  k ++;
                  A[ k ] %= 10;
              } 
              
              else {
                  A[ k - 1 ] += Math.floor( A[ k ] / 10 );
                  A[ k ] %= 10;
              }
          }
          
          k --;
      }
      
      // 答えを文字列の形で返す
      return A.join( "" );
  }
  
  // カンマ区切り
  function CommaSeparate( ans ) {
      str = "";
      i = ans.length;
      while ( i > 0 ) {
          str = ans.substring( i - 3 , i ) + str;
          i -= 3;
          if ( i > 0 ) {
              str = "," + str;
          }
          
      }
      
      return str;
  }

    // 結果を出力
    Ans0 = Factorial( N );
    Ans = CommaSeparate( Ans0 );
    result = `${ N }! = <br>${ Ans }`;

    document.getElementById( "result" ).innerHTML = result;
    return;
}