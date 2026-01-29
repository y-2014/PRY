const cvs = document.querySelector( "canvas" );
const ctx = cvs.getContext( "2d" );

// シーン　0 : 待機画面 , 1 :　ゲーム画面 , 2 : クリア画面 
// startFlag
// fps : 1秒におけるコマ数
// moveL , clearL : クリア距離
// textColor : 字幕の基本カラー
// time : 計測時間
// clashTime : 最後に衝突した時間
// clearTime , clashCount : クリアタイム、衝突回数

let scene = 0;
let startFlag = false;
let fps = 30;
let [ moveL , clearL , drawL ]= [ 0 , 5000 , 100 ];
let textColor = "hsl( 0deg , 0% , 8% )";

let time = 0;
let clashTime = 0;
let [ clearTime , clashCount ] = [ 0 , 0 ];

// 初期化
function init() {
    // キャンバスの基本設計
    ctx.setTransform( 1 , 0 , 0 , 1 , 0 , 0 );
    ctx.clearRect( 0 , 0 , cvs.width , cvs.height );
    ctx.lineWidth = 2;

    // プレイヤーのデフォルト位置
    [ px , py ] = [ spx , spy ];

    // 障害物のデフォルト設定
    bx = BaseBX.concat();
    cw = BaseCW.concat();
    ch = BaseCH.concat();
    bw = cw.map( ( a ) => Math.floor( a * maxL ) );
    bh = ch.map( ( a ) => Math.floor( a * maxH ) );

    // 移動距離、クリアタイム、衝突回数のデフォルト設定
    moveL = 0;
}

// 背景描画 
function drawBack() {
    ctx.fillStyle = "hsl( 0deg , 0% , 85% )";
    ctx.fillRect( moveL , 0 , moveL + cvs.width , cvs.height );
}

// 地面変数
let gy =  cvs.height * 0.85;

// 地面の描画
function drawGround() {
    ctx.fillStyle = "hsl( 0deg , 0% , 40% )";
    ctx.fillRect( moveL , gy , moveL + cvs.width , cvs.height );
}

// プレイヤー変数
// spx , spy , ps : プレイヤーの初期位置、サイズ
// px , py : 現在のx位置、y位置
// maxvy , basevx , ay  , ax : 最高落下速度、基本右向きS久土、加速度
// vx , vy: 右向き速度、下向き速度
// jumpReady , jumpFlag : ジャンプ待機状態、ジャンプ状態
// cbht , cBrk , cInv : 補正値
// intV : 無敵時間（フレーム）

// pCdt : プレイヤーの状態
let [ spx , spy , ps ] = [ 70 , gy * 0.8 , 20 ];
let [ px , py ] = [ spx , spy ];
let [ maxvy , basevx , ay , ax ] = [ 10 , 6 , 1.8 , 1 ];
let [ vx , vy ] = [ maxvy , basevx ];
let [ jumpReady , jumpFlag ] = [ false , false ];
let [ cbht , cBrk , cInv ] = [ 1.4 , 0.25 , 0.1 ];
let invT = 45;

let pCdt = "neutral"; 
let [ JPOK , JPNG ] = [ "hsl( 0deg , 0% , 90% )" ,  "hsl( 0deg , 0% , 5% )" ];
let [ Default , Boost , Brake ] 
    = [ "hsl( 0deg , 0% , 30% )" 
      , "hsl( 0deg , 0% , 10% )" 
      , "hsl( 0deg , 0% , 55% )" ];

// キーで操作する
window.addEventListener( "keydown" , event => {
    switch ( scene ) {
        case 0 : 
            if ( event.key == " " ) {
                startFlag = true;
            }
            break;
        case 1 :
            if ( pCdt != "invincible" ) {
                if ( jumpReady && ( event.key == " " ) ) {
                    event.preventDefault();
                    jumpReady = false;
                    jumpFlag = true;
                }

                if ( event.key == "ArrowLeft" ) {
                    pCdt = "brake";
                }
                else if ( event.key == "ArrowRight" ) {
                    pCdt = "boost";
                }
            }
            break;
        case 2 :
            if ( ( time >= 60 ) && ( event.key == " " ) ) {
                scene = 0;
                [ clashCount , clashTime , clearTime ] = [ 0 , 0 , 0 ];
            }
            break;
    }
} )

// 矢印キーを話すとニュートラルに戻る
window.addEventListener( "keyup" , ( event ) => {
    if ( ( pCdt != "invincible" ) && ( ( event.key == "ArrowLeft" ) || ( event.key == "ArrowRight" ) ) ) {
        pCdt = "neutral";
    }
} ) 

// 障害物ブロックの変数
// bx[ i ] , by[ i ]  : ブロックの位置
// maxbw , maxbh : ブロックの最大幅、最大高さ
// bw[ i ] , bh[ i ] : ブロックの幅、ブロックの高さ
// cw , ch : ブロックの補正値
// 距離の補正値
// 障害物の影

let NB = 4;
let BaseBX = [ 350 , 550 , 700 , 900 ];
let bx = BaseBX.concat();
let by = gy;

