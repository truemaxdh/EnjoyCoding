	let o_mainChr;
	let balls = [];
	
	var stage=1;
	
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
	/*
		변수 설정
	*/
	var divideCnt=0;
	
	var ballImgs=[];
	ballImgs[0] = new Image();
	ballImgs[1] = new Image();

	ballImgs[0].src="magicBall.png";
	ballImgs[1].src="baloonBall.png";

	// Missile
	var missileX=-999;
	var missileY=-999;

	// Score
	var score=0;

	// Remained
	var remained=3;

	// Timer Handler
	var timer;

	// 일시정지 사유
	var stopMode="";


	/*
		함수
	*/
	// Initialize
	function initGame(){
		o_mainChr = new objMainChr();
		
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
		ballCnt=2;
		// ballSize[0]=10 * Math.ceil((stage + 1) / 2) + 20;
		// ballSize[1]=10 * Math.floor((stage + 1) / 2) + 20;
		// ballStyle[0]=0;	
		// ballStyle[1]=0;
		// x[0]=100;
		// incx[0]=-5;
		// y[0]=100;
		// incy[0]=5;
		// x[1]=100;
		// incx[1]=5;
		// y[1]=100;
		// incy[1]=5;
		balls = [
			new objMagicBall(100, 100, -5, 5, 10 * Math.ceil((stage + 1) / 2) + 20), 
			new objMagicBall(100, 100, 5, 5, 10 * Math.floor((stage + 1) / 2) + 20)
		];

		setTimeout(tick,500); 
	}

	let canFire = true;
	function proc_user_input() {
		if (user_pressing) {
			let dx = user_x - user_x_ori;
			let dy = user_y - user_y_ori;
			user_x_ori = user_x;
			user_y_ori = user_y;
	
			o_mainChr.x += dx;

			//o_jet.y += dy;
			
			// if (missile_interval >= stage_design.missile_interval) {
			// 	missile_interval -= stage_design.missile_interval;
			// 	let o_missile = new objMissile(o_jet.x, o_jet.y);
			// 	push_to_chain(o_missile, missile_ends);  
			// } 
			// missile_interval += frame.animation_interval;
			if (stopMode!="")
			{
				
			} else if (canFire)
			{
				canFire = false;
				missileX=o_mainChr.x+o_mainChr.img.width/2;
				missileY=o_mainChr.y;
			}
		} else {
			//missile_interval = stage_design.missile_interval;
			canFire = true;
		}
	}
	
	function addBall(ballID)
	{
		// if (ballSize[ballID]<25)
		const ball = balls[ballID];
		if (ball.ballSize < 25)
			return;

		score+=10;
		switch(ball.ballStyle) {
			case 0:	// general style
				playSound(1);

				ball.ballSize -=10;
			
				balls[ballCnt++] = new objMagicBall(
					ball.x, ball.y, -ball.step_x, ball.step_y, ball.ballSize, ball.ballStyle);
				// x[ballCnt]=x[ballID];
				// y[ballCnt]=y[ballID];
				// incx[ballCnt]=-incx[ballID];
				// incy[ballCnt]=incy[ballID];
				// ballStyle[ballCnt]=ballStyle[ballID];
				// ballSize[ballCnt]=ballSize[ballID];
				//ballCnt++;
				divideCnt++;
				if (divideCnt==60)
				{
					balls[ballCnt++] = new objMagicBall(
						ball.x, ball.y, 0, 2, 30, 2);

					// x[ballCnt]=x[ballID];
					// y[ballCnt]=y[ballID];
					// incx[ballCnt]=0;
					// incy[ballCnt]=2;
					// ballStyle[ballCnt]=2;
					// ballSize[ballCnt]=30;
					// ballCnt++;
					divideCnt=0;
				}
				else if ((divideCnt%5)==0)
				{
					balls[ballCnt++] = new objMagicBall(
						ball.x, ball.y, 0, 2, 30, 1);

					// x[ballCnt]=x[ballID];
					// y[ballCnt]=y[ballID];
					// incx[ballCnt]=0;
					// incy[ballCnt]=2;
					// ballStyle[ballCnt]=1;
					// ballSize[ballCnt]=30;
					// ballCnt++;
				}			
				break;
			case 1:	// balloon style
				ball.ballSize = 0;
				const cnt = ballCnt;
				for (let i=0; i < cnt; i++) {
					addBall(i);
				}
				break;
			case 2:	// tennis style
				playSound(3);
				ball.ballSize = 0;
				o_mainChr.powerShield+=200;	
				break;
		}
	}

	// Timer Tick
	function tick(){

		if (canv_game.getContext){
			proc_user_input();
			render();

			var ctx = canv_game.getContext('2d');
			
			// Draw Balls
			var eliminatedBall=0;
			for (var i=0;i<ballCnt;i++)
			{  
				const ball = balls[i];
				if (ball.ballSize<25)
					eliminatedBall++;
				else {
					ball.move();
					ball.render();
					//increases circle coordinates
					//x[i]+=incx[i];
					//y[i]+=incy[i];
					// //check limits to make bounce
					// if (x[i]>(w-ballSize[i]) && incx[i]>0){
					// 	x[i]=w-ballSize[i];
					// 	incx[i]=-incx[i];
					// 	playSound(2);
					// }
					// if(y[i]>(h-ballSize[i]) && incy[i]>0){
					// 	y[i]=h-ballSize[i];
					// 	incy[i]=-incy[i]; 
					// 	playSound(2);
					// }
					// if(x[i]<ballSize[i] && incx[i]<0){
					// 	incx[i]=-incx[i];
					// 	playSound(2);
					// }
					// if(y[i]<ballSize[i] && incy[i]<0){
					// 	incy[i]=-incy[i];
					// 	playSound(2);
					// }

					//draws circle
					// ctx.drawImage(ballImgs[ballStyle[i]], x[i],y[i],ballSize[i],ballSize[i]);	
					
					// Check Collision with Missile
					// if ((x[i]+ballSize[i])>(missileX-3) && x[i]<(missileX+3) && missileY<(y[i]+ballSize[i]))
					if ((ball.x + ball.ballSize) > (missileX-3) && ball.x < (missileX+3) && 
					    missileY < (ball.y + ball.ballSize))
					{
						missileX=-999;
						missileY=-999;
						addBall(i);
					}

					// Check Collision with Main Character
					if ((ball.x - o_mainChr.x) < (o_mainChr.img.width-5) && 
					    (o_mainChr.x - ball.x) < (ball.ballSize - 5) && 
						(o_mainChr.y-ball.y) < (ball.ballSize-5))
					{
						switch(ball.ballStyle) {
							case 0:
								if (o_mainChr.powerShield > 0)
									addBall(i);
								else {
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
										o_mainChr.x=0;
										sleep(500);
									}
								}
								break;
							case 1:
								addBall(i);
								break;
							case 2:
								addBall(i);
								break;
						}
					}						
				}
			}
			
			if (eliminatedBall==ballCnt)
			{
				//clearInterval(timer);
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
				//location.href="HighScore.html?user_score="+score;
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