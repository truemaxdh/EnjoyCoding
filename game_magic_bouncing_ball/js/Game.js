//window.addEventListener('load', function() {
	//		setTimeout(scrollTo, 0, 0, 1);
	//	}, false);

var canvas;
		var body;
		var w,h;
		var stage=1;
		var scale=1;
		
		function init() {
			canvas = document.getElementById('canvas');
			body=document.getElementById('body');
			w=canvas.width;
			h=canvas.height;
			scale_f = canvas.width / canvas.clientWidth;
			initGame();
		}
		
		/*

			변수 설정

		*/
		var divideCnt=0;

		// Main Character
		var mainChrX;
		var mainChrY;
		var mainChrIncX=0;

		var imageObj = new Image();

		var ballImgs=[];
		ballImgs[0] = new Image();
		ballImgs[1] = new Image();
		ballImgs[2] = new Image();

		ballImgs[0].src="magicBall.png";
		ballImgs[1].src="baloonBall.png";
		ballImgs[2].src="tennisBall.png";

		// Power Shield Timer
		var powerShield = 0;
		
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

		// 터치 이벤트 버퍼
		var touches=[];

		// 터치 이벤트 처리중인지 여부
		var touchProcessing=false;

		var scaledMainChrY;
		/*

			함수

		*/
		// Initialize
		function initGame(){
			
			imageObj.src="mainChr_tran.png";
			if (sessionStorage.carStyle=="1")
			{
				imageObj.src="mainChr_tran_purple.png";
			}
			else if (sessionStorage.carStyle=="2")
			{
				imageObj.src="mainChr_tran_red.png";
			}
			imageObj.onload = function() {
        mainChrX=w/2;
        mainChrY=h-imageObj.height;
        scaledMainChrY=scale*mainChrY;
			}
			
			
			
			body.addEventListener('keydown', ev_keydown, false);
			body.addEventListener('keyup', ev_keyup, false);	

			canvas.addEventListener('mousedown', ev_mousedown, false);
			canvas.addEventListener('mouseup', ev_mouseup, false);	
			canvas.addEventListener('mousemove', ev_mousemove, false);	

			//canvas.addEventListener('touchstart', leftright_touchstart, false);
			canvas.addEventListener('touchmove', leftright_touchmove, false);
			//canvas.addEventListener('touchend', leftright_touchend, false);

			var ctx = canvas.getContext('2d');

			//ctx.shadowColor = "rgb(100, 100, 100)";
			//ctx.shadowOffsetX = 10;
			//ctx.shadowOffsetY = 10;
			//ctx.shadowBlur = 10;

			//ctx.fillStyle ="rgba(200,30,10,1)";
			//ctx.strokeStyle="#000";

			// Draw Missile Button
			//ctx.beginPath(); 
			//ctx.arc(w+50,h-50,50,0,Math.PI*2,true);
			//ctx.fill(); 
			//ctx.closePath();

			initFontNLaserStyle();
			iStage(stage);
		}

		function initFontNLaserStyle() {
			var ctx = canvas.getContext('2d');

			// Laser
			var gradient = ctx.createLinearGradient(0, 0, 400, 400);
			gradient.addColorStop(0, "rgb(255, 0, 0)");
			gradient.addColorStop(1, "rgb(255, 255, 0)");
			ctx.fillStyle = gradient;

			// Font
			ctx.font = "bold 30px sans-serif";
			
			// Set power shield to 0
			powerShield=0;
		}

    // Mouse Events
    var user_x_ori, user_y_ori;
    var user_x, user_y;
    var user_pressing=false;
		
    var scale_f;
    function ev_mousedown(e) {
        user_x = e.layerX * scale_f;
        user_y = e.layerY * scale_f;
        
        user_pressing = true;
        return false;
    }
    
		function ev_mouseup(ev) {
			if (stopMode!="")
      {
        if (stopMode=="GameOver")
        {
          stopMode="";
          sleep(500);
          location.href="HighScore.html?user_score="+score;
        }
        else if (stopMode=="StageCleared")
        {
          stopMode="";
          sleep(500);
          stage++;
          initFontNLaserStyle();
          iStage(stage);
        }
      } else {
        missileX=mainChrX+imageObj.width/2;
				missileY=mainChrY;
        user_pressing = false;
        return false;
      }
		}
		
		function ev_mousemove(e) {
        if (user_pressing) {
          user_x = e.layerX * scale_f;
          user_y = e.layerY * scale_f;
        }
        return false;
    }

		// Keyboard Events
		var kbd_pressing=false;
		function ev_keydown(event){ // keyboard alerts
			switch (event.keyCode) {
				case 37: // <-
					/*if (mainChrIncX>0)
						mainChrIncX=0;
					else 
						mainChrIncX--;
					*/
					kbd_pressing=true;
					mainChrIncX=-6;
					break;
				case 39: // ->
					/*if (mainChrIncX<0)
						mainChrIncX=0;
					else 
						mainChrIncX++;
					*/
					kbd_pressing=true;
					mainChrIncX=6;
					break;
				case 32: // space
					missileX=mainChrX+imageObj.width/2;
					missileY=mainChrY;
					break;
			}
		}

		function ev_keyup(event){ // keyboard alerts
			switch (event.keyCode) {
				case 37: // <-
				case 39: // ->
					//mainChrIncX=0;
					kbd_pressing=false;
					break;
				case 32: // space
					if (stopMode!="")
					{
						if (stopMode=="GameOver")
						{
							stopMode="";
							sleep(500);
							location.href="HighScore.html?user_score="+score;
						}
						else if (stopMode=="StageCleared")
						{
							stopMode="";
							sleep(500);
							stage++;
							initFontNLaserStyle();
							iStage(stage);
						}
						
					}
					break;
			}
		}

		function leftright_touchmove(ev)
		{
			if (touchProcessing)
			{
				return;
			}
			if (stopMode=="")
			{
				ev.preventDefault();
				touches = ev.touches;
			} 
			else
			{			
				if (stopMode=="GameOver")
				{
					stopMode="";
					sleep(500);
					location.href="HighScore.html?user_score="+score;
				}
				else if (stopMode=="StageCleared")
				{
					stopMode="";
					sleep(500);
					stage++;
					initFontNLaserStyle();
					iStage(stage);
				}
				
			}
		}


		//function leftright_touchend(ev)
		//{
		//	mainChrIncX=0;
		//}

		//function leftright_touchstart(ev)
		//{
		//	if(touch.pageY > (h-80) && touch.pageX > w)
		//	{
		//		missileX=mainChrX;
		//		missileY=mainChrY;
		//	}
		//}

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
						powerShield+=200;	
						ballSize[ballID] = 0;				
					//}
					break;
			}
		}

		// Timer Tick
		function draw(){

			if (canvas.getContext){
				var ctx = canvas.getContext('2d');

				//clears canvas
				ctx.clearRect(0,0,w,h); 

				// Draw Score
				ctx.fillText("Stage: "+stage, 0, 30);
				ctx.fillText("Remained: "+remained, 260, 30);
				ctx.fillText("Score: "+score, 520, 30);

				// Draw mainCharacter
				if (user_pressing) {
          mainChrX += ((mainChrX + 6) < user_x) ? 6: 
                        ((mainChrX - 6) > user_x) ? -6: 
                          (user_x - mainChrX);
        }
				if (kbd_pressing) {
          mainChrX += ((mainChrX + 6) < user_x) ? 6: 
                        ((mainChrX - 6) > user_x) ? -6: 
                          (user_x - mainChrX);
          user_x += mainChrIncX;
        }
				
				if (mainChrX < 0)
					mainChrX = -mainChrX;
				if (mainChrX > (w - imageObj.width))
					mainChrX = 2 * (w - imageObj.width) - mainChrX;
				if (powerShield > 0) {
					powerShield--;
					ctx.drawImage(ballImgs[2],mainChrX, mainChrY,imageObj.width,imageObj.height);
				}
				ctx.drawImage(imageObj, mainChrX, mainChrY);
				
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
						//var d=(x[i]-mainChrX)*(x[i]-mainChrX)+(y[i]-mainChrY)*(y[i]-mainChrY);
						//if (d<(ballSize[i]*ballSize[i]))
						if ((x[i]-mainChrX)<(imageObj.width-5) && (mainChrX-x[i])<(ballSize[i]-5) && (mainChrY-y[i])<(ballSize[i]-5))
						{
							switch(ballStyle[i]) {
								case 0:
									if (powerShield > 0)
										addBall(i);
									else {
										remained--;
										if (remained<0)
										{
											// GameOver
											//clearInterval(timer);
											ctx.font = "bold 60px sans-serif";
											ctx.rotate(-0.40);
											ctx.fillText("Game Over!!", 110, 380);
											
											stopMode="GameOver";
											//canvas.addEventListener('mousedown', ev_mousedown, false);
										}
										else
										{
											//var dispRemained = document.getElementById('remained');
											//dispRemained.value=remained;
											mainChrX=0;
											//clearInterval(timer);
											sleep(500);
											//timer=setInterval(draw,20);
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
					//canvas.addEventListener('mousedown', ev_mousedown, false);
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
			while (new Date().getTime() < dt.getTime());
		}
    
    window.
