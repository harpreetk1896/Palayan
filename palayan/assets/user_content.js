"use strict";

function setup_alt_click(){
	document.getElementById('alt-usr-in').addEventListener('click', function(evt){
		document.getElementById('usr-in').click();
		evt.preventDefault();
	});

	document.getElementById('alt-usr-up').addEventListener('click', function(evt){
		document.getElementById('usr-up').click();
		evt.preventDefault();
	});
}

function setup_wordcount(form){
	var out = form.querySelector('#word-counter');
	var txta = form.querySelector('textarea');
	var minw = parseInt(txta.getAttribute('min-words'), 10);

	var update = function(evt){
		var str = evt.target.value.trim();
		var cnt = str.length;
		if (cnt){
			cnt = str.replace(/\s+/g, ' ').split(' ').length;
		}
		if (cnt < minw){
			out.style.color = '#e00';
			out.style.fontWeight = 'bold';
		}
		else{
			out.style.color = '';
			out.style.fontWeight = '';
		}
		evt.target.setAttribute('word-count', cnt);
		out.textContent = cnt;
	};

	txta.addEventListener('change', update);
	txta.addEventListener('keyup', update);
	txta.addEventListener('paste', update);
}

function setup_ratings(form){
	var i, is_touch = ('ontouchstart' in window);

	var stars = form.querySelectorAll('.star-rating li');
	for (i=0; i<stars.length; i++){
		(function(i){
			stars[i].addEventListener('click', function(evt){
				var pn = evt.target.parentNode;
				var off = 2*i+1;
				if (evt.layerX >= evt.target.offsetWidth/2){
					off += 1;
				}
				pn.setAttribute('data-score', off);
				evt.currentTarget.parentNode.nextElementSibling.value = off;
			});

			if (!is_touch){
				stars[i].addEventListener('mousemove', function(evt){
					var pn = evt.target.parentNode;
					var off = 2*i+1;
					if (evt.layerX >= evt.target.offsetWidth/2){
						off += 1;
					}
					pn.setAttribute('data-score', off);
				});
			}
		})(i);
	}

	if (!is_touch){
		stars[0].parentNode.addEventListener('mouseleave', function(evt){
			var off = evt.currentTarget.nextElementSibling.value;
			evt.currentTarget.setAttribute('data-score', off);
		});
	}

	stars[0].parentNode.addEventListener('dblclick', function(evt){
		evt.currentTarget.nextElementSibling.value = 0;
		evt.currentTarget.setAttribute('data-score', 0);
	});

	var bars = form.querySelectorAll('.horz-rating');
	for (i=0; i<bars.length; i++){
		(function(i){
			bars[i].addEventListener('click', function(evt){
				var bar = evt.currentTarget.children[2];
				var pct = Math.ceil(evt.layerX/evt.currentTarget.offsetWidth*10);
				bar.children[0].style.width = (pct*10)+'%';
				bars[i].nextElementSibling.value = pct;
				evt.currentTarget.children[1].textContent = pct+'/10';
			});

			bars[i].addEventListener('dblclick', function(evt){
				var bar = evt.currentTarget.children[2];
				bar.children[0].style.width = '0%';
				bars[i].nextElementSibling.value = 0;
				evt.currentTarget.children[1].textContent = '0/10';
			});

			if (!is_touch){
				bars[i].addEventListener('mousemove', function(evt){
					var bar = evt.currentTarget.children[2];
					var pct = Math.ceil(evt.layerX/evt.currentTarget.offsetWidth*10);
					bar.children[0].style.width = (pct*10)+'%';
					evt.currentTarget.children[1].textContent = pct+'/10';
				});

				bars[i].addEventListener('mouseleave', function(evt){
					var bar = evt.currentTarget.children[2];
					bar.children[0].style.width = bars[i].nextElementSibling.value*10+'%';
					evt.currentTarget.children[1].textContent = bars[i].nextElementSibling.value+'/10';
				});
			}
		})(i);
	}
}

function setup_content_votes_report(){
	var div = document.querySelector('.user-content-container');
	var rpt = document.querySelector('.user-content-report');
	var frm = rpt.firstElementChild;

	frm.addEventListener('submit', function(evt){
		var sel = evt.target.querySelector('select');
		var params = {
			flag:frm.getAttribute('data-flag'),
			reason:sel.options[sel.selectedIndex].value
		};

		$.ajax({type:'post', dataType:'json', url:'/ax_content_flag/', data:params});

		frm.removeAttribute('data-flag');
		rpt.style.display = '';
		evt.preventDefault();
	});

	frm.addEventListener('reset', function(evt){
		frm.removeAttribute('data-flag');
		rpt.style.display = '';
		evt.preventDefault();
	});

	var pos = function(elm){
		var dx = 0, dy = 0, itm = elm;

		while (itm){
			dx += itm.offsetLeft;
			dy += itm.offsetTop;
			itm = itm.offsetParent;
		}
		return [dx,dy];
	};

	div.addEventListener('click', function(evt){
		var itm = evt.target;
		if (itm){
			var flg = itm.getAttribute('data-flag');
			if (flg){
				if (itm.textContent == 'Report'){
					var xy = pos(itm);
					rpt.style.display = 'block';
					rpt.style.top = (xy[1]-rpt.offsetHeight-10)+'px';
					rpt.style.left = (xy[0]-rpt.offsetWidth+itm.offsetWidth)+'px';
					frm.setAttribute('data-flag', flg);
				}
				else{
					// var el = itm;
					// while ((el = el.parentElement) && !el.className.contains('user-content-container'));
					var params = {
						flag:flg
					};

					$.ajax({type:'post', dataType:'json', url:'/ax_content_vote/', data:params})
					.done(function(res){
						if (!res.err.length){
							if (itm.parentElement){
								var votes = itm.parentElement.children;
								votes[0].textContent = '';
								votes[1].textContent = '';
								votes[2].textContent = '';
							}

							var n = parseInt(itm.getAttribute('data-val'), 10);
							n += res.vote_count;
							itm.textContent = n;
						}
					});
				}
				evt.preventDefault();
			}
		}
	});
}

