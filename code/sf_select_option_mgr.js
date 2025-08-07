
// CODE_FOR SELECT FROM ARRAY OF OPTIONS (for example several verses)

const DEBUG_SEL_OPTIONS = false;
const DEBUG_SCROLL = false;

export function get_new_dv_under(dv_header, id_dv, toggle_op){
	//if(DEBUG_SEL_OPTIONS){ console.log("get_new_dv_under " + dv_header.id); }
	let dv_options = document.getElementById(id_dv);
	if(dv_options != null){
		var was_mine = (dv_header.nextSibling == dv_options);
		if(toggle_op != "keep"){
			if(DEBUG_SEL_OPTIONS){ console.log("REMOVING dv_options"); }
			dv_options.remove();
		} else {
			if(DEBUG_SEL_OPTIONS){ console.log("option keep. returnion old dv_options"); }
			return dv_options;
		}
		if(was_mine || (toggle_op == "force")){
			if(DEBUG_SEL_OPTIONS){ console.log("was_mine returning NULL"); }
			return null;
		}
	}
	if(DEBUG_SEL_OPTIONS){ console.log("creating NEW dv_options under " + dv_header.id); }
	
	dv_options = document.createElement("div");
	dv_header.after(dv_options);
	
	dv_options.id = id_dv;
	return dv_options;
}

export function 
toggle_select_option(dv_return, id_selec_men, all_options_arr, on_click_fn, menu_cls_arr, item_cls_arr, dv_to_scroll, toggle_op){
	
	var dv_options = get_new_dv_under(dv_return, id_selec_men, toggle_op); // old id_dv_sel_option
	if(dv_options == null){
		return;
	}
	dv_options.innerHTML = "";
	
	if(menu_cls_arr != null){
		dv_options.classList.add(...menu_cls_arr);
	} else {
		dv_options.classList.add("exam");
		dv_options.classList.add("is_block");
		dv_options.classList.add("grid_item_all_col");
	}
	
	let consec = 0;
	all_options_arr.forEach((value) => {
		const opt_idx = consec;
		consec++;
		const opt_id = get_opt_id(id_selec_men, opt_idx);
		const dv_opt = add_option(dv_options, opt_id, value, null, item_cls_arr);
		//dv_opt.addEventListener('click', async function() {
		dv_opt.addEventListener('click', function() {
			if(on_click_fn != null){
				on_click_fn(dv_return, dv_options, value, opt_idx);
				/*
				if(on_click_fn.constructor.name === "AsyncFunction"){
					await on_click_fn(dv_return, dv_options, value, opt_idx);
				} else {
					on_click_fn(dv_return, dv_options, value, opt_idx);
				}*/
			} else {
				dv_return.innerHTML = value;
				dv_return.selected_id = opt_idx;
				dv_options.remove();
			}
		});
	});
	
	if(dv_to_scroll != null){
		scroll_to_top(dv_to_scroll);
	}
}

function add_option(dv_parent, id_option, label, handler, item_cls_arr){
	const dv_opt = dv_parent.appendChild(document.createElement("div"));
	if(id_option != null){
		dv_opt.id = id_option;
	}
	if(item_cls_arr != null){
		dv_opt.classList.add(...item_cls_arr);
	} else {
		dv_opt.classList.add("exam");
		dv_opt.classList.add("is_option");
	}
	dv_opt.innerHTML = label;
	if(handler != null){
		dv_opt.addEventListener('click', handler);
	}
	return dv_opt; 
}

export function scroll_to_top(dv_elem, dv_ref) {
	if(DEBUG_SCROLL){ console.log("scroll_to_top " + dv_elem.id); }
	if(dv_elem == null){ return; }
	const rect = dv_elem.getBoundingClientRect();
	let dv_content = dv_ref;
	if(dv_content == null){
		dv_content = document.getElementById("id_tool_content");
	}
	if(dv_content == null){
		console.error("dv_content == null");
		return;
	}
	const rect2 = dv_content.getBoundingClientRect();
	
	const dist = (rect.top - rect2.top);
	//dv_content.scrollBy(0, dist);
	dv_content.scrollBy({
		top: dist,
		left: 0,
		behavior: "smooth",
	});
}

export function get_opt_id(id_selec_men, opt_idx){
	return id_selec_men + "_idx_" + opt_idx;
}
