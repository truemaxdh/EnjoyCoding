	let canv_game;
	let o_mainChr;
	
	var w,h;
	var stage=1;
	
	function init() {
		canv_game = document.getElementById('game_canvas_landscape');
				
		w=canv_game.width;
		h=canv_game.height;
		
		init_user_input();
		initGame();
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
		iStage(stage);
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
				if (stopMode=="GameOver")
				{
					stopMode="";
					sleep(500);
					//location.href="HighScore.html?user_score="+score;
				}
				else if (stopMode=="StageCleared")
				{
					stopMode="";
					sleep(500);
					stage++;
					initFontNLaserStyle();
					iStage(stage);
				}
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
		if (ballSize[ballID]<25)
			return;
		score+=10;
		switch(ballStyle[ballID]) {
			case 0:	// general style
				playSound(1);
				ballSize[ballID]-=10;
			
				x[ballCnt]=x[ballID];
				y[ballCnt]=y[ballID];
				incx[ballCnt]=-incx[ballID];
				incy[ballCnt]=incy[ballID];
				ballStyle[ballCnt]=ballStyle[ballID];
				ballSize[ballCnt]=ballSize[ballID];
				ballCnt++;
				divideCnt++;
				if (divideCnt==60)
				{
					x[ballCnt]=x[ballID];
					y[ballCnt]=y[ballID];
					incx[ballCnt]=0;
					incy[ballCnt]=2;
					ballStyle[ballCnt]=2;
					ballSize[ballCnt]=30;
					ballCnt++;
					divideCnt=0;
				}
				else if ((divideCnt%5)==0)
				{
					x[ballCnt]=x[ballID];
					y[ballCnt]=y[ballID];
					incx[ballCnt]=0;
					incy[ballCnt]=2;
					ballStyle[ballCnt]=1;
					ballSize[ballCnt]=30;
					ballCnt++;
				} 
			
				break;
			case 1:	// balloon style
				//if (ballSize[ballID]>25)
				//{
					ballSize[ballID] = 0;
					var cnt = ballCnt;
					for (var i=0; i < cnt; i++) {
						addBall(i);
					}
				//}
				
				break;
			case 2:	// tennis style
				//if (ballSize[ballID]>25)
				//{
					playSound(3);
					o_mainChr.powerShield+=200;	
					ballSize[ballID] = 0;				
				//}
				break;
		}
	}

	// Timer Tick
	function draw(){

		if (canv_game.getContext){
			proc_user_input();
			var ctx = canv_game.getContext('2d');

			//clears canvas
			ctx.clearRect(0,0,w,h); 

			// Draw Score
			ctx.fillText("Stage: "+stage, 0, 30);
			ctx.fillText("Remained: "+remained, 260, 30);
			ctx.fillText("Score: "+score, 520, 30);
			
			o_mainChr.render(ctx);

			// Draw Missile
			if (missileX >= 0)
			{
				missileY-=20;
				if (missileY>=0)
				{
					ctx.beginPath();
					ctx.rect(missileX-3, missileY, 6, h-missileY);
					ctx.closePath();
					ctx.stroke();
					ctx.fill();
				}
				else
					missileX=-999;
			}

			// Draw Balls
			var eliminatedBall=0;
			for (var i=0;i<ballCnt;i++)
			{  

				if (ballSize[i]<25)
					eliminatedBall++;
				else {
					//increases circle coordinates
					x[i]+=incx[i];
					y[i]+=incy[i];

					//check limits to make bounce
					if (x[i]>(w-ballSize[i]) && incx[i]>0){
						x[i]=w-ballSize[i];
						incx[i]=-incx[i];
						playSound(2);
					}
					if(y[i]>(h-ballSize[i]) && incy[i]>0){
						y[i]=h-ballSize[i];
						incy[i]=-incy[i]; 
						playSound(2);
					}
					if(x[i]<ballSize[i] && incx[i]<0){
						incx[i]=-incx[i];
						playSound(2);
					}
					if(y[i]<ballSize[i] && incy[i]<0){
						incy[i]=-incy[i];
						playSound(2);
					}

					//draws circle
					ctx.drawImage(ballImgs[ballStyle[i]], x[i],y[i],ballSize[i],ballSize[i]);	
					
					// Check Collision with Missile
					if ((x[i]+ballSize[i])>(missileX-3) && x[i]<(missileX+3) && missileY<(y[i]+ballSize[i]))
					{
						missileX=-999;
						missileY=-999;
						addBall(i);
					}

					// Check Collision with Main Character
					if ((x[i]-o_mainChr.x)<(o_mainChr.img.width-5) && 
						(o_mainChr.x-x[i])<(ballSize[i]-5) && (o_mainChr.y-y[i])<(ballSize[i]-5))
					{
						switch(ballStyle[i]) {
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
	  			requestAnimationFrame(draw);
			}
		}
	}

	function sleep(ms)
	{
		var dt = new Date();
		dt.setTime(dt.getTime() + ms);
		while (new Date().getTime() < dt.getTime()) {}
	}