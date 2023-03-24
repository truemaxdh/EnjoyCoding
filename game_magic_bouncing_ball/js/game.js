/*
	변수 설정
*/
let divideCnt=0;

// Score
var score=0;

// Remained
var remained=3;

// Timer Handler
var timer;

// 일시정지 사유
var stopMode="";

let balls = [];
	
var stage=1;

let oMainChr;
let oMissile;

/*
	함수
*/

function init() {
	render_init();
	
	if (!chkLandscapeMode()) {
		alert("Please turn mobile to be landscape mode");
		pageChange('menu');
		return;
	}
	setToFullscreen();
	
	init_user_input();
	initGame();
}

function chkLandscapeMode() {
	return (window.innerWidth > window.innerHeight);
}

function setToFullscreen() {
	let container = canv_game.parentElement;
	if (canv_game.requestFullscreen) {
		container.requestFullscreen();
		} else if (canv_game.webkitRequestFullscreen) { /* Safari */
		container.webkitRequestFullscreen();
		} else if (canv_game.msRequestFullscreen) { /* IE11 */
		canv_game.msRequestFullscreen();
		}
}

// Initialize
function initGame(){
	oMainChr = new objMainChr();
	oMissile = new objMissile();
	
	initFontNLaserStyle();
	document.getElementById( 'bgm' ).play();
	newStage(stage);
}

function initFontNLaserStyle() {
	// Laser
	let grd=ctx_game.createLinearGradient(0, 0, ctx_game.canvas.width,0);
        grd.addColorStop("0","magenta");
        grd.addColorStop("0.5","blue");
        grd.addColorStop("1.0","red");
	ctx_game.fillStyle = grd;

	// Font
	ctx_game.font = "bold 30px sans-serif";
}

function newStage(stage) {
	// Ball Control
	balls = [
		new objMagicBall(100, 100, -3, 0, 10 * Math.ceil((stage + 1) / 2) + 20), 
		new objMagicBall(100, 100, 3, 0, 10 * Math.floor((stage + 1) / 2) + 20)
	];

	setTimeout(tick,500); 
}

function proc_user_input() {
	if (user_pressing) {
		let dx = user_x - user_x_ori;
		let dy = user_y - user_y_ori;
		user_x_ori = user_x;
		user_y_ori = user_y;

		oMainChr.x += dx;

		if (stopMode == "" && oMissile.canFire)
		{
			oMissile.fire();
		}
	}
}

function addBall(ball)
{
	playSound(1);
	balls.push(new objMagicBall(
		ball.x, ball.y, ball.step_x, ball.step_y, ball.ballSize));
	balls.push(new objMagicBall(
		ball.x, ball.y, -ball.step_x, ball.step_y, ball.ballSize));
	divideCnt++;
	if (divideCnt==60)
	{
		balls.push(new objMagicBall(
			ball.x, ball.y, 0, 2, 30, 2));
		divideCnt=0;
	}
	else if ((divideCnt%5)==0)
	{
		balls.push(new objMagicBall(
			ball.x, ball.y, 0, 2, 30, 1));
	}
}

// Timer Tick
function tick(){
	
	proc_user_input();
	render();

	if (stopMode != "") {
		//ctx.rotate(-0.40);
		ctx_game.fillText(stopMode, 450 - 15 * stopMode.length, 380);
		//ctx.rotate(0.40);
		sleep(1000);
		
		const lastStopMode = stopMode;
		stopMode="";
		
		if (lastStopMode=="Game Over")
		{
			document.getElementById( 'bgm' ).pause();
			pageChange('menu');
			//document.location.reload();
			return;
		}
		else if (lastStopMode=="Stage Clear")
		{
			//initFontNLaserStyle();
			newStage(++stage);
			return;
		}
	}
	
	
	// Draw Balls
	if (balls.length > 0) {
		let bonusBalls = [];
		for (let i=0;i<balls.length;i++)
		{  
			const ball = balls[i];
		
			ball.move();
			ball.render();

			if ((ball.x + ball.ballSize) > (oMissile.x-oMissile.r) && ball.x < (oMissile.x+oMissile.r) && 
				(ball.y + ball.ballSize) > (oMissile.y-oMissile.r) && ball.y < (oMissile.y+oMissile.r))
			{
				oMissile.x = -999;
				oMissile.y = -999;
				oMissile.canFire = true;
				balls.splice(i--, 1);
				bonusBalls.push(ball);
				continue;
			}

			// Check Collision with Main Character
			if ((ball.x - oMainChr.x) < (oMainChr.w-5) && 
				(oMainChr.x - ball.x) < (ball.ballSize - 5) && 
				(oMainChr.y-ball.y) < (ball.ballSize-5))
			{
				balls.splice(i--, 1);
				if (ball.ballStyle == 0 && oMainChr.powerShield <= 0) {
					remained--;
					if (remained<0)
					{
						// Game Over
						stopMode="GameOver";
					}
					else
					{
						oMainChr.x=0;
						stopMode="Crashed";
					}
				} else {						
					bonusBalls.push(ball);
				}
			}
		}
		bonusBalls.forEach((ball)=>{
			switch(ball.ballStyle) {
				case 0:	// ball
					score+=10;
					ball.ballSize -=10;
					if (ball.ballSize > 25)
						addBall(ball);
					break;
				case 1:	// bonus(bomb)
					let oriCnt = balls.length;
					for(let i = 0; i < oriCnt; i++) {
						const ball1 = balls[0];
						balls.splice(0, 1);
						if (ball1.ballStyle == 0) {
							ball1.ballSize -=10;								
							if (ball1.ballSize > 25)
								addBall(ball1);
						}
					}
					break;
				case 2:	// shield
					oMainChr.powerShield+=200;	
					break;
			}
		})
	} else 		
	{
		stopMode="Stage Clear";
	}
	
	requestAnimationFrame(tick);
}

function sleep(ms)
{
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime()) {}
}