let [ maxH , maxL ]= [ maxvy * maxvy / ay , 2 * basevx * maxvy / ay ];

let BaseCW = [ 0.50 , 0.75 , 0.40 , 0.7 ];
let BaseCH = [ 0.50 , 0.50 , 0.85 , 0.7 ];
let cw = BaseCW.concat();
let ch = BaseCH.concat();
let bw = cw.map( ( a ) => Math.floor( a * maxL ) );
let bh = ch.map( ( a ) => Math.floor( a * maxH )  );
let [ MaxCW , MinCW , MaxCH , MinCH ] = [ 0.85 , 0.4 , 0.9 , 0.3 ];
let [ MaxCL , MinCL ] = [ 1.8 , 0.1 ];

let shadowGap = 5;
let shadowColor = "hsl( 0deg , 0% , 60% )";

// 障害物の描画
function drawBlock() {

    for (let i = 0 ; i < bx.length ; i ++) {
        ctx.fillStyle = shadowColor;
        ctx.fillRect( bx[i] - bw[ i ] / 2 + shadowGap , by - bh[ i ] - shadowGap , bw[ i ] , bh[ i ] * 2 );
        
        ctx.strokeStyle = "hsl( 0deg , 0% , 0% )";
        ctx.strokeRect( bx[i] - bw[ i ] / 2 , by - bh[ i ] , bw[ i ] , bh[ i ] );
        
        ctx.fillStyle = "hsl( 0deg , 0% , 70% )";
        ctx.fillRect( bx[i] - bw[ i ] / 2 , by - bh[ i ] , bw[ i ] , bh[ i ] );    
    }
    
}

// 補正係数
function CR( max , min ) {
    return ( max - min ) *　Math.random() + min;
}

// 障害物の更新
function updateBlock () {
    for (let i = 0 ; i < bx.length ; i ++) {
        if ( bx[ i ] + bw[ i ] / 2 < moveL ) {
            makeNewBlock( i );
        }
    }
}

// 新しいブロックを生成する
function makeNewBlock( i ) {
    maxR = bx.indexOf( Math.max( ...bx ) );
    
    nextX = Math.max(
        Math.floor( moveL + cvs.width + maxL * CR( MaxCL , MinCL ) ),
        Math.floor( bx[ maxR ] + bw[ maxR ] / 2 + maxL * CR( 2.2 , 1.5 ) )
    );
    
    if ( nextX + bw[ i ] < clearL ) {
        bx[ i ] = nextX;
        cw[ i ] = CR( MaxCW , MinCW ).toFixed( 2 );
        ch[ i ] = CR( MaxCH , MinCH ).toFixed( 2 );
    }
    else {
        [ bx[ i ] , cw[ i ] , ch[ i ] ] = [ 0 , 0 , 0 ];
    }
    [ bw[ i ] , bh[ i ] ] 
        = [ Math.floor( cw[ i ] * maxL ) , Math.floor( ch[ i ] * maxH ) ];
}

// プレイヤー描画
function drawPlayer() {
    ctx.lineWidth = 3;
    
    // 無敵時間の時、点滅する。4回
    if ( pCdt == "invincible" ) {
        if ( ( time - clashTime ) % 7 < 5 ) {
            ctx.globalAlpha = 0.45;
            ctx.strokeStyle = JPOK;
            ctx.strokeRect( px - ps / 2 , py - ps / 2 , ps , ps );
            ctx.fillStyle = Brake;
            ctx.fillRect( px - ps / 2 , py - ps / 2 , ps , ps );
            ctx.globalAlpha = 1;
        }    
    }

    else {
        // 枠線：ジャンプ可能か
        if ( jumpReady ) {
            ctx.strokeStyle = JPOK;
        }
        else {
            ctx.strokeStyle = JPNG;
        }
        ctx.strokeRect( px - ps / 2 , py - ps / 2 , ps , ps );

        // プレイヤーの色：加速、減速
        switch ( pCdt ) {
            case "boost" :
                ctx.fillStyle = Boost; 
                break;
            case "brake" :
                ctx.fillStyle = Brake; 
                break;
            default :
                ctx.fillStyle = Default; 
                break;
        }
        ctx.fillRect( px - ps / 2 , py - ps / 2 , ps , ps );
    }

   
}

