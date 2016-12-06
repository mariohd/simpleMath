function ClockCounter() {
	this.timeCrono = '';
	this.hor = 0;
	this.min = 0;
	this.seg = 0;
	this.startTime = new Date();
	this.start = this.startTime.getSeconds();
	this.running = true;
};

ClockCounter.prototype.startCronometer = function (element) {
	if (this.seg + 1 > 59) {
		this.min+= 1 ;
	}
	if (this.min > 59) {
		this.min = 0;
		this.hor+= 1;
	}
	var time = new Date();
	if (time.getSeconds() >= this.start) {
		this.seg = time.getSeconds() - this.start;
	}
	else {
		this.seg = 60 + (time.getSeconds() - this.start);
	}
	this.timeCrono= ((this.min < 10) ? "0" : ":") + this.min;
	this.timeCrono+= ((this.seg < 10) ? ":0" : ":") + this.seg;
	document.getElementById(element).innerText = this.timeCrono;
};