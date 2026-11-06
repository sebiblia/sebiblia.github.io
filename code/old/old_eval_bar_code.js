function update_prog_bar(){
	if((gvar.biblang.prog_bar.tot_ocu % NUM_OCU_UPDATE_BAR) == 0){
		const tmn = performance.now();
		if((tmn - gvar.biblang.prog_bar.start_time) > 1000){
			gvar.biblang.prog_bar.start_time = tmn;
			const val = gvar.biblang.prog_bar.num_verses_part / gvar.biblang.prog_bar.tot_verses_part;
			update_evaluating_bar(gvar.biblang.prog_bar.part_name, val);
			gvar.biblang.prog_bar.tot_updates++;
		}
	}
}

export function update_evaluating_bar(name, val){
	if(in_nodejs()){	// working from node
		return;
	}
	const nam = document.getElementById(id_evaluating_name);
	if(nam == null){
		return;
	}
	nam.innerHTML = name;
	const pbar = document.getElementById(id_evaluating_bar);
	if(pbar == null){
		return;
	}
	pbar.value = val;
}

function update_ev_bar(num_verse, tot_verses){
	if((num_verse % 100) == 0){
		const tmn = performance.now();
		if((tmn - gvar.biblang.prog_bar.start_time) > 1000){
			gvar.biblang.prog_bar.start_time = tmn;
			const val = num_verse / tot_verses;
			requestAnimationFrame(() => {
				update_evaluating_bar(gvar.biblang.prog_bar.part_name, val);
			});
			gvar.biblang.prog_bar.tot_updates++;
		}
	}
}

