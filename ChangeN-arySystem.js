function Change() {
    const Num = parseFloat( document.getElementById( "inputNum" ).value );

    ansHTML = document.getElementById( "result" );

    ans = new Array( 37 );

    for ( k = 2 ; k <= 36 ; k ++ ) {
        if ( isNaN( Num ) ) {
            ans[ k ] = `<div class = "null" >数字を入力してね</div>`;
        }
        else {
            ans[ k ] = `${ Num.toString( k ).toUpperCase() }`;
        }
    }

    makeTable();
    return;

}

function makeTable() {
        
    // forループを使ってN行分のコンテンツを生成
    htmlContent = "<table id = 'output' ><tbody>";
    for ( k = 2; k <= 36; k ++) {
        htmlContent += `<tr><th class = "index">${ k }</th><td class = "result" >${ ans[ k ] }</td></tr>`; // 各行を<p>タグで囲む
    }
    htmlContent += "</tbody></table>";

    // 最後にまとめてHTML要素に挿入
    ansHTML.innerHTML = htmlContent;
    return;
}
