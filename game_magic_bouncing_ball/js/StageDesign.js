// Ball Control
var ballCnt;
var ballSize=[];
var x=[];
var incx=[];
var y=[];
var incy=[];
var ballStyle=[];

function iStage(stage) {
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
	setTimeout(draw,500); 
}