function userform_serialize(collection){
	var i, obj = {};
	for (i=0; i<collection.length; i++){
		var itm = collection[i];
		switch (itm.type.toLowerCase()){
			case 'checkbox':
				obj[itm.name] = itm.checked ? '1':'0';
				//obj[itm.name] = 0+itm.checked;
				break;
			case 'hidden':
			case 'text':
			case 'textarea':
				obj[itm.name] = itm.value;
				break;
		}
	}

	return obj;
}

function valid_word_count(elm){
	var min = parseInt(elm.getAttribute('min-words'), 10);
	var cnt = parseInt(elm.getAttribute('word-count'), 10);
	return (min<=cnt);
};

function setup_content_form(form, fnc_submit){
	setup_wordcount(form);

	var btn = form.querySelector('button[type=submit]');
	var btn_txt = btn.textContent;
	var btn_delay = function(){
		setTimeout(function(){
			btn.disabled = false;
			btn.textContent = btn_txt;
		}, 6000);
		btn.disabled = true;
		btn.textContent = 'Waiting';
	};

	form.addEventListener('submit', function(evt){
		evt.preventDefault();
		btn_delay();

		if (valid_word_count(form.querySelector('textarea'))){
			fnc_submit(evt.currentTarget);
		}
	});
}

var content_progress = (function(){
	var progress = document.querySelector('.form-result-msg');
	var msg_q = [], tmr_id = 0;
	var LOOP_T = 2000;
	var looper = function(){
		if (msg_q.length){
			tmr_id = setTimeout(looper, LOOP_T);
			progress.innerHTML = msg_q.shift();
		}
		else{
			window.location.hash = '';
			window.location.reload(true);
		}
	};

	return {
		append: function(msg){
			clearTimeout(tmr_id);
			tmr_id = setTimeout(looper, (tmr_id ? LOOP_T:0));
			msg_q.push(msg);
		},
		show: function(){
			progress.setAttribute('show', '');
		},
		hide: function(){
			progress.removeAttribute('show');
		}
	};
})();

function submit_review(form){
	var params = userform_serialize(form.elements);
	params['token'] = window.localStorage.getItem('user-token');
	params['cy-ids'] = window.cy_ids;

	content_progress.append('Saving your review');
	content_progress.show();

	$.ajax({type:'post', dataType:'json', url:'/ax_content_review/', data:params})
	.done(function(res){
		var msg = 'Review was successfully saved';
		if (res.err.length){
			msg = res.err.join('<br>');
		}
		content_progress.append(msg);
	})
	.fail(function(){
		content_progress.append('Could not save review!');
	});
}

function submit_question(form){
	//var params = userform_serialize(evt.currentTarget.elements);
	var params = userform_serialize(form.elements);
	params['token'] = window.localStorage.getItem('user-token');
	params['cy-ids'] = window.cy_ids;

	content_progress.append('Saving your question');
	content_progress.show();

	$.ajax({type:'post', dataType:'json', url:'/ax_content_question/', data:params})
	.done(function(res){
		var msg = 'Question was successfully saved';
		if (res.err.length){
			msg = res.err.join('<br>');
		}
		content_progress.append(msg);
	})
	.fail(function(){
		content_progress.append('Could not save question!');
	});
}

function submit_answer(form){
	//var params = userform_serialize(evt.currentTarget.elements);
	var params = userform_serialize(form.elements);
	params['token'] = window.localStorage.getItem('user-token');
	params['cy-ids'] = window.cy_ids;
	params['cy-qid'] = window.cy_qid;

	content_progress.append('Saving your answer');
	content_progress.show();

	$.ajax({type:'post', dataType:'json', url:'/ax_content_answer/', data:params})
	.done(function(res){
		var msg = 'Answer was successfully saved';
		if (res.err.length){
			msg = res.err.join('<br>');
		}
		content_progress.append(msg);
	})
	.fail(function(){
		content_progress.append('Could not save answer!');
	});
}

doc_ready(function(){
	var form = null;
	var form_box = document.querySelector('.user-content-form');
	var form_act = document.querySelector('.user-content-action');

	if (form_box){
		form = form_box.querySelector('form');

		switch (form.id){
			case 'user-review-form':
				setup_ratings(form);
				setup_content_form(form, submit_review);
				break;
			case 'user-question-form':
				setup_content_form(form, submit_question);
				break;
			case 'user-answer-form':
				setup_content_form(form, submit_answer);
				break;
		}

		setup_alt_click();
		setup_content_votes_report();

		(function setup_reveal(){
			var reveal = function(){
				if (window.location.hash == '#show'){
					form_act.style.display = 'none';
					form_box.style.display = 'block';

					var params = {token:window.localStorage.getItem('user-token')};
					var res = $.ajax({type:'post', dataType:'json', url:'/ax_verify/', data:params})
					.done(function(res){
						if (!res.is_verified){
							try{
								window.localStorage.removeItem('user-token');
								window.localStorage.removeItem('user-handle');
								document.querySelector('body').setAttribute('data-user', 'guest');
								modal_waiting('Your login session has expired. Sign in to continue.');
							}
							catch (err){
							}
						}
					});
				}
				else{
					form_act.style.display = 'block';
					form_box.style.display = 'none';
				}
			};
			window.addEventListener('hashchange', function(){
				reveal();
			});
			reveal();
		})();
	}
});
