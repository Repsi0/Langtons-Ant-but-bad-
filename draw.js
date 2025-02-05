function drawLine(x1,y1,x2,y2) {
	screenctx.moveTo(x1+0.5,y1+0.5);
	screenctx.lineTo(x2+0.5,y2+0.5);
}
function drawTextWithOutline(txt,x,y,maxWidth) {
	screenctx.fillText(txt,x+0.5, y+0.5, maxWidth);
}
function fillTriangle(x1, y1, x2, y2, x3, y3) {
	screenctx.beginPath();
	screenctx.moveTo(x1+0.5,y1+0.5);
	screenctx.lineTo(x2+0.5,y2+0.5);
	screenctx.lineTo(x3+0.5,y3+0.5);
	screenctx.closePath();
	screenctx.fill();
	screenctx.stroke();
}
function drawGrid(){
	screenctx.strokeStyle = "#222222";
	screenctx.lineWidth=2;
	screenctx.beginPath();
	for(let dimPos = 0; dimPos < screenctx.canvas.width + px; dimPos+=px)
		drawLine(dimPos+(xOff%px),0,dimPos+(xOff%px),screenctx.canvas.height);
	
	for(let dimPos = 0;dimPos < screenctx.canvas.height + px; dimPos+=px)
		drawLine(0,dimPos+(yOff%px),screenctx.canvas.width,dimPos+(yOff%px));
	
	screenctx.stroke();
}
function drawAlivePixel(x,y,t,d) {
	screenctx.save();
	screenctx.translate(x+xOff,y+yOff);
	screenctx.strokeStyle = "#000000";
	if(Math.abs(t)==1) {
		screenctx.fillStyle = "#ffffff";
	}
	screenctx.fillRect(0,0,px,px);
	if(t > 0) {
		screenctx.lineWidth = px/10;
		screenctx.strokeRect(0, 0,px,px);
		screenctx.fillStyle = "#000000";
		let arrowBodyTopLeftX = px/5;
		let arrowBodyTopLeftY = px/2 - px/20;
		switch(d) {
		case 1:
			screenctx.translate(px,0);	
			screenctx.rotate(Math.PI/2);
			break;
		case 2:
			screenctx.translate(px,px);
			screenctx.rotate(Math.PI);
			break;
		case 3:
			screenctx.translate(0,px);
			screenctx.rotate(3*Math.PI/2);
			break;
		}
		screenctx.fillRect(arrowBodyTopLeftX, arrowBodyTopLeftY, px * 3/5, px / 10);
		fillTriangle(px/2,px/4,px/2,px*3/4,px*4/5,px/2);
	}
	screenctx.restore();
}
function loop(){
	updateSidebar();
	screenctx.clearRect(0, 0, screenctx.canvas.width, screenctx.canvas.height);
	if(grid)
		drawGrid();
	
	if(pause && !lastpausestate)
		clearInterval(updateInterval);
	else if(!pause && lastpausestate)
		updateInterval = setInterval(update,1000/tps);
	lastpausestate=pause;
	
	if(zoom != oldZoom) {
		oldZoom = lerp(oldZoom,zoom,0.1);
		px = 20/oldZoom;
	}
	for(let i = 0; i != alive.length; i++){
		let x = (alive[i][0]*px), y = (alive[i][1]*px);
		let t = (alive[i][2]), d = (alive[i][3]);
		if(x >= -xOff-px && x <= screenctx.canvas.width - xOff && y >= -yOff-px && y <= screenctx.canvas.height - yOff) {
			drawAlivePixel(x,y,t,d);
		}
	}
	
	if(!panmode) 
		xOffTmp = xOff, yOffTmp = yOff, xTmp = x, yTmp = y;
	else
		xOff = xOffTmp - (xTmp - x), yOff = yOffTmp - (yTmp - y);
	screenctx.fillStyle = "#eeeeee";
	screenctx.globalAlpha = 0.3;
	screenctx.fillRect(x - ((x - xOff) % px), y - ((y - yOff) % px),px,px);
	screenctx.globalAlpha = 1.0;

	screenctx.fillStyle = "#111111";
	screenctx.globalAlpha = 0.3;
	screenctx.fillRect(screenctx.canvas.width-265,8,192,64);
	screenctx.globalAlpha = 1.0;
	
	screenctx.fillStyle = "#ffffff";
	screenctx.strokeStyle = "#000000";
	screenctx.lineWidth=1;
	screenctx.font = "24px Courier New";
	if(tps != 0) {
		drawTextWithOutline("TPS: " + tps,screenctx.canvas.width - 192, 26, 128);
		if(tpsAccurate / tps > 0.8)
			screenctx.fillStyle = "#00ff00";
		else if(tpsAccurate / tps > 0.4)
			screenctx.fillStyle = "#ffff00";
		else 
			screenctx.fillStyle = "#ff0000";
		drawTextWithOutline("(Actual: " + Math.floor(tpsAccurate * 10) / 10 + ")",screenctx.canvas.width - 256, 50, 192);
	} else {
		drawTextWithOutline("Unlimited",screenctx.canvas.width - 192, 26, 128);
		if(tpsAccurate >= 300)
			screenctx.fillStyle = "#00ff00";
		else if(tpsAccurate >= 50) 
			screenctx.fillStyle = "#ffff00";
		else 
			screenctx.fillStyle = "#ff0000";
		drawTextWithOutline("(Actual: " + Math.floor(tpsAccurate * 10) / 10 + ")",screenctx.canvas.width - 256, 50, 192);
	}
	screenctx.fillStyle = "#ffffff";
	if(!pause)
		fillTriangle(screenctx.canvas.width - 64, 10, screenctx.canvas.width-64, 74, screenctx.canvas.width-8, 42);
	else {
		screenctx.beginPath();
		screenctx.rect(screenctx.canvas.width - 32, 10, 24, 64);
		screenctx.rect(screenctx.canvas.width - 64, 10, 24, 64);
		screenctx.fill();
		screenctx.stroke();
	}
	
	screenctx.beginPath();
	screenctx.fillStyle = "#000000";
	screenctx.strokeStyle = "#ffffff";
	screenctx.lineWidth=2;
	screenctx.arc(x, y, 6, 0, 2 * Math.PI);
	screenctx.fill();
	screenctx.stroke();
	
	requestAnimationFrame(loop);
}