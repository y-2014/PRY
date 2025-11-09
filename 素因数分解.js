    function calculate() {
      // HTMLから数値入力値を取得し、数値型に変換
      const num = parseFloat(document.getElementById("num").value);
      
      // NaN（数値ではない）かどうかチェック
      if ( isNaN( num ) ) {
        document.getElementById("result").textContent = "数値を入力してね";
        return;
      }
      if ( ( num <= 0 ) || ( !Number.isInteger( num ) ) ) {
        document.getElementById("result").textContent = "正の整数を入れてね";
        return;
      }
      if ( num > 50000000 ) {
        document.getElementById("result").textContent = "数値が大きすぎるよ（上限：50,000,000）";
        return;
      }
      

      // 計算を実行
      
      // 素数列Pを作成
      P = new Array( num + 1 );
      for ( i = 0 ; i <= num ; i ++ ) {
        P[ i ] = true;
      }

      // エラトステネスの篩
      function search( P , a ) {
        if ( P[ a ] ) {
            for ( k = a ; k * a <= num ; k ++ ) {
                P[ k * a ] = false;
            }
        }
      }
      P[ 0 ] = false;
      P[ 1 ] = false;

      search( P , 2 );
      search( P , 3 );
      for ( i = 1 ; 6 * i + 1 <= num ; i ++ ) {
        search( P , 6 * i - 1 );
        search( P , 6 * i + 1 );
      }
      
      // 素数で割っていく
      ans = [];
      n = num;
      a = 2;
      while ( n > 1 ) {
        k = 0;
        while ( ( P[ a ] ) && ( n % a == 0 ) ) {
            k += 1;
            n /= a;
        }        
        if ( k > 0 ) {
            ans.push( [ a , k ] );
        }

        a += 1;
      }

      // 結果をHTMLに表示
      Line = "";
      if ( num == 1 ) {
        Line = "1";
      }
      else {
        for ( i = 0 ; i < ans.length ; i ++ ) {
          Line += `${ ans[ i ][ 0 ] } ^ ${ ans[ i ][ 1 ] } × `
        }
        Line = Line.slice( 0 , -3 );
      }
      
      document.getElementById("result").textContent = `${ num }  = ` + Line;
    }