// プレイヤーの更新
function updatePlayer() {
    // ジャンプ処理
    if ( jumpFlag ) {
        jumpFlag = false;
        vy = -20;
    }

    // スピード処理
    switch ( pCdt ) {
        case "boost" :
            vx = Math.min( vx + ax , basevx * cbht );
            break;
        case "brake" :
            vx = Math.max( vx - ax , basevx * cBrk );
            break;
        case "invincible" :
            if ( time - clashTime < invT ) {
                vx = Math.max( vx - 2 * ax , basevx * cInv );
            }
            else {
                pCdt = "default";
            }
            break;
        default :
            if ( vx > basevx ) {
                vx = Math.max( vx - ax , basevx );
            }
            else {
                vx = Math.min( vx + ax , basevx );
            }
            break;
    }

    // 落下処理
    vy = Math.min( vy + ay , maxvy );

    // 衝突判定
    if ( pCdt != "invincible" ) {
        for (let i = 0 ; i < NB ; i ++) {
            let dx1 = ps / 2 + bw[ i ] / 2;
            let dx2 = Math.abs( px - bx[i] );

            let dy1 = ps / 2 + bh[ i ];
            let dy2 = Math.abs( py - by );

            if ( ( dx1 > dx2 ) && ( dy1 > dy2 ) ) {
                pCdt = "invincible";
                clashCount ++;
                clashTime = time;
                makeNewBlock( i );
                vy /= 3;
            }
        }
    }

    // プレイヤーの位置と状態の更新
    moveL += vx;
    px += vx;
    py = Math.min( py + vy , gy - ps / 2 );
    if ( py == gy - ps / 2 ) {
        jumpReady = true;    
    }
    else {
        jumpReady = false;
    }

    // クリア処理
    if ( moveL >= clearL ) {
        clearTime = time;
        [ scene , time , startFlag ] = [ 2 , 0 , false ];
    }
}

// スタート画面
function drawStartText() {
    ctx.fillStyle = textColor;
    ctx.font = "48px monospace";
    ctx.fillText( "RunningGame01" , cvs.width / 5 , cvs.height / 1.9 );

    ctx.font = "16px monospace";
    ctx.fillText( "[Space] to Jump , [→] to Boost , [←] to Brake" , cvs.width / 9 , cvs.height / 1.45 );

    ctx.font = "24px monospace";
    ctx.fillText( "[Space] to start" , cvs.width / 3.2 , cvs.height / 1.2 );
}
              
// スコア表示
function drawScore () {
    ctx.fillStyle = textColor;
    ctx.font = "16px monospace";
    ctx.fillText( `Move Distance: ${ ( drawL * moveL / clearL ).toFixed( 2 ) }` , 10 + moveL , 20);
    
    // デバッグ用
}

// キャンバス視点移動
function moveCanvas() {
    ctx.clearRect( moveL , 0 , cvs.width + moveL , cvs.height );
    ctx.translate( -vx , 0 );
}

// クリアライン
function drawClearLine() {
    ctx.beginPath();
    ctx.moveTo( clearL + spx , 0 );
    ctx.lineTo( clearL + spx , cvs.height );

    ctx.strokeStyle = "hsl( 0deg , 100% , 100% )";
    ctx.lineWidth = 2;

    ctx.stroke();
}

// エンドテキスト
function drawEndText() {
    ctx.fillStyle = textColor;
    ctx.font = "40px monospace";
    ctx.fillText( "Clear!!" , cvs.width / 3 , cvs.height / 1.8 );
    
    ctx.font = "17px monospace";
    ctx.fillText( `Clear Time : ${ clearTime }`, cvs.width / 3 , cvs.height / 1.6 + 20 );
    ctx.fillText( `Clash Count: ${ clashCount }` , cvs.width / 3 , cvs.height / 1.4 + 15 );
    if ( time >= 60 ) {
        ctx.font = "20px monospace";
        ctx.fillText( "[Space] to Title" , cvs.width / 3.2 , cvs.height / 1.2 + 28 );
    }
}

// デバッグ用
function drawDebug() {
    ctx.font = "16px monospace";
    DBG = new Array( 0 );
    // DBG.push( `point: ${ px.toFixed( 1 ) } , ${ py.toFixed( 1 ) }` );
    // DBG.push( `time: ${ time }` );
    // DBG.push( `scene: ${ scene }` );
    // DBG.push( `Clash Count: ${ clashCount }, ClashTime: ${ clashTime } ` );
    // DBG.push( `Cdt: ${ pCdt }` );
    DBG.push( `BX: ${ bx }` );
    DBG.push( `BW: ${ bw }` );
    DBG.push( `BH: ${ bh }` );

    for ( i = 0 ; i < DBG.length ; i ++ ) {
        ctx.fillText( DBG[ i ] , 10 + moveL , ( i + 2 ) * 20 );
    }
    
}

function update() {
    switch ( scene ) {
        case 0 :
            if ( startFlag ) {
                init();
                time = 0;
                scene = 1;
            } 
            break;
        case 1 :
            updateBlock();
            updatePlayer();
            break;
        case 2 :
            init();
            break;
    }

    time = Math.min( time + 1 , 99999 );

}

function draw() {
    switch ( scene ) {
        
        case 0 :
            drawBack();
            drawStartText();
            break;
        case 1 : 
            moveCanvas();
            drawBack();
            drawBlock();
            drawPlayer();
            drawGround();
            drawClearLine();
            drawScore();
            break;
        case 2 :
            drawBack();
            drawEndText();
            break;    
        }

    // drawDebug();
}

function main() {
    update();
    draw();

    // mainをフレームごとに更新し続ける
    setTimeout( main , 1000 / fps );

}

init();
main();