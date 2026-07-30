export function
toggle_select_option(dv_return, id_selec_men, all_options_arr, on_click_fn, menu_cls_arr, item_cls_arr, dv_to_scroll, toggle_op, on_rclick_fn){
	let dv_options = get_new_dv_under(dv_return, id_selec_men, toggle_op); // old id_dv_sel_option
	if(dv_options == null){
		return null;
	}
	init_select_dv(dv_options, dv_return, id_selec_men, all_options_arr, on_click_fn, menu_cls_arr, item_cls_arr,
				   dv_to_scroll, toggle_op, on_rclick_fn);
	return dv_options;
}


export function
init_select_dv(dv_options, dv_return, id_selec_men, all_options_arr, on_click_fn, menu_cls_arr, item_cls_arr, dv_to_scroll, toggle_op, on_rclick_fn){

