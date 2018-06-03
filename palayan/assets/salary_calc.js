function salary_calc_render(res){
	var fig = document.querySelector('#salary-calc figure');
	if (fig){
		fig.style.display = 'block';
		var render_item = function(item){
			var pct = 100*(res[1][item]-res[0][item])/Math.abs(res[0][item]);
			var c = 'e';
			if (pct < 0) c = 'n';
			else if (pct > 0) c = 'p';

			return '<i class="'+c+'"></i><span>'+pct.toFixed(1)+'%</span>';
		};

		var trs = fig.querySelectorAll('table tr');
		trs[0].children[1].innerHTML = render_item('composite');
		trs[1].children[1].innerHTML = render_item('good_services');
		trs[2].children[1].innerHTML = render_item('grocery');
		trs[3].children[1].innerHTML = render_item('healthcare');
		trs[4].children[1].innerHTML = render_item('housing');
		trs[5].children[1].innerHTML = render_item('transportation');
		trs[6].children[1].innerHTML = render_item('utilities');

		var mul = 1+(res[1].composite-res[0].composite)/Math.abs(res[0].composite);
		mul = mul*(document.querySelector('#salary-calc input[type=range]').value || 0);
		// document.querySelector('#salary-calc figcaption strong:nth-of-type(2)').textContent = '$'+commas(Math.ceil(mul));

		// document.querySelector('#salary-calc figcaption strong:nth-of-type(1)').textContent = res[1].city+', '+res[1].state_abbr;
		// document.querySelector('#salary-calc figure > strong span:nth-of-type(1)').textContent = res[1].city+', '+res[1].state_abbr;
		// document.querySelector('#salary-calc figure > strong span:nth-of-type(2)').textContent = res[0].city+', '+res[0].state_abbr;
		document.querySelector('#salary-calc figcaption em').textContent = '$'+commas(Math.ceil(mul));

		document.querySelector('#salary-calc figcaption strong span').textContent = res[1].city+', '+res[1].state_abbr;
		document.querySelector('#salary-calc figure > strong span:nth-of-type(1)').textContent = res[1].city+', '+res[1].state_abbr;
		document.querySelector('#salary-calc figure > strong span:nth-of-type(2)').textContent = res[0].city+', '+res[0].state_abbr;
	}
}

function salary_calc(){
	var frm = document.querySelector('#salary-calc form');
	if (frm){
		var qry = frm.querySelectorAll('input[type=text]');
		var lst = frm.querySelectorAll('div.list-pos ul');
		var src = [city_compare_source(), city_compare_source()];

		if (window.g_names){
			qry[0].value = window.g_names.city+', '+window.g_names.state_abbr;
		}

		var mac1 = autocomplete(qry[0], lst[0], src[0],
			function fmt(itm){
				return '%s, %s'.spf(itm.city, itm.state_abbr);
			},
			function sel(n){
				if (n > -1){
					var obj = src[0].row(n);
					qry[0].value = '%s, %s'.spf(obj.city, obj.state_abbr);
				}
			}
		);

		var mac2 = autocomplete(qry[1], lst[1], src[1],
			function fmt(itm){
				return '%s, %s'.spf(itm.city, itm.state_abbr);
			},
			function sel(n){
				if (n > -1){
					var obj = src[1].row(n);
					qry[1].value = '%s, %s'.spf(obj.city, obj.state_abbr);
				}
			}
		);

		var sal_label = frm.querySelector('.salary-label');
		var range = frm.querySelector('input[type=range]');
		var range_evt = function(evt){
			sal_label.textContent = commas(evt.target.value);
		};
		range.addEventListener('input', range_evt);
		if (!range.oninput){
			range.addEventListener('change', range_evt);
		}

		frm.addEventListener('submit', function(evt){
			evt.preventDefault();

			var params = {
				place1:qry[0].value,
				place2:qry[1].value
			};

			$.ajax({type:'get', dataType:'json', url:'/ax_col_city_cmp/', data:params})
			.done(function(res){
				if (res.length == 2){
					salary_calc_render(res);
				}
			});
		});
	}
}

doc_ready(function(){
	salary_calc();
});

