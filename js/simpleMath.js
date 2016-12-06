(function() {
	var backgroundMusic = new Audio('sound/background.mp3');
	backgroundMusic.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);

	if (! mobilecheck()) {
		backgroundMusic.play();
	} else {
		document.body.addEventListener('touchstart', function(e){
			backgroundMusic.play();
		}, false);
	}

	var successEffect = new Audio('sound/success.mp3');

	var contador = new ClockCounter();
	var contadorVigente = setInterval(() => {
		contador.startCronometer('contador_tempo');
	}, 1000);

	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		onEndAnimation = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( support.animations ) {
					if(ev.target != this) return;
					this.removeEventListener( animEndEventName, onEndCallbackFn);
				}
				if(callback && typeof callback === 'function') {callback.call();}
			};
			if( support.animations ) {
				el.addEventListener(animEndEventName, onEndCallbackFn);
			}
			else {
				onEndCallbackFn();
			}
		};

	function nextSibling(el) {
		var nextSibling = el.nextSibling;
		while(nextSibling && nextSibling.nodeType != 1) {
		nextSibling = nextSibling.nextSibling
		}
		return nextSibling;
	}

	respostas = {
		adicao: [],
		subtracao: [],
		multiplicacao: [],
		divisao: []
	}

	var minimoAcertos = 7;

	yuda = new Stack(document.getElementById('stack_yuda'), {
		infinite : false,
		onEndStack : () => {
			var acertos = respostas.adicao.reduce((a, b) => {return a + b; }, 0);
			if ( acertos >= minimoAcertos) {
				swal({
					title: "Parabéns!",
					text: `Você acertou ${acertos * 10}% das questões de adição!`,
					imageUrl: "img/medalhas/adicao.png",
					imageSize: "140x140"
				}, () => {
					successEffect.play();
					$('#medalhas').append('<img src="img/medalhas/adicao.png">');
					$('html,body').animate({scrollTop: $('#subtracao').offset().top}, 500);
					$('#adicao').animate({
						opacity: .3
					});
					$('#subtracao').animate({
						opacity: 1
					});
					permitirSubtracao();
					});
			} else {
				respostas.adicao = [];
				yuda.restart();
				swal("Desculpe!", `Você acertou somente ${acertos * 10}%. \n Necessário acertar mais de 70% para continuar.`, "error");
			}
		}
	}),
	krisna = new Stack(document.getElementById('stack_krisna'), {
		infinite : false,
		onEndStack : () => {
			var acertos = respostas.subtracao.reduce((a, b) => {return a + b; }, 0);
			if (acertos >= minimoAcertos) {
				swal({
				  title: "Parabéns!",
				  text: `Você acertou ${acertos * 10}% das questões de subtração!`,
				  imageUrl: "img/medalhas/subtracao.png",
				  imageSize: "140x140"
				}, () => {	
					successEffect.play();
					$('html,body').animate({scrollTop: $('#multiplicacao').offset().top}, 750);
					$('#medalhas').append('<img src="img/medalhas/subtracao.png">');
					$('#subtracao').animate({
						opacity: .3
					});
					$('#multiplicacao').animate({
						opacity: 1
					});
					permitirMultiplicacao();
				});
			} else {
				respostas.subtracao = [];
				krisna.restart();
				swal("Desculpe!", `Você acertou somente ${acertos * 10}%. \n Necessário acertar mais de 70% para continuar.`, "error");
			}

		}
	}),
	wangi = new Stack(document.getElementById('stack_wangi'), {
		infinite : false,
		onEndStack : () => {
			var acertos = respostas.multiplicacao.reduce((a, b) => {return a + b; }, 0);
			if (acertos >= minimoAcertos) {
				swal({
				  title: "Parabéns!",
				  text: `Você acertou ${acertos * 10}% das questões de multiplicação!`,
				  imageUrl: "img/medalhas/multiplicacao.png",
				  imageSize: "140x140"
				}, () => {
					successEffect.play();
					$('html,body').animate({scrollTop: $('#divisao').offset().top}, 750);
					$('#medalhas').append('<img src="img/medalhas/multiplicacao.png">');
					$('#multiplicacao').animate({
						opacity: .3
					});
					$('#divisao').animate({
						opacity: 1
					});
					permitirDivisao();
				});
			} else {
				respostas.multiplicacao = [];
				wangi.restart();
				swal("Desculpe!", `Você acertou somente ${acertos * 10}%. \n Necessário acertar mais de 70% para continuar.`, "error");
			}
		}
	}),
	wira = new Stack(document.getElementById('stack_wira'), {
		infinite : false,
		onEndStack : () => {
			var acertos = respostas.divisao.reduce((a, b) => {return a + b; }, 0);
			if (acertos >= minimoAcertos) {
				clearInterval(contadorVigente);
				swal({
					title: "Parabéns!",
					text: "Você concluiu com êxito todos os desafios. \n" + `Desafios concluídos em ${ contador.min > 0 ? `${contador.min} minutos e ` : '' } ${ contador.seg } segundos`,
					imageUrl: "img/medalhas/matematica.png",
					imageSize: "140x140"
				}, () => {
					successEffect.play();
					$('#divisao').animate({
						opacity: .3
					});
					$('#medalhas').append('<img src="img/medalhas/divisao.png">');
					$('#medalhas').append('<img id="matematica" src="img/medalhas/matematica.png">');
					$('html,body').animate({scrollTop: $('.container').offset().top}, 750);
				});
			} else {
				respostas.multiplicacao = [];
				wira.restart();
				swal("Desculpe!", `Você acertou somente ${acertos * 10}%. \n Necessário acertar mais de 70% para continuar.`, "error");
			}
		}
	});

	var allowNext = true;
	// controls the click ring effect on the button
	var buttonClickCallback = function(bttn) {
		var bttn = bttn || this;
		bttn.setAttribute('data-state', 'unlocked');
		console.log("proximo!");
		allowNext = true;
	};

	document.querySelector('.button--accept[data-stack = stack_yuda]').addEventListener(clickeventtype, function() { 
		if (allowNext) {
			respostas.adicao.push(validarResposta('.stack--yuda', 1));
			yuda.accept(buttonClickCallback.bind(this)); 
			allowNext = false;
		}
	});
	document.querySelector('.button--reject[data-stack = stack_yuda]').addEventListener(clickeventtype, function() { 
		if (allowNext) {
			respostas.adicao.push(validarResposta('.stack--yuda', 0));
			yuda.reject(buttonClickCallback.bind(this)); 
			allowNext = false;
		}
	});

	var permitirSubtracao = () => {
		document.querySelector('.button--accept[data-stack = stack_krisna]').addEventListener(clickeventtype, function() { 
			if (allowNext) {
				respostas.subtracao.push(validarResposta('.stack--krisna', 1));
				krisna.accept(buttonClickCallback.bind(this));
				allowNext = false;
			}
		});
		document.querySelector('.button--reject[data-stack = stack_krisna]').addEventListener(clickeventtype, function() { 
			if (allowNext) {
				respostas.subtracao.push(validarResposta('.stack--krisna', 0));
				krisna.reject(buttonClickCallback.bind(this));
				allowNext = false;
			}
		});
	};

	var permitirMultiplicacao = () => {
		document.querySelector('.button--accept[data-stack = stack_wangi]').addEventListener(clickeventtype, function() { 
			if (allowNext) {
				respostas.multiplicacao.push(validarResposta('.stack--wangi', 1));
				wangi.accept(buttonClickCallback.bind(this));
				allowNext = false;
			} 
		});
		document.querySelector('.button--reject[data-stack = stack_wangi]').addEventListener(clickeventtype, function() { 
			if (allowNext) {
				respostas.multiplicacao.push(validarResposta('.stack--wangi', 0));
				wangi.reject(buttonClickCallback.bind(this));
				allowNext = false;
			}
		});
	};

	var permitirDivisao = () => {
		document.querySelector('.button--accept[data-stack = stack_wira]').addEventListener(clickeventtype, function() { 
			if (allowNext) {
				respostas.divisao.push(validarResposta('.stack--wira', 1));
				wira.accept(buttonClickCallback.bind(this));
				allowNext = false;
			}
		});
		document.querySelector('.button--reject[data-stack = stack_wira]').addEventListener(clickeventtype, function() { 
			if (allowNext) {
				respostas.divisao.push(validarResposta('.stack--wira', 0));
				wira.reject(buttonClickCallback.bind(this));
				allowNext = false;
			}
		});
	};

	var validarResposta = (parent, resposta) => {
		var respostaUsuario = $(parent + ' li.stack__item.stack__item--current').data('correct-answer');
		return resposta == respostaUsuario ? 1 : 0
	}
})();