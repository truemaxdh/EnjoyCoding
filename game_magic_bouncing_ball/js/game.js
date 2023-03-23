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
	var ctx = canv_game.getContext('2d');

	// Laser
	var gradient = ctx.createLinearGradient(0, 0, 400, 400);
	gradient.addColorStop(0, "rgb(255, 0, 0)");
	gradient.addColorStop(1, "rgb(255, 255, 0)");
	ctx.fillStyle = gradient;

	// Font
	ctx.font = "bold 30px sans-serif";
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
	if (canv_game.getContext){
		proc_user_input();
		render();

		const ctx = canv_game.getContext('2d');
		
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
				if ((ball.x - oMainChr.x) < (oMainChr.img.width-5) && 
					(oMainChr.x - ball.x) < (ball.ballSize - 5) && 
					(oMainChr.y-ball.y) < (ball.ballSize-5))
				{
					if (ball.ballStyle == 0 && oMainChr.powerShield <= 0) {
						remained--;
						if (remained<0)
						{
							// GameOver
							document.getElementById( 'bgm' ).pause();
							ctx.font = "bold 60px sans-serif";
							ctx.rotate(-0.40);
							ctx.fillText("Game Over!!", 110, 380);
							
							stopMode="GameOver";
						}
						else
						{
							oMainChr.x=0;
							sleep(500);
						}
					} else {
						bonusBalls.push(ball);
					}
				}
			}
			bonusBalls.forEach((ball)=>{
				switch(ball.ballStyle) {
					case 0:	// general style
						score+=10;
						ball.ballSize -=10;
						if (ball.ballSize > 25)
							addBall(ball);
						break;
					case 1:	// balloon style
						for(let i = 0; i < balls.length; i++) {
							const ball1 = balls[i];
							if (ball1.ballStyle == 0) {
								ball1.ballSize -=10;
								ball1.splice(i, 1);
								if (ball1.ballSize > 25)
									addBall(ball1);
							}
						}
						break;
					case 2:	// tennis style
						oMainChr.powerShield+=200;	
						break;
				}
			})
		} else 		
		{
			ctx.font = "bold 60px sans-serif";
			ctx.rotate(-0.35);
			ctx.fillText("Stage Cleared!!", 90, 380);
			ctx.rotate(0.35);		
			stopMode="StageCleared";
		}
		
		if (stopMode=="") {
			requestAnimationFrame(tick);
		} else if (stopMode=="GameOver")
		{
			sleep(1500);
			stopMode="";
			pageChange('menu');
		}
		else if (stopMode=="StageCleared")
		{
			sleep(500);
			stopMode="";
			initFontNLaserStyle();
			stage++;
			newStage(stage);
		}
	}
}

function sleep(ms)
{
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime()) {}
}