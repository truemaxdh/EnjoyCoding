// Map
var blLeft=[];
var objPos=[];
var diaPos=[];
var scroll;
var roadWidth;

var ballCnt;
var ballSize=[];
var x=[];
var incx=[];
var y=[];
var incy=[];
var ballStyle=[];

function iStage(stage) {
	roadWidth=20-stage;
	var leftBlPos=(40-roadWidth)/2;
	var blMax=w/20-1;
	var objInterval=40-stage;
	var diaInterval=30-stage;
	var objIntervalCnt=0;
	var diaIntervalCnt=0;
	for (var i=0;i<1000;i++)
	{
		blLeft[i]=leftBlPos;
		if (objIntervalCnt++==objInterval)
		{
			objPos[i]=leftBlPos+Math.floor(Math.random()*roadWidth);
			objIntervalCnt=0;
		}
		else
			objPos[i]=-1;
		if (diaIntervalCnt++==diaInterval)
		{
			diaPos[i]=leftBlPos+Math.floor(Math.random()*roadWidth);
			diaIntervalCnt=0;
		}
		else
			diaPos[i]=-1;
		leftBlPos+=Math.floor(Math.random()*3)-1;
		if (leftBlPos<0)
			leftBlPos=0;
		if (leftBlPos>(blMax-roadWidth))
			leftBlPos=blMax-roadWidth;		
	}
	scroll=0.0;

	// Ball Control
	ballCnt=2;
	ballSize[0]=10 * Math.ceil((stage + 1) / 2) + 20;
	ballSize[1]=10 * Math.floor((stage + 1) / 2) + 20;
	ballStyle[0]=0;	
	ballStyle[1]=0;
	x[0]=100;
	incx[0]=-5;
	y[0]=100;
	incy[0]=5;
	x[1]=100;
	incx[1]=5;
	y[1]=100;
	incy[1]=5;
	
	//timer=setInterval(draw,20); 
}