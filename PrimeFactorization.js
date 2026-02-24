function calculate() {

  // HTMLから数値入力値を取得し、数値型に変換
  const Info = document.getElementById("num");
  var num = parseInt(Info.value);

  // NaN（数値ではない）かどうかチェック
  if (isNaN(num)) {
    document.getElementById("result").textContent = "数値を入力してね";
    return;
  }
  
  num = Math.max( num , Info.min );
  num = Math.min( num , Info.max );


  // 計算を実行
  var n = num;

  function search( a ) {
    k = 0;
    while ( n % a == 0 ) {
      n /= a;
      k ++;
    }
    if ( k > 0 ) {
      Factor[ Factor.length ] = [ a, k ];
    }
  }

  // 実行部分
  Factor = new Array( 0 );

  search(2);
  search(3);
  for (i = 1; n > 1; i++) {
    search(6 * i - 1);
    search(6 * i + 1);
  }



  // 結果をHTMLに表示
  Line = "";
  if (num == 1) {
    Line = "1<br>";
  }
  else {
    for (i = 0; i < Factor.length; i++) {
      if (i == Factor.length - 1) {
        Line += `&nbsp;${Factor[i][0]} ^ ${Factor[i][1]}<br>`;
      }
      else {
        Line += `&nbsp;${Factor[i][0]} ^ ${Factor[i][1]}&nbsp;x<br>`
      }
    }
  }

  document.getElementById("result").innerHTML = `${num}  =<br>${Line}`;
  return;
}