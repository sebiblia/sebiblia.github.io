
import { bib_chapter_sizes, } from './sf_bib_chapter_sizes.js';

import { get_new_dv_under, scroll_to_top, toggle_select_option, get_opt_id, 
} from './sf_select_option_mgr.js';

import { verse_to_min_greek, verse_to_may_greek, verse_to_hebrew, get_text_analysis, make_strong_ref, get_scode_def, get_citation, 
	get_scode_mutus, get_scode_roots, get_next_scode, get_prev_scode, fill_bibobj_vtxt, fill_bibobj_cit_and_ref, local_scod_bibles, 
	get_verse_refs, get_socu_text, fill_cri_asc, fill_loc_asc, CLOSING_STRONG, 
} from './sf_bible_mgr.js';

import { init_lang, } from './sf_lang_mgr.js';
import { init_biblang, eval_biblang_command, set_biblang_conf, verse_disp, get_txt_matches, cmp_verses,  
	conf_to_mini, mini_to_conf, encode_mini, decode_mini, OT_nams, NT_nams, LOC_nams, add_dbg_log, 
} from './sf_biblang_mgr.js'


const DEBUG_FILL_VERSES = false;
const DEBUG_TEXT_ANA = false;
const DEBUG_SCODS = false;
const DEBUG_POP_MENU = false;
const DEBUG_FILL_SPARTS = false;
const DEBUG_VERSE_REFS = false;
const DEBUG_HREFS = false;
const DEBUG_INSERT_TAGS = false;
const DEBUG_CALC_NXT_PRESENT = false;
const DEBUG_ADD_SCOD_OCUS = false;

const WITH_AUX_BUTTON = false;

export let gvar = {};

const MIN_VERSES_FOR_IDX_NAV = 300;

const GET_var_expr = "biblang";
const GET_var_conf = "conf";

const PERSISTANT_STATE = true;		// DO NOT CHANGE. ONLY FOR DEBUGGING CHANGE TO false.
const STORAGE_STATE_ID = "STORAGE_STATE_ID";

const SUF_SCOD_DEF = "_scod_def";
const SUF_VERSE_TXT = "_verse_txt";
const SUF_VERSE_PRE = "_verse_pre";

const id_grid_text_analysis = "id_grid_text_analysis";
const id_pop_menu_sele = "id_pop_menu_sele";
const id_search_butt = "id_search_butt";
const id_repeat_butt = "id_repeat_butt";
const id_back_butt = "id_back_butt";
const id_forward_butt = "id_forward_butt";
const id_select = "id_select";
const id_dbg_data = "id_dbg_data";
const id_history = "id_history";
const id_books = "id_books";
const id_examples = "id_examples";
const id_variables = "id_variables";
const id_show_link = "id_show_link";
const id_save_history = "id_save_history";
const id_load_history = "id_load_history";
const id_reset_history = "id_reset_history";
const id_save_result = "id_save_result";
const id_list_name = "id_list_name";
const id_his_opers = "id_his_opers";
const id_add_comment = "id_add_comment";
const id_his_comment = "id_his_comment";
const id_menu_tok = "id_menu_tok";
const id_header = "id_header";
const id_info = "id_info";
const id_scodes = "id_scodes";
const id_del_expr = "id_del_expr";
const id_menu_scod_def = "id_menu_scod_def";
const id_submenu_scods = "id_submenu_scods";
const id_search_href = "id_search_href";
const id_dv_evaluating = "id_dv_evaluating";
const id_evaluating_bar = "id_evaluating_bar";
const id_evaluating_name = "id_evaluating_name";
const id_tra_txt = "id_tra_txt";
const id_verse_refs = "id_verse_refs";
const id_show_message = "id_show_message";

const id_butt_history = "id_butt_history";
const id_butt_books = "id_butt_books";
const id_butt_examples = "id_butt_examples";
const id_butt_variables = "id_butt_variables";
const id_butt_debug = "id_butt_debug";
const id_butt_show_link = "id_butt_show_link";
const id_butt_load_history = "id_butt_load_history";

const GREEK_PREFIX = "G";
const SCOD_PREFIX = "[";
const SCOD_SUFIX = "]";

const simbol_chars = {
UP:'\u2191',
DOWN:'\u2193',
};

const id_dv_tab = "id_dv_tab";
const tab_txt = "TAB";

const id_crit_sele = "id_crit_sele";
const id_expression = "id_expression";

const crit_regex = /[^(]*\(([^)]+)\).*/;

function get_crit_cod(val_sel){
	const matches = val_sel.match(crit_regex);
	
	if(matches){
		if(DEBUG_POP_MENU){ console.log(matches); }
		let cod = matches[1].trim();
		return cod;
	}
	return null;
}

function set_ui_rx_cls(dv_butt, cls){
	dv_butt.classList.remove("is_match_ot");
	dv_butt.classList.remove("is_match_nt");
	dv_butt.classList.remove("is_match_loc");
	dv_butt.classList.add(cls);
}

function set_ui_rx_op(dv_rx_op, cod){
	if(cod == "OT"){
		set_ui_rx_cls(dv_rx_op, "is_match_ot");
	}
	if(cod == "NT"){
		set_ui_rx_cls(dv_rx_op, "is_match_nt");
	}
	if(cod == "LOC"){
		set_ui_rx_cls(dv_rx_op, "is_match_loc");
	}
}

function set_htm_rx_in(dv_rx_in, cod){
	dv_rx_in.rx_in_cod = cod;
	let val = "";
	let cls = "";
	set_ui_rx_op(dv_rx_in, cod);
	cls = "is_match_rx";
	if(cod == "OT"){
		val = document.getElementById("id_old_test").innerHTML.trim();
	}
	if(cod == "NT"){
		val = document.getElementById("id_new_test").innerHTML.trim();
	}
	if(cod == "LOC"){
		val = document.getElementById("id_loc_bib").innerHTML.trim();
	}
	let htm = `<span class="${cls}">${val}</span>`;
	dv_rx_in.innerHTML = htm;
}

function set_ui_tra(dv_tra, cod){
	
	const all_rem = Object.values(gvar.tra_class);
	dv_tra.classList.remove(...all_rem);
	if(gvar.tra_class[cod] != null){
		dv_tra.classList.add(gvar.tra_class[cod]);
	}
}

function set_selec(dv_ret, val_sel){
	const cod = get_crit_cod(val_sel);
	if(cod != null){
		dv_ret.innerHTML = cod;
		if(dv_ret.update_ui_fn != null){
			dv_ret.update_ui_fn(dv_ret, cod);
		}
	}
}

function add_menu(dv_menus, dv_menu, ops_menu, update_fn){
	dv_menu.addEventListener('click', function() {
		const all_ops = Object.values(ops_menu);
		if(dv_menu.get_options_fn != null){
			dv_menu.get_options_fn(all_ops);
		}
		let cls_itm = null;
		if(dv_menu.set_cls_itm_fn != null){
			cls_itm = dv_menu.set_cls_itm_fn;
		}

		const cls_men = ["is_block", "grid_menus_back", "grid_item_all_col"];
		toggle_select_option(dv_menus, id_crit_sele, all_ops, function(dv_ret, dv_ops, val_sel, idx_sel){
			set_selec(dv_menu, val_sel);
			dv_ops.remove();
		}, cls_men, cls_itm);
		return;
	});
}

function get_tgt_rx_options(all_ops){
	const dv_old_tes = document.getElementById("id_old_test");
	const dv_new_tes = document.getElementById("id_new_test");
	const dv_loc_bib = document.getElementById("id_loc_bib");
	all_ops[0] += dv_old_tes.innerHTML;
	all_ops[1] += dv_new_tes.innerHTML;
	all_ops[2] += dv_loc_bib.innerHTML;
	return all_ops;
}

function set_rxtgt_cls_itm_ui(id_itm){
	const dv_itm = document.getElementById(id_itm);
	if(dv_itm == null){
		console.error("dv_itm == null");
		return;
	}
	const cod = get_crit_cod(dv_itm.innerHTML.trim());
	if(cod != null){
		set_ui_rx_op(dv_itm, cod);
		dv_itm.classList.add("is_option");
	}
}

function set_tra_cls_itm_ui(id_itm){
	const dv_itm = document.getElementById(id_itm);
	if(dv_itm == null){
		return;
	}
	const cod = get_crit_cod(dv_itm.innerHTML.trim());
	if(cod != null){
		set_ui_tra(dv_itm, cod);
		dv_itm.classList.add("is_option");
	}
}

function update_ot_ui(dv_ret, cod){
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	if(dv_rx_tgt.rx_in_cod == "OT"){
		set_htm_rx_in(dv_rx_tgt, dv_rx_tgt.rx_in_cod);
	}
}

function update_nt_ui(dv_ret, cod){
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	if(dv_rx_tgt.rx_in_cod == "NT"){
		set_htm_rx_in(dv_rx_tgt, dv_rx_tgt.rx_in_cod);
	}
}

function update_loc_ui(dv_ret, cod){
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	dv_rx_tgt.rx_in_cod = "LOC";
	set_htm_rx_in(dv_rx_tgt, dv_rx_tgt.rx_in_cod);
}


function init_menus(){
	const dv_menus = document.getElementById("id_menus");
	
	const dv_old_tes = document.getElementById("id_old_test");
	dv_old_tes.classList.add("is_match_ot");
	dv_old_tes.update_ui_fn = update_ot_ui;
	add_menu(dv_menus, dv_old_tes, gvar.old_crit_txt);
	const dv_new_tes = document.getElementById("id_new_test");
	dv_new_tes.classList.add("is_match_nt");
	dv_new_tes.update_ui_fn = update_nt_ui;
	add_menu(dv_menus, dv_new_tes, gvar.new_crit_txt);
	const dv_loc_bib = document.getElementById("id_loc_bib");
	dv_loc_bib.classList.add("is_match_loc");
	dv_loc_bib.update_ui_fn = update_loc_ui;
	add_menu(dv_menus, dv_loc_bib, gvar.loc_bible);
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	dv_rx_tgt.get_options_fn = get_tgt_rx_options;
	dv_rx_tgt.update_ui_fn = set_htm_rx_in;
	dv_rx_tgt.rx_in_cod = "LOC";
	dv_rx_tgt.set_cls_itm_fn = set_rxtgt_cls_itm_ui;

	dv_rx_tgt.classList.add("in_center");
	add_menu(dv_menus, dv_rx_tgt, gvar.tgt_rx, get_tgt_rx_options);
	set_htm_rx_in(dv_rx_tgt, dv_rx_tgt.rx_in_cod);

	const dv_tra_txt = document.createElement("div");
	dv_rx_tgt.after(dv_tra_txt);
	
	const straid = gvar.lang_utra[gvar.lang];
	
	dv_tra_txt.id = id_tra_txt;
	dv_tra_txt.classList.add("bib_item", "is_option");
	dv_tra_txt.innerHTML = straid;
	dv_tra_txt.update_ui_fn = (dv_ret, cod) => {
		set_ui_tra(dv_ret, cod);
		refresh_text_analysis();
	};
	dv_tra_txt.set_cls_itm_fn = set_tra_cls_itm_ui;
	add_menu(dv_menus, dv_tra_txt, gvar.tra_txt);
	set_ui_tra(dv_tra_txt, dv_tra_txt.innerHTML.trim());
	
	const dv_search = document.getElementById("id_search");
	const inp_box = document.createElement("input");
	inp_box.id = id_expression;
	inp_box.classList.add("width_95", "big_font");
	inp_box.value = "G66";
	inp_box.type = "text";
	dv_search.appendChild(inp_box);
	
	const dv_del_expr = document.createElement("div");
	dv_del_expr.id = id_del_expr;
	dv_del_expr.classList.add("delete_expr");
	dv_del_expr.innerHTML = "X";
	dv_del_expr.addEventListener('click', async function() {
		inp_box.value = "";
	});		
	dv_search.appendChild(dv_del_expr);
	
	const dv_search_butt = document.getElementById(id_search_butt);
	dv_search_butt.addEventListener('click', async function() {
		await do_select();
	});

	const dv_repeat_butt = document.getElementById(id_repeat_butt);
	dv_repeat_butt.addEventListener('click', async function() {
		const his = gvar.biblang.history;
		const dv_expr = document.getElementById(id_expression);
		const idx = his.length - 2;
		if((idx >= 0) && (idx < his.length)){
			const hobj = his[idx];
			dv_expr.value = hobj.expr;
			const conf = hobj.conf;
			await do_select(conf);
		}
	});

	const dv_back_butt = document.getElementById(id_back_butt);
	dv_back_butt.addEventListener('click', async function() {
		window.history.back();
	});

	const dv_forward_butt = document.getElementById(id_forward_butt);
	dv_forward_butt.addEventListener('click', async function() {
		window.history.forward();
	});

	inp_box.addEventListener('keydown', async function(ev) {
		if(ev.key === "Enter"){
			ev.stopPropagation();
			await do_select();
		}
	});
	
	let dv_button = null;
	let clk_hdlr = null;
	
	dv_button = document.getElementById("id_pop_menu"); // this id must be the same to the id in the HTML page.
	clk_hdlr = pop_menu_handler;
	if(dv_button != null){ dv_button.click_handler = clk_hdlr; dv_button.addEventListener('click', clk_hdlr); }
}

function get_ui_conf(){
	const dv_old_tes = document.getElementById("id_old_test");
	const oldt = dv_old_tes.innerHTML.trim();
	const dv_new_tes = document.getElementById("id_new_test");
	const newt = dv_new_tes.innerHTML.trim();
	const dv_loc_bib = document.getElementById("id_loc_bib");
	const loc_bib = dv_loc_bib.innerHTML.trim();
	const dv_rx_tgt = document.getElementById("id_rx_tgt");

	const rxtgt = dv_rx_tgt.rx_in_cod;
	const otxt = gvar.biblang.presentation;
	const dv_expr = document.getElementById(id_expression);
	const expr = dv_expr.value.trim();

	const rxin = rxtgt.toLowerCase();
	const txtout = otxt.toLowerCase();
	
	const conf = {};
	conf.curr_OT = oldt;
	conf.curr_NT = newt;
	conf.curr_LOC = loc_bib;
	conf.regex_input = rxin;
	conf.presentation = txtout;
	conf.expr = expr;
	return conf;
}

function set_ui_conf(conf){
	if(conf == null){
		return;
	}
	const dv_old_tes = document.getElementById("id_old_test");
	if(conf.curr_OT != null){
		dv_old_tes.innerHTML = conf.curr_OT;
	}
	const dv_new_tes = document.getElementById("id_new_test");
	if(conf.curr_NT != null){
		dv_new_tes.innerHTML = conf.curr_NT;
	}
	const dv_loc_bib = document.getElementById("id_loc_bib");
	if(conf.curr_LOC != null){
		dv_loc_bib.innerHTML = conf.curr_LOC;
	}
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	if(conf.regex_input != null){
		dv_rx_tgt.rx_in_cod = conf.regex_input.toUpperCase();
		set_htm_rx_in(dv_rx_tgt, dv_rx_tgt.rx_in_cod);
	}
	const dv_expr = document.getElementById(id_expression);
	if(conf.expr != null){
		dv_expr.value = conf.expr;
	}
}

async function do_select(prv_conf){
	const dv_old_tes = document.getElementById("id_old_test");
	const oldt = dv_old_tes.innerHTML.trim();
	const dv_new_tes = document.getElementById("id_new_test");
	const newt = dv_new_tes.innerHTML.trim();
	const dv_loc_bib = document.getElementById("id_loc_bib");
	const loc_bib = dv_loc_bib.innerHTML.trim();
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	const dv_expr = document.getElementById(id_expression);
	const expr = dv_expr.value.trim();
	
	const rxtgt = dv_rx_tgt.rx_in_cod;
	const rxin = rxtgt.toLowerCase();
	
	const dv_dbg_log = document.getElementById(id_dbg_data);
	if(dv_dbg_log != null){
		gvar.dbg_biblang = true;
	} else {
		gvar.dbg_biblang = false;
	}

	let conf = prv_conf;
	if(conf == null){
		conf = {};
		conf.curr_OT = oldt;
		conf.curr_NT = newt;
		conf.curr_LOC = loc_bib;
		conf.regex_input = rxin;
	}
	
	//start_biblang_command();		
	const bl_obj = await eval_biblang_command(expr, conf);
	
	fill_search_info(bl_obj);
	await fill_verses(bl_obj);

	//end_biblang_command();
	
	if(dv_dbg_log != null){
		toggle_dbg_info("keep");
	}
	
	write_storage_state();
	
	const dv_hist = document.getElementById(id_history);
	if(dv_hist != null){
		toggle_history_info("keep");
	}
	const dv_vars = document.getElementById(id_variables);
	if(dv_vars != null){
		toggle_variables_info("keep");
	}
}

function init_handlers(){
	const dv_verses = document.getElementById("id_verses");
	//dv_verses.classList.add("contain_scroll");
	/*
	dv_verses.addEventListener('wheel', function(ev) {
		ev.stopPropagation();
	});
	*/
	
	window.addEventListener('popstate', pop_history_handler);
}

async function pop_history_handler(ev){
	const dv_expr = document.getElementById(id_expression);
	if(ev.state){
		const his = gvar.biblang.history;
		const idx = ev.state;
		if((idx >= 0) && (idx < his.length)){
			const hobj = his[idx];
			dv_expr.value = hobj.expr;
			const conf = hobj.conf;
			
			gvar.biblang.recovering_his = true;
			gvar.biblang.his_idx_pop = idx;
			await do_select(conf);
		}
	}
}

export async function start_srch_mgr(curr_lang){
	init_lang(curr_lang);
	init_biblang(curr_lang);
	init_menus();
	if(PERSISTANT_STATE){ read_storage_state(); }
	init_handlers();
	init_shortcuts();
	
	if(PERSISTANT_STATE){ window.addEventListener('beforeunload', write_storage_state); }
	
	const conf = set_search_from_url();
	if(conf != null){
		await do_select(conf);
	}
}

/*
function init_nav_history(){
	if(gvar.biblang.history == null){
		return;
	}
	if(gvar.biblang.inited_history != null){
		return;
	}
	try{
		const his = gvar.biblang.history;
		let ii = 0;
		for(; ii < his.length; ii++){
			history.pushState(ii, '');
		}
	} catch(err){
		console.error(err);
	}
	gvar.biblang.inited_history = true;
}
*/

function get_conversion_func(){
	let otxt = gvar.biblang.presentation.toUpperCase();
	const rxi_val = gvar.biblang.regex_input.toUpperCase();
	if(rxi_val == "LOC"){
		otxt = "ASC";
	}
}

export function verse_cod2obj(vrs_cod){
	const cod_ver = vrs_cod.split(':');
	const id_ver = cod_ver.join('_');
	const bibobj = {};
	
	bibobj.id_dv_ver = id_ver;
	bibobj.book = Number(cod_ver[0]);
	bibobj.chapter = Number(cod_ver[1]);
	bibobj.verse = Number(cod_ver[2]);
	bibobj.cri_txt = gvar.biblang.curr_OT;
	if(bibobj.book > 39){
		bibobj.cri_txt = gvar.biblang.curr_NT;
	}
	const n2b = gvar.num2book_en;
	bibobj.book_name = n2b[bibobj.book];
	bibobj.conv_fn = verse_to_hebrew;
	if(bibobj.book > 39){
		bibobj.conv_fn = verse_to_min_greek;
	}
	if(bibobj.cri_txt == "LXX"){
		bibobj.conv_fn = verse_to_min_greek;
	}
	
	const vs_id = "" + bibobj.book + ":" + bibobj.chapter + ":" + bibobj.verse;
	bibobj.ocus_vs_id = vs_id;
			
	return bibobj;
}

async function fill_sdefs(bl_obj){
	if(in_nodejs()){
		return;
	}
	
	const dv_select = document.getElementById(id_select);
	let dv_scodes = document.getElementById(id_scodes);
	if(dv_scodes == null){
		dv_scodes = document.createElement("div");
		dv_scodes.id = id_scodes;
		dv_scodes.classList.add("search_scodes");
		dv_select.after(dv_scodes);
	}
	
	const lang = gvar.lang;
	
	const no_sco = ((bl_obj.all_scods == null) || (bl_obj.all_scods.length == 0));
	const no_vrs = ((bl_obj.lverses == null) || (bl_obj.lverses.length == 0));
	if(! no_vrs){
		if(no_sco){
			dv_scodes.remove();
			return;
		}
	}
	
	const all_scods = bl_obj.all_scods;
	dv_scodes.innerHTML = "";
	
	let ii = 0;
	for(ii = 0; ii < all_scods.length; ii++){
		const scod = all_scods[ii];
		let cls = "is_match_ot";
		
		let conv_fn_nt = verse_to_hebrew;
		const is_gre = scod.startsWith(GREEK_PREFIX);
		if(is_gre){
			cls = "is_match_nt";
			conv_fn_nt = verse_to_min_greek;
		}
		
		const dv_def = document.createElement("div");
		dv_def.id = scod + SUF_SCOD_DEF;
		dv_def.classList.add("full_width");
		const sdef = await get_scode_def(scod, lang);
		
		const sco_txt = conv_fn_nt(sdef.asc);
		const htm = `<span class="scode_info ${cls} is_match_scod">${scod}</span> <span>${sco_txt} (${sdef.asc})</span>: ${sdef.def}`;
		dv_def.innerHTML = htm;
		dv_scodes.appendChild(dv_def);
		
		dv_def.addEventListener('click', function() {
			toggle_scod_actions(dv_def, scod);
			scroll_to_top(dv_def);
		});		
	}
}

function fill_search_info(bl_obj){
	const dv_select = document.getElementById(id_select);
	let dv_info = document.getElementById(id_info);
	if(dv_info == null){
		dv_info = document.createElement("div");
		dv_info.id = id_info;
		dv_info.classList.add("search_info");
		dv_select.after(dv_info);
	}
	
	const lang = gvar.lang;
	
	const has_ocu = ((bl_obj.all_ocu != null) && (Object.keys(bl_obj.all_ocu).length > 0));
	const has_sco = ((bl_obj.all_scods != null) && (bl_obj.all_scods.length > 0));
	const has_vrs = ((bl_obj.lverses != null) && (bl_obj.lverses.length > 0));
	
	dv_info.innerHTML = "";

	const dv_igrid = document.createElement("div");
	dv_igrid.classList.add("grid_search_info");
	dv_info.appendChild(dv_igrid);

	const oldt = gvar.biblang.curr_OT;
	const newt = gvar.biblang.curr_NT;
	const loc_bib = gvar.biblang.curr_LOC;
	const itv_str = bl_obj.intervals.map(rr => ("[" + rr.join("-") + "]")).join(" ");
	const rxi_val = gvar.biblang.regex_input.toUpperCase();
	let rx_in = loc_bib;
	let cls_rx_in = "is_match_loc";
	if(rxi_val == "OT"){
		rx_in = oldt;
		cls_rx_in = "is_match_ot";
	}
	if(rxi_val == "NT"){
		rx_in = newt;
		cls_rx_in = "is_match_nt";
	}

	let dv_itm = null;
	
	let htm = "";
	if(has_sco || ! has_vrs){
		htm += `<span class="ot_info is_match_ot">${oldt}</span> <span class="nt_info is_match_nt">${newt}</span> -> `;
	}
	if(rx_in == loc_bib){
		htm += `<span class="loc_info is_match_loc">${loc_bib}</span>`;
	}
	if(rx_in == oldt){
		htm += `<span class="loc_info"><span class="is_match_ot">OT:${oldt}</span>, <span class="is_match_loc">NT:${loc_bib}</span></span>`;
	}
	if(rx_in == newt){
		htm += `<span class="loc_info"><span class="is_match_loc">OT:${loc_bib}</span>, <span class="is_match_nt">NT:${newt}</span></span>`;
	}
	if(htm.length > 0){
		dv_itm = document.createElement("div");
		dv_itm.classList.add("search_item");
		dv_itm.innerHTML = htm;
		dv_igrid.appendChild(dv_itm);
	}

	if(has_ocu || ! has_vrs){
		dv_itm = document.createElement("div");
		dv_itm.classList.add("search_item");
		dv_itm.innerHTML = 
			`<span class="rx_in_info">${gvar.all_msg.text_search} ${rxi_val} (<span class="rx_in_info_bib ${cls_rx_in}">${rx_in}</span>)</span>`;
		dv_igrid.appendChild(dv_itm);
		
		dv_itm = document.createElement("div");
		dv_itm.classList.add("search_item");
		dv_itm.innerHTML = `<span class="intervals_info">${gvar.all_msg.intervals_search} ${itv_str}</span>`;
		dv_igrid.appendChild(dv_itm);		
	}
	
	const all_vrs = bl_obj.lverses;
	if(all_vrs != null){
		const tot = "" + bl_obj.lverses.length;
		dv_itm = document.createElement("div");
		dv_itm.classList.add("search_item");
		dv_itm.innerHTML = `${gvar.all_msg.tot_versees}: ${tot}`;
		dv_igrid.appendChild(dv_itm);
		
		
		const dv_cn_chp_nav = document.createElement("div");
		dv_cn_chp_nav.classList.add("chap_nav");
		dv_igrid.appendChild(dv_cn_chp_nav);

		const dv_chp_nav = document.createElement("div");
		dv_chp_nav.classList.add("grid_chap_nav");
		dv_cn_chp_nav.appendChild(dv_chp_nav);
		
		const dv_prv_chp = document.createElement("div");
		dv_prv_chp.classList.add("is_button", "prev_chap");
		dv_prv_chp.innerHTML = gvar.all_msg.prev_chapter;
		dv_chp_nav.appendChild(dv_prv_chp);
		dv_prv_chp.addEventListener('click', () => {
			go_prev_chapter();
		});
		
		const dv_num_vrs = document.createElement("input");
		dv_num_vrs.value = 1;
		dv_num_vrs.type = "number";
		dv_chp_nav.appendChild(dv_num_vrs);
		dv_num_vrs.addEventListener('keydown', async function(ev) {
			if(ev.key === "Enter"){
				ev.stopPropagation();
				go_verse(dv_num_vrs.value);
			}
		});

		const dv_go = document.createElement("div");
		dv_go.classList.add("is_button");
		dv_go.innerHTML = gvar.all_msg.go_to_num_verse;
		dv_chp_nav.appendChild(dv_go);
		dv_go.addEventListener('click', () => {
			go_verse(dv_num_vrs.value);
		});
		
		/*
		const dv_show = document.createElement("div");
		dv_show.classList.add("is_button");
		dv_show.innerHTML = gvar.all_msg.show_num_verses;
		dv_chp_nav.appendChild(dv_show);
		dv_show.addEventListener('click', () => {
			show_num_verses(dv_num_vrs.value, bl_obj);
		});
		*/
		
		const dv_nxt_chp = document.createElement("div");
		dv_nxt_chp.classList.add("is_button", "next_chap");
		dv_nxt_chp.innerHTML = gvar.all_msg.next_chapter;
		dv_chp_nav.appendChild(dv_nxt_chp);
		dv_nxt_chp.addEventListener('click', () => {
			go_next_chapter();
		});
	}
	
}

export async function fill_verses(bl_obj){
	const is_node_call = in_nodejs();
	gvar.last_all_bibobj = [];
	const all_bibobj = gvar.last_all_bibobj;
	
	const all_vrs = bl_obj.lverses;
	const oldt = gvar.biblang.curr_OT;
	const newt = gvar.biblang.curr_NT;
	const loc_bib = gvar.biblang.curr_LOC;
	let otxt = gvar.biblang.presentation.toUpperCase();
	const rxi_val = gvar.biblang.regex_input.toUpperCase();
	if(rxi_val == "LOC"){
		otxt = "ASC";
	}
		
	if(! is_node_call){
		const dv_old_tes = document.getElementById("id_old_test");
		dv_old_tes.innerHTML = oldt;
		const dv_new_tes = document.getElementById("id_new_test");
		dv_new_tes.innerHTML = newt;
		const dv_loc_bib = document.getElementById("id_loc_bib");
		dv_loc_bib.innerHTML = loc_bib;	
		const dv_rx_tgt = document.getElementById("id_rx_tgt");
		dv_rx_tgt.rx_in_cod = rxi_val;
		set_htm_rx_in(dv_rx_tgt, dv_rx_tgt.rx_in_cod);
	}
	
	let bib_ot = gvar.biblang.curr_LOC;
	let bib_nt = gvar.biblang.curr_LOC;
	
	let conv_fn_ot = null;
	let conv_fn_nt = null;
	if(rxi_val == "OT"){
		bib_ot = gvar.biblang.curr_OT;
		if((otxt == "MAY") || (otxt == "MIN")){
			conv_fn_ot = verse_to_hebrew;
		}
		if(bib_ot == "LXX"){
			if(otxt == "MAY"){
				conv_fn_ot = verse_to_may_greek;
			}
			if(otxt == "MIN"){
				conv_fn_ot = verse_to_min_greek;
			}
		}
	}
	if(rxi_val == "NT"){
		bib_nt = gvar.biblang.curr_NT;
		if(otxt == "MAY"){
			conv_fn_nt = verse_to_may_greek;
		}
		if(otxt == "MIN"){
			conv_fn_nt = verse_to_min_greek;
		}
	}
	
	let dv_verses = null;
	if(! is_node_call){
		dv_verses = document.getElementById("id_verses");
		dv_verses.innerHTML = "";

		if(all_vrs.length == 0){
			dv_verses.innerHTML = gvar.all_msg.no_verses;
		}
		
		scroll_to_top(dv_verses);
	}

	gvar.biblang.prog_bar.part_name = gvar.all_msg.adding_verses;
	const tot_verses = all_vrs.length;
	

	if(DEBUG_FILL_VERSES){
		console.log("fill_verses. bib_ot=" + bib_ot);
		console.log("fill_verses. bib_nt=" + bib_nt);
	}
	
	let txta_bobj = null;
	
	let ii = 0;
	for(ii = 0; ii < all_vrs.length; ii++){
		const cod_vr = all_vrs[ii];
		const bibobj = verse_cod2obj(cod_vr);
		all_bibobj.push(bibobj);
		
		let dv_ver = null;
		if(! is_node_call){
			dv_ver = document.getElementById(bibobj.id_dv_ver);
			if(dv_ver != null){
				console.error("dv_ver != null");
				continue;
			}
			dv_ver = document.createElement("div");
			dv_ver.id = bibobj.id_dv_ver;
			dv_ver.innerHTML = bibobj.id_dv_ver;
			dv_verses.appendChild(dv_ver);
		}
		
		bibobj.ui_idx = ii;
		bibobj.bible = bib_ot;
		let conv_fn = conv_fn_ot;
		if(bibobj.book > 39){
			bibobj.bible = bib_nt;
			conv_fn = conv_fn_nt;
		}
		if(conv_fn != null){
			bibobj.conv_fn = conv_fn;
			bibobj.pre_conv_fn = conv_fn;
		}
		
		fill_bibobj_cit_and_ref(bibobj);
		await fill_bibobj_vtxt(bibobj);
		
		add_ui_bibobj(bibobj, dv_ver, bl_obj)		
		await calc_vtxt_next_presentation(bibobj, bl_obj);
		
		if(gvar.biblang.txta_verse == cod_vr){
			txta_bobj = bibobj;
		}		
	}
	
	if(! is_node_call){
		dv_verses.all_bibobj = all_bibobj;
	}

	const dv_end_vrs = document.createElement("div");
	dv_end_vrs.classList.add("end_of_verses");
	dv_verses.appendChild(dv_end_vrs);
	
	await fill_sdefs(bl_obj);
	await open_txta_verse(txta_bobj, bl_obj);
	
	return all_bibobj;
}

async function open_txta_verse(bibobj, bl_obj){
	if(in_nodejs()){
		return;
	}
	if(bibobj == null){
		return;
	}
	// gvar.biblang.txta_rx
	const dv_txt_id = bibobj.id_dv_ver + SUF_VERSE_TXT;
	const dv_txt = document.getElementById(dv_txt_id);
	await toggle_text_analysis(dv_txt, bibobj, bl_obj);
	const dv_verses = document.getElementById("id_verses");
	scroll_to_top(dv_txt, dv_verses);
	scroll_to_top(dv_verses);
}

function open_manual(){
	const m_href = `https://github.com/sebiblia/sebiblia.github.io?tab=readme-ov-file#manual-de-sebibliagithubio`;
	window.open(m_href, '_blank');
}

function init_history(){
	gvar.biblang.history = [];
	const dv_hist = document.getElementById(id_history);
	if(dv_hist != null){
		toggle_history_info("keep");
	}
	toggle_show_message(gvar.all_msg.history_inited);
}

function start_click(dv_tgt){
	dv_tgt.addEventListener('mousedown', () => {
		dv_tgt.classList.remove("is_top_button");
		dv_tgt.classList.add("is_top_button_clicked");		
		console.log("mousedown");
	});
	dv_tgt.addEventListener('touchstart', () => {
		dv_tgt.classList.remove("is_top_button");
		dv_tgt.classList.add("is_top_button_clicked");
	});
}

function end_click(dv_tgt){
	dv_tgt.addEventListener('mouseup', () => {
		dv_tgt.classList.remove("is_top_button_clicked");
		dv_tgt.classList.add("is_top_button");
		console.log("mouseup");
	});
	dv_tgt.addEventListener('touchend', () => {
		dv_tgt.classList.remove("is_top_button_clicked");
		dv_tgt.classList.add("is_top_button");
	});
}

function check_top_button(dv_tgt, id_ope){
}

function pop_menu_handler(){
	const dv_pop_sec = document.getElementById("id_pop_opt_sec");

	let dv_pop_men = null;
	dv_pop_men = get_new_dv_under(dv_pop_sec, id_pop_menu_sele);
	if(dv_pop_men == null){
		if(DEBUG_POP_MENU){ console.log("toggle_pop_menu OFF"); }
		return;
	}
	
	const pop_butt_cls = ["exam", "is_block", "big_item", "is_top_button"];

	let op = document.createElement("div");
	op.id = id_butt_history;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.history;
	op.addEventListener('click', () => {
		toggle_history_info();
		scroll_to_top(document.getElementById(id_history));
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_history), id_butt_history);
	
	op = document.createElement("div");
	op.id = id_butt_books;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.books;
	op.addEventListener('click', () => {
		toggle_books_info();
		scroll_to_top(document.getElementById(id_books));
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_books), id_butt_books);
	
	op = document.createElement("div");
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.copy_link;
	op.addEventListener('click', async () => {
		get_href();
	});
	start_click(op);
	end_click(op);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.id = id_butt_examples;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.examples;
	op.addEventListener('click', () => {
		toggle_lang_examples(gvar.examples);
		scroll_to_top(document.getElementById(id_examples));
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_examples), id_butt_examples);
	
	op = document.createElement("div");
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.manual;
	op.addEventListener('click', () => {
		open_manual();
	});
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.id = id_butt_variables;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.variables;
	op.addEventListener('click', () => {
		toggle_variables_info();
		scroll_to_top(document.getElementById(id_variables));
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_variables), id_butt_variables);
	
	op = document.createElement("div");
	op.id = id_butt_debug;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.debug;
	op.addEventListener('click', () => {
		toggle_dbg_info();
		scroll_to_top(document.getElementById(id_dbg_data));
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_dbg_data), id_butt_debug);
	
	op = document.createElement("div");
	op.id = id_butt_show_link;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.show_link;
	op.addEventListener('click', () => {
		toggle_show_link();
		scroll_to_top(document.getElementById(id_show_link));
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_show_link), id_butt_show_link);

	op = document.createElement("div");
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.save_result;
	op.addEventListener('click', () => {
		save_result();
	});
	start_click(op);
	end_click(op);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.save_history;
	op.addEventListener('click', () => {
		save_history();
	});
	start_click(op);
	end_click(op);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.id = id_butt_load_history;
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.load_history;
	op.addEventListener('click', () => {
		toggle_load_history();
		const dv_ld = document.getElementById(id_load_history);
		if(dv_ld != null){ dv_ld.scrollIntoView({ behavior: 'smooth', block: 'center'}); }
	});
	dv_pop_men.appendChild(op);
	toggle_button(document.getElementById(id_load_history), id_butt_load_history);
	
	op = document.createElement("div");
	op.classList.add(...pop_butt_cls);
	op.innerHTML = gvar.all_msg.reset_history;
	op.addEventListener('click', () => {
		init_history();
	});
	start_click(op);
	end_click(op);
	dv_pop_men.appendChild(op);

	
	if(WITH_AUX_BUTTON){
		op = document.createElement("div");
		op.classList.add(...pop_butt_cls);
		op.innerHTML = "EXAMPLES_TO_HISTORY";
		op.addEventListener('click', () => {
			gvar.biblang.history = gvar.examples;
			const dv_hist = document.getElementById(id_history);
			if(dv_hist != null){
				toggle_history_info("keep");
			}			
		});
		dv_pop_men.appendChild(op);
	}
	
	scroll_to_top(dv_pop_men);
}

function get_his_item_htm(itm){
	if(itm.comment == null){
		return itm.expr;
	}
	let htm = `<span class="is_example_expr">${itm.expr}</span><span class="is_example_title">${itm.comment}</span>`;
	return htm;
}

function toggle_button(dv_ope, id_butt){
	const dv_butt = document.getElementById(id_butt);
	if(dv_butt != null){
		if(dv_ope == null){
			dv_butt.classList.remove("is_top_button_on");
			dv_butt.classList.add("is_top_button");
		} else {
			dv_butt.classList.remove("is_top_button");
			dv_butt.classList.add("is_top_button_on");
		}
	}
}

function toggle_history_info(toggle_op){
	if(toggle_op == null){ toggle_op = "force"; }
	const dv_expr = document.getElementById(id_expression);
	let his_vals = gvar.biblang.history.map((itm) => get_his_item_htm(itm));
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		dv_expr.value = gvar.biblang.history[idx_sel].expr;
		const conf = gvar.biblang.history[idx_sel].conf;
		await do_select(conf);
		//dv_ops.remove();
	}
	let right_clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		const opt_id = get_opt_id(id_history, idx_sel);
		const dv_opt = document.getElementById(opt_id);
		
		await toggle_history_opers(dv_ops, dv_opt, idx_sel); // id_his_opers
	}
	if(his_vals.length == 0){
		his_vals = ["NO DATA TO SHOW. Do a search first."];
		clk_fn = null;
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	const dv_ope = toggle_select_option(dv_select, id_history, his_vals, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op, right_clk_fn);
	toggle_button(dv_ope, id_butt_history);
}

function toggle_history_opers(pnt_dv_ops, pnt_dv_opt, pnt_idx_sel){
	const his_opers = gvar.history_ops; // ["add", "delete"];
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		if(idx_sel == 0){
			const expr = gvar.biblang.history[pnt_idx_sel].expr;
			add_to_expr(expr);
			dv_ops.remove();
		}
		else if(idx_sel == 1){
			gvar.biblang.history.splice(pnt_idx_sel, 1);
			toggle_history_info("keep");
			dv_ops.remove();
		}
		else if(idx_sel == 2){
			toggle_add_comment(pnt_idx_sel);
		}
	}
	const cls_men = ["aux_item"];
	const cls_itm = ["is_option"];
	const dv_to_scroll = "relative";
	toggle_select_option(pnt_dv_opt, id_his_opers, his_opers, clk_fn, cls_men, cls_itm, dv_to_scroll);
}

function toggle_variables_info(toggle_op){
	if(toggle_op == null){ toggle_op = "force"; }
	const dv_expr = document.getElementById(id_expression);
	let vars = gvar.biblang.all_user_vars;
	let all_op = null;
	if(vars != null){
		all_op = Object.keys(vars);
	}
	if(all_op == null){
		all_op = ["THERE_ARE_NO_CALCULATED_VARIABLES"];
	}
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		add_to_expr(val_sel);
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = ["is_option"];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	const dv_ope = toggle_select_option(dv_select, id_variables, all_op, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
	toggle_button(dv_ope, id_butt_variables);
}

function toggle_books_info(toggle_op){
	if(toggle_op == null){ toggle_op = "force"; }
	const dv_expr = document.getElementById(id_expression);
	let abbr = Object.values(gvar.num2abbr);
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		add_to_expr(val_sel);
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = ["is_option"];
	const dv_select = document.getElementById(id_select);
	const dv_ope = toggle_select_option(dv_select, id_books, abbr, clk_fn, cls_men, cls_itm, null, toggle_op);
	toggle_button(dv_ope, id_butt_books);
}

function toggle_dbg_info(toggle_op){
	if(toggle_op == null){ toggle_op = "force"; }
	let log = gvar.biblang.dbg_log;
	let clk_fn = null;
	if(log.length == 0){
		log = [`NO DATA TO SHOW. Run a command.`];
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	const dv_ope = toggle_select_option(dv_select, id_dbg_data, log, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
	toggle_button(dv_ope, id_butt_debug);
}

function close_pop_menu() {
	let dv_pop_men = document.getElementById(id_pop_menu_sele);
	if(dv_pop_men != null){ dv_pop_men.remove(); }
}

function read_storage_state(){
	let state_str = window.localStorage.getItem(STORAGE_STATE_ID);
	let stat = {};
	if(state_str != null){
		stat = JSON.parse(state_str);
		if(stat.ui_conf != null){
			set_ui_conf(stat.ui_conf);
			set_biblang_conf(stat.ui_conf);
		}
		if(stat.hist != null){
			if(gvar.biblang == null){ gvar.biblang = {}; } 
			gvar.biblang.history = stat.hist;
		}
	}
}

function write_storage_state(){
	let stat = {};
	if(gvar.biblang.history != null){
		stat.hist = gvar.biblang.history;
	}
	stat.ui_conf = get_ui_conf();
	window.localStorage.setItem(STORAGE_STATE_ID, JSON.stringify(stat));
}

function refresh_text_analysis(){
	const dv_ana = document.getElementById(id_grid_text_analysis);
	if(dv_ana == null){
		return;
	}
	const dv_txt = dv_ana.dv_txt;
	const bibobj = dv_ana.bibobj;
	const bl_obj = dv_ana.bl_obj;

	const dv_tra_txt = document.getElementById(id_tra_txt);
	bibobj.dict = dv_tra_txt.innerHTML.trim();
	
	fill_strong_parts(bibobj);
	
	get_text_analysis(bibobj, bl_obj).then((full_ana) => {
		dv_ana.innerHTML = "";
		
		if(DEBUG_TEXT_ANA){
			console.log("TEXT_ANALYSIS_OF " + dv_txt.id);
			console.log(bibobj);
			console.log(full_ana);
		}
		if(gvar.dbg_biblang){
			toggle_dbg_info("keep");
		}
		
		const toks = full_ana.ana;
		let ii = 0;
		for(; ii < toks.length; ii++){
			const tok = toks[ii];
			add_text_analysis_word(dv_ana, bibobj, tok);
			add_all_added(dv_ana, bibobj, tok);
		}
	});
}

async function toggle_text_analysis(dv_txt, bibobj, bl_obj){
	
	var dv_ana = get_new_dv_under(dv_txt, id_grid_text_analysis);
	if(dv_ana == null){
		return;
	}
	dv_ana.when_remove_fn = () => {
		set_orig_txt(bibobj);
	};
	dv_ana.classList.add("grid_txt_analysis", "grid_txt_columns");
	let cls = "is_match_ot";
	if(bibobj.book >= 40){
		cls = "is_match_nt";
	}
	dv_ana.classList.add(cls);
	dv_ana.dv_txt = dv_txt;
	dv_ana.bibobj = bibobj;
	dv_ana.bl_obj = bl_obj;
	
	refresh_text_analysis();
}

function add_text_analysis_word(dv_ana, bibobj, tok, is_added){
	let cri = "";
	let wd_id = tok.id;
	const ocus_rx = get_matches_txta_rx(wd_id);
	if(bibobj.conv_fn != null){
		cri = bibobj.conv_fn(wd_id);
	}
	if(ocus_rx != null){
		const tg1 = insert_all_tags(wd_id, ocus_rx, "is_match_txta");
		const tg2 = insert_all_tags(cri, ocus_rx, "is_match_txta");
		wd_id = tg1.txt;
		cri = tg2.txt;
	}
	let bib_cri = bibobj.cri_txt;
	let is_deleted = false;
	if(! tok.comm && ! is_added && (bib_cri != "LXX")){
		bib_cri = "BH";
		is_deleted = true;
	}
	
	const t1 = add_tok_item(dv_ana, 1, cri, is_added, is_deleted);
	const t2 = add_tok_item(dv_ana, "auto", wd_id, is_added, is_deleted, true);
	const t3 = add_tok_item(dv_ana, "auto", tok.sco, is_added, is_deleted, false, tok.sel_scod);
	const t4 = add_tok_item(dv_ana, "auto", bib_cri, is_added, is_deleted, true);
	if(is_added){ t4.classList.add("txt_added_right"); }
	
	const t5 = add_tok_tra(dv_ana, tok);
	
	t1.addEventListener('click', function() {
		const dv_togg = toggle_asc_id_menu(t5, bibobj, tok);
		if(dv_togg != null){
			t1.classList.add("is_sel_scod");
			dv_togg.when_remove_fn = () => {
				t1.classList.remove("is_sel_scod");
			};
		}
	});
	t2.addEventListener('click', function() {
		const dv_togg = toggle_asc_id_menu(t5, bibobj, tok);
		if(dv_togg != null){
			t2.classList.add("is_sel_scod");
			dv_togg.when_remove_fn = () => {
				t2.classList.remove("is_sel_scod");
			};
		}
	});		
	t3.addEventListener('click', async function() {
		const dv_togg = toggle_scod_menu(t5, bibobj, tok);
		if(dv_togg != null){
			turn_on_scod(bibobj, tok);
			t3.classList.add("is_sel_scod");
			dv_togg.when_remove_fn = () => {
				set_orig_txt(bibobj);
				t3.classList.remove("is_sel_scod");
			};
		}
	});		
	
}

function add_all_added(dv_ana, bibobj, tok){
	const added = tok.added;
	if(added == null){
		return;
	}
	let ii = 0;
	for(; ii < added.length; ii++){
		const obj = added[ii];
		if(obj.idx1 != null){
			add_text_analysis_word(dv_ana, bibobj, obj, true);
		}
	}
}

function add_tok_item(dv_ana, col, htm, is_added, is_deleted, is_optional, sel_itm){
	const dv_itm = document.createElement("div");
	dv_itm.classList.add("txt_ana_item");
	if(is_added){
		dv_itm.classList.add("txt_ana_added_item");
		if(col == 1){
			dv_itm.classList.add("txt_added_left");
		}
	}
	if(is_deleted){
		dv_itm.classList.add("txt_ana_deleted_item");
	}
	if(sel_itm){
		dv_itm.classList.add("is_match_scod");
	}
	if(is_optional){
		dv_itm.classList.add("txt_optional_item");
	}
	dv_itm.style.gridColumnStart = col;
	dv_itm.style.gridColumnEnd = col;
	dv_itm.innerHTML = "";
	if(htm != null){
		dv_itm.innerHTML = htm;
	}
	dv_ana.appendChild(dv_itm);
	return dv_itm;
}

function add_tok_tra(dv_ana, tok){
	const dv_itm = document.createElement("div");
	dv_itm.classList.add("txt_ana_item");
	if(tok.dict != null){
		const cls = gvar.tra_class[tok.dict];
		if(cls != null){
			dv_itm.classList.add(cls);
		}
	}
	dv_itm.style.gridColumnStart = "auto";
	dv_itm.style.gridColumnEnd = "auto";
	dv_itm.innerHTML = "";
	if(tok.tra != null){
		dv_itm.innerHTML = tok.tra;
	}
	dv_ana.appendChild(dv_itm);
	return dv_itm;
}

function toggle_asc_id_menu(dv_up, bibobj, tok){
	const dv_expr = document.getElementById(id_expression);
	const ops = gvar.tok_ops_asc_id; // ["exact", "partial", "add"];
	ops[0] = tok.id;
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		let the_expr = null;
		let out = "ot";
		if(bibobj.book >= 40){
			out = "nt";
		}
		if(idx_sel == 0){
			the_expr = `=${out} ; :${out} ; /(^|\\s)${tok.id}(\\s|$)/`;
		}
		if(idx_sel == 1){
			the_expr = `=${out} ; :${out} ; /${tok.id}/`;
		}
		if(idx_sel == 2){
			add_to_expr(tok.id);
		}
		if(the_expr != null){
			dv_expr.value = the_expr;
			if(idx_sel != 2){
				await do_select();
			}
		}
		
		if(dv_ops.when_remove_fn != null){ dv_ops.when_remove_fn(); }
		dv_ops.remove();
		scroll_to_top(dv_expr);
	}
	const cls_men = ["aux_item"];
	const cls_itm = ["is_option"];
	const dv_to_scroll = null;
	const toggle_op = null;
	const dv_togg = toggle_select_option(dv_up, id_menu_tok, ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
	return dv_togg;
}

function end_tok_menu(dv_ops, dv_expr){
	if(dv_ops.when_remove_fn != null){ dv_ops.when_remove_fn(); }
	dv_ops.remove();
	scroll_to_top(dv_expr);
}

function toggle_scod_menu(dv_up, bibobj, tok){
	const scod = tok.sco;
	if(scod.length == 0){
		return null;
	}
	const id_tggl_menu = id_menu_tok;
	const dv_expr = document.getElementById(id_expression);
	const ops = gvar.tok_ops_scod; // ["select", "add", "biblehub"];
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		let the_expr = null;
		if(idx_sel == 0){
			dv_expr.value = scod;
			await do_select();
			end_tok_menu(dv_ops, dv_expr);
		}
		if(idx_sel == 1){
			add_to_expr(scod);
			end_tok_menu(dv_ops, dv_expr);
		}
		if(idx_sel == 2){
			// go to biblehub
			const href_sco = make_strong_ref(scod);
			window.open(href_sco, '_blank');
			end_tok_menu(dv_ops, dv_expr);
		}
		if(idx_sel == 3){
			const roots = await get_scode_roots(scod);
			if(DEBUG_SCODS){
				console.log("get_scode_roots");
				console.log(roots);
			}
			let subops = ["HAS NO ROOT"];
			if((roots != null) && (roots.length > 0)){
				subops = roots.split(" ");
			}
			toggle_scod_subops(dv_ops, scod, id_tggl_menu, idx_sel, subops);
		}
		if(idx_sel == 4){
			const mutus = await get_scode_mutus(scod);
			if(DEBUG_SCODS){
				console.log("get_scode_mutus");
				console.log(mutus);
			}
			let subops = ["HAS NO MUTUAL"];
			if((mutus != null) && (mutus.length > 0)){
				subops = mutus.split(" ");
			}
			toggle_scod_subops(dv_ops, scod, id_tggl_menu, idx_sel, subops);
		}
		if(idx_sel == 5){
			const opt_id = get_opt_id(id_tggl_menu, idx_sel);
			const dv_opt = document.getElementById(opt_id);
			
			await toggle_occurs(dv_ops, dv_opt, scod);
		}		
	}
	const cls_men = ["aux_item"];
	const cls_itm = ["is_option"];
	const dv_to_scroll = null;
	const toggle_op = null;
	const dv_togg = toggle_select_option(dv_up, id_tggl_menu, ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
	return dv_togg;
}

function cmp_ocurrence(oc1, oc2){
	/*{
			lng: rr[0].length,
			idx: rr.index,
	}
		*/
	const dd = (oc1.idx - oc2.idx);
	if(dd != 0){ return dd; }
	
	const l1 = oc1.lng;
	const l2 = oc2.lng;
	return (l2 - l1);
}

function insert_tag(htm, pos, tag){
	if(pos < htm.lpos){
		return;
	}
	const idx = pos + htm.disp;
	if((idx < 0) || (idx > htm.txt.length)){
		return;
	}
	//htm.txt = htm.txt.slice(0, idx) + tag + htm.txt.slice(idx);
	htm.txt = htm.txt.substring(0, idx) + tag + htm.txt.substring(idx);
	htm.disp += tag.length;
	htm.lpos = pos;
}

function insert_all_tags(vs_txt, vs_ocu, cls, bk_num){
	const socu = vs_ocu.sort(cmp_ocurrence);

	const ini_tag = `<span class="${cls}">`;
	const ini_ot = `<span class="is_match_ot">`;
	const ini_nt = `<span class="is_match_nt">`;
	const end_tag = `</span>`;
	
	let htm = { txt: vs_txt, disp: 0, lpos: 0, };
	let ii = 0;
	for(; ii < vs_ocu.length; ii++){
		const ocu = vs_ocu[ii];
		if(ocu.lng < 1){ continue; }
		let ini_tg = ini_tag;
		if(ocu.is_stg){ 
			if(bk_num > 39){
				ini_tg = ini_nt;
			} else {
				ini_tg = ini_ot;
			}			
		}
		insert_tag(htm, ocu.idx, ini_tg);
		const end_pos = ocu.idx + ocu.lng;
		insert_tag(htm, end_pos, end_tag);
	}
	
	if(DEBUG_INSERT_TAGS && (htm.txt != vs_txt)){ console.log("insert_all_tags. HTM="); console.log(htm); /*console.trace();*/ }
	
	return htm;
}

function set_css_matches(vs_txt, bibobj, bl_obj){
	if(vs_txt == null){	return vs_txt; }
	if(bl_obj.all_ocu == null){	return vs_txt; }
	if(bibobj.bible == null){ return vs_txt; }
	let bib = bibobj.bible;
	
	const cls = "is_match_rx";
	if(bl_obj.all_ocu[bib] == null){ 
		bib += "i";
		if(bl_obj.all_ocu[bib] == null){ return vs_txt; }
	}
	
	const vs_id = bibobj.ocus_vs_id;
	if(bl_obj.all_ocu[bib][vs_id] == null){ return vs_txt; }
	
	const vs_ocu = bl_obj.all_ocu[bib][vs_id];
	
	const htm = insert_all_tags(vs_txt, vs_ocu, cls, bibobj.book);
	return htm.txt;	
}

function toggle_scod_actions(dv_def, scod){
	const id_menu = id_menu_scod_def;
		
	const ops = gvar.ops_def_scod; // ["prv", "nxt", "roots", "mutual", "occurrences", "find", "add", biblehub_abbr]
	const dv_expr = document.getElementById(id_expression);
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		let the_expr = null;
		if(idx_sel == 0){
			const prv = await get_prev_scode(scod);
			dv_expr.value = prv;
			await do_select();
		}
		if(idx_sel == 1){
			const nxt = await get_next_scode(scod);
			dv_expr.value = nxt;
			await do_select();
		}
		if(idx_sel == 2){
			const roots = await get_scode_roots(scod);
			if(DEBUG_SCODS){
				console.log("get_scode_roots");
				console.log(roots);
			}
			let subops = ["HAS NO ROOT"];
			if((roots != null) && (roots.length > 0)){
				subops = roots.split(" ");
			}
			toggle_scod_subops(dv_ops, scod, id_menu, idx_sel, subops);
		}
		if(idx_sel == 3){
			const mutus = await get_scode_mutus(scod);
			if(DEBUG_SCODS){
				console.log("get_scode_mutus");
				console.log(mutus);
			}
			let subops = ["HAS NO MUTUAL"];
			if((mutus != null) && (mutus.length > 0)){
				subops = mutus.split(" ");
			}
			toggle_scod_subops(dv_ops, scod, id_menu, idx_sel, subops);
		}
		if(idx_sel == 4){
			const opt_id = get_opt_id(id_menu, idx_sel);
			const dv_opt = document.getElementById(opt_id);
			
			await toggle_occurs(dv_ops, dv_opt, scod);
		}
		if(idx_sel == 5){
			dv_expr.value = scod;
			await do_select();
		}
		if(idx_sel == 6){
			add_to_expr(scod);
		}
		if(idx_sel == 7){
			const href_sco = make_strong_ref(scod);
			window.open(href_sco, '_blank');
			
			if(dv_ops.when_remove_fn != null){ dv_ops.when_remove_fn(); }
			dv_ops.remove();
		}
	}
	const cls_men = ["aux_item"];
	const cls_itm = ["is_option"];
	const dv_to_scroll = null;
	const toggle_op = null;
	toggle_select_option(dv_def, id_menu, ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
}

function toggle_scod_subops(dv_parent_ops, scod, id_menu, idx_selec, sub_ops){
	const opt_id = get_opt_id(id_menu, idx_selec);
	const dv_opt = document.getElementById(opt_id);
	
	const dv_expr = document.getElementById(id_expression);
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		dv_expr.value = val_sel;
		await do_select();
		
		if(dv_ops.when_remove_fn != null){ dv_ops.when_remove_fn(); }
		dv_ops.remove();
		dv_parent_ops.remove();
	}
	const cls_men = ["aux_item"];
	const cls_itm = ["is_option"];
	const dv_to_scroll = null;
	const toggle_op = null;
	toggle_select_option(dv_opt, id_submenu_scods, sub_ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
}

function get_ocu_options(all_ocus){
	const ops = [];
	const ocu_ents = Object.entries(all_ocus);
	const sor_ocu = ocu_ents.sort((aa, bb) => (bb[1] - aa[1]));
	const tot = ocu_ents.reduce((acum, subarr) => acum + subarr[1], 0);
	
	let ii = 0;
	for(; ii < sor_ocu.length; ii++) {		
		const ent = sor_ocu[ii];
		const pct = (ent[1] / tot) * 100;
		const fpct = pct.toFixed(2);
		
		const ocu = "'" + ent[0] + "' " + ent[1] + " (" + fpct + " %)";
		ops.push(ocu);
	}
	return ops;
}

async function toggle_occurs(dv_parent_ops, dv_opt, scod){
	const loc_bib = gvar.biblang.curr_LOC;
	const lang = gvar.bib_lang[loc_bib];
	const socuid = gvar.lang_occus[lang];
	const all_ocus = await get_socu_text(socuid, scod);
	const sub_ops = get_ocu_options(all_ocus);
	
	const dv_expr = document.getElementById(id_expression);
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		const mm = val_sel.match(/'([^']*)'/);
		let txt = "";
		if(mm){
			txt = " & (:loc ; /" + mm[1].trim() + "/)";
		}
		
		dv_expr.value = scod + txt;
		await do_select();
		
		if(dv_ops.when_remove_fn != null){ dv_ops.when_remove_fn(); }
		dv_ops.remove();
		dv_parent_ops.remove();
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_to_scroll = null;
	const toggle_op = null;
	toggle_select_option(dv_opt, id_submenu_scods, sub_ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
}

function add_to_expr(cad){
	const dv_expr = document.getElementById(id_expression);
	//const has_foc = (document.activeElement === dv_expr);
	const pos = dv_expr.selectionStart;
	if(pos >= 0){
		const txt = dv_expr.value;
		dv_expr.value = txt.substring(0, pos) + cad + txt.substring(pos);
		dv_expr.focus();
		const pos2 = pos + cad.length;
		dv_expr.setSelectionRange(pos2, pos2);
		return;
	}
	dv_expr.value += cad;
}

async function select_disp(bibobj, num){
	const vr = [bibobj.book, bibobj.chapter, bibobj.verse];
	const fst = verse_disp(vr, -num);
	const lst = verse_disp(vr, num);
	const expr = `${fst[0]}:${fst[1]}:${fst[2]} :: ${lst[0]}:${lst[1]}:${lst[2]}`;
	const dv_expr = document.getElementById(id_expression);
	dv_expr.value = expr;
	await do_select();
	
	const dv_verses = document.getElementById("id_verses");
	const dv_vr = document.getElementById(bibobj.id_dv_ver);
	scroll_to_top(dv_vr, dv_verses);
	scroll_to_top(dv_verses);
}

function add_ui_disp(dv_ver, bibobj, disp, htm, butt_classes){
	let dv_itm = null;
	dv_itm = document.createElement("div");
	dv_itm.classList.add(...butt_classes);
	dv_itm.innerHTML = htm;
	dv_itm.addEventListener('click', async function() {
		await select_disp(bibobj, disp);
	});		
	dv_ver.appendChild(dv_itm);
}

function add_ui_bibobj(bibobj, dv_ver, bl_obj){
	if(in_nodejs()){
		return;
	}
	if(dv_ver == null){
		return;
	}
	
	const vhref = bibobj.href_bh;
	let vcit = "INVALID_BIBLE_CITATION";
	if(bibobj.vcit != null){
		vcit = `${bibobj.vcit}`;
	}
	
	const butt_classes = ["is_verse_oper"];
	
	dv_ver.innerHTML = "";
	let dv_itm = null;
	
	dv_itm = document.createElement("div");
	dv_itm.classList.add("is_verse_cit");
	dv_itm.innerHTML = vcit;
	dv_itm.addEventListener('click', async function() {
		const dv_expr = document.getElementById(id_expression);
		dv_expr.value = vcit;
		await do_select();
	});		
	dv_ver.appendChild(dv_itm);	
	
	add_ui_disp(dv_ver, bibobj, 20, "20", butt_classes);
	add_ui_disp(dv_ver, bibobj, 40, "40", butt_classes);

	dv_itm = document.createElement("div");
	dv_itm.classList.add(...butt_classes);
	dv_itm.innerHTML = gvar.add_abbr;
	dv_itm.addEventListener('click', function() {
		add_to_expr(vcit);
	});		
	dv_ver.appendChild(dv_itm);	
	
	dv_itm = document.createElement("div");
	dv_itm.classList.add(...butt_classes);
	dv_itm.innerHTML = "refs";
	dv_itm.addEventListener('click', function() {
		toggle_refs_menu(dv_itm, bibobj);
	});		
	dv_ver.appendChild(dv_itm);
	
	dv_itm = document.createElement("div");
	dv_itm.classList.add(...butt_classes);
	dv_itm.innerHTML = gvar.biblehub_abbr;
	dv_itm.addEventListener('click', function() {
		window.open(vhref, '_blank');
	});		
	dv_ver.appendChild(dv_itm);

	const dv_pre = document.createElement("div");
	dv_pre.id = dv_ver.id + SUF_VERSE_PRE;
	dv_pre.classList.add(...butt_classes);
	dv_pre.innerHTML = "";
	dv_pre.addEventListener('click', async function() {
		if(DEBUG_CALC_NXT_PRESENT){
			bibobj.dbg_calc_nxt_pre = true;
		}
		await calc_vtxt_next_presentation(bibobj, bl_obj);
	});		
	dv_ver.appendChild(dv_pre);	

	const dv_txt = document.createElement("div");
	dv_txt.classList.add("bold_font");
	dv_txt.id = dv_ver.id + SUF_VERSE_TXT;
	dv_ver.appendChild(dv_txt);	
	dv_txt.addEventListener('click', async function() {
		await toggle_text_analysis(dv_txt, bibobj, bl_obj);
		const dv_verses = document.getElementById("id_verses");
		scroll_to_top(dv_txt, dv_verses);
		scroll_to_top(dv_verses);
	});
}

function get_search_href(){
	const loc = document.location;
	const his = gvar.biblang.history;
	if(his == null){
		const qr_href = `${loc.origin}${loc.pathname}`;
		return qr_href;
	}
	if(his.length == 0){
		const qr_href = `${loc.origin}${loc.pathname}`;
		return qr_href;
	}
	const last = his[his.length - 1];
	if(DEBUG_HREFS){ 
		console.log("get_search_href"); 
		console.log(JSON.stringify(last.conf)); 		
	}
	
	const mm = conf_to_mini(last.conf);
	const mm2 = encode_mini(mm);
	const enc_conf = encodeURIComponent(mm2);
	const enc_expr = encodeURIComponent(last.expr);
	const qr_href = `${loc.origin}${loc.pathname}?${GET_var_expr}=${enc_expr}&${GET_var_conf}=${enc_conf}`;
	
	console.log("get_search_href");
	console.log(qr_href);
	return qr_href;
}

function find_GET_parameter(prm_nm) {
	let result = null,
	tmp = [];
	location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			tmp = item.split("=");
			if(tmp[0] === prm_nm){ result = decodeURIComponent(tmp[1]); }
		});
	return result;
}

function set_search_from_url(){
	const expr = find_GET_parameter(GET_var_expr);
	if(expr == null){
		return null;
	}
	const mini = find_GET_parameter(GET_var_conf);
	if(mini == null){
		return null;
	}
	const mm = decode_mini(mini);
	const conf = mini_to_conf(mm);

	const dv_expr = document.getElementById(id_expression);
	dv_expr.value = expr;
	set_ui_conf(conf);
	set_biblang_conf(conf);
	
	return conf;
}

function get_href(){
	try{
		const hrf = get_search_href();
		if(hrf != null){
			navigator.clipboard.writeText(hrf);
		}
	} catch(err){
		console.error("Cannot get_href", err);
	}
}

function start_biblang_command(){
	let dv_evaluating = document.getElementById(id_dv_evaluating);
	if(dv_evaluating != null){
		return;
	}
	
	if(gvar.biblang.prog_bar == null){ gvar.biblang.prog_bar = {}; }
	gvar.biblang.prog_bar.start_time = performance.now();
	
	const tag_ev_tit = `${gvar.all_msg.evaluating} <span id=${id_evaluating_name}"></span><br>`;
	const tag_img = `<progress id="${id_evaluating_bar}" class="download_bar" value="0" max="1"></progress>`;
	
	const dv_verses = document.getElementById("id_verses");
	dv_evaluating = document.createElement("div");
	dv_evaluating.id = id_dv_evaluating;
	dv_evaluating.innerHTML = tag_ev_tit + tag_img;
	
	dv_verses.prepend(dv_evaluating);
	
}

function end_biblang_command(){
	let dv_evaluating = document.getElementById(id_dv_evaluating);
	if(dv_evaluating != null){
		dv_evaluating.remove();
	}
}

function in_nodejs(){
	return (typeof window === 'undefined');
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

function set_orig_txt(bibobj){
	const txt_id = bibobj.id_dv_ver + SUF_VERSE_TXT;
	const dv_txt = document.getElementById(txt_id);
	dv_txt.innerHTML = dv_txt.orig_txt;
}

function has_local_scod_bible(bibobj){
	if(local_scod_bibles[bibobj.bible] == 1){
		return true;
	}
	return false;
}

function turn_on_scod(bibobj, tok){
	if(! has_local_scod_bible(bibobj)){
		return;
	}
	const txt_id = bibobj.id_dv_ver + SUF_VERSE_TXT;
	const dv_txt = document.getElementById(txt_id);
	const vs_txt = dv_txt.orig_txt;
	const rxo = new RegExp(tok.sco, "g");
	const vs_ocu = get_txt_matches(vs_txt, rxo);
	const htm = insert_all_tags(vs_txt, vs_ocu, "is_sel_scod");
	dv_txt.innerHTML = htm.txt;
}

export function fill_strong_parts(bibobj){
	if(bibobj.dict != "SBIB"){
		bibobj.sparts = null;
		return;
	}
	if(! has_local_scod_bible(bibobj)){
		return;
	}
	const vtxt = bibobj.vtxt;
	if(vtxt == null){
		console.error("vtxt == null");
		return;
	}
	bibobj.sparts = get_verse_parts(vtxt);
}

const regex_scode = /\[([HGhg])(\d+)\]/g;

function get_verse_parts(vtxt){
	const rxo = regex_scode;
	let all_ocu = [];
	let sparts = {};
	let rr = null;
	let lstx = "";
	let lstx_beg = 0;
	let lstx_lng = 0;
	while((rr = rxo.exec(vtxt)) !== null){
		const kk = rr[1].trim().toUpperCase();
		const nn = "" + Number(rr[2]);
		const scod = `${kk}${nn}`;
		
		const txt_end = rr.index;
		let txt_beg = 0;
		if(all_ocu.length > 0){
			const prv = all_ocu[all_ocu.length - 1];
			txt_beg = prv.idx + prv.lng;
		} 
		const stx = vtxt.substring(txt_beg, txt_end).trim();
		if(stx.length > 0){
			lstx = stx;
			lstx_beg = txt_beg;
			lstx_lng = txt_end - txt_beg;
			if(DEBUG_FILL_SPARTS){
				console.log(`get_verse_parts. PART= ${lstx} ${lstx_beg} ${lstx_lng}`);
			}
		}

		let ocu = {
			idx: rr.index,
			lng: rr[0].length,
			stx: lstx,
			sidx: lstx_beg,
			slng: lstx_lng,
		};		

		if(DEBUG_FILL_SPARTS){
			console.log(`get_verse_parts. SCOD= ${scod} ${lstx} ${lstx_beg} ${lstx_lng}`);
		}
		
		if(sparts[scod] == null){ sparts[scod] = [] };
		sparts[scod].push(ocu);
					
		all_ocu.push(ocu);		
	}
	
	return sparts;
}

function get_vid_citacion(vid){
	const vvs = vid.split(":");
	const book = Number(vvs[0]);
	const chapter = Number(vvs[1]);
	const verse = Number(vvs[2]);
	const cit = gvar.num2abbr[book] + "." + chapter + ":" + verse;
	return cit;
}

async function toggle_refs_menu(dv_itm, bibobj){
	const dv_expr = document.getElementById(id_expression);
	const vid = bibobj.id_dv_ver.split("_").join(":");
	if(DEBUG_VERSE_REFS){ console.log("toggle_refs_menu " + vid); }
	
	let ops = [gvar.all_msg.no_refs];	
	const refs = await get_verse_refs(vid);
	if(refs != null){
		const vrefs = refs.split(" ").sort(cmp_verses);
		ops = vrefs.map((vid) => get_vid_citacion(vid));
	}
	
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		let the_expr = val_sel;
		if((the_expr != null) && (the_expr != gvar.all_msg.no_refs)){
			dv_expr.value = the_expr;
			await do_select();
		}
		
		if(dv_ops.when_remove_fn != null){ dv_ops.when_remove_fn(); }
		dv_ops.remove();
		scroll_to_top(dv_expr);
	}
	const cls_men = ["aux_item"];
	const cls_itm = ["is_option"];
	const dv_to_scroll = null;
	const toggle_op = null;
	const dv_togg = toggle_select_option(dv_itm, id_verse_refs, ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
	return dv_togg;
}

function get_example_htm(itm){
	let htm = `<span class="is_example_expr">${itm.expr}</span>`;
	if(itm.comment != null){
		htm += ` <span class="is_example_title">${itm.comment}</span>`;
	}
	return htm;
}

function toggle_lang_examples(examples){
	let toggle_op = "force";
	const dv_expr = document.getElementById(id_expression);
	let exam_vals = examples.map((itm) => get_example_htm(itm));
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		dv_expr.value = examples[idx_sel].expr;
		const conf = examples[idx_sel].conf;
		await do_select(conf);
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	const dv_ope = toggle_select_option(dv_select, id_examples, exam_vals, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
	toggle_button(dv_ope, id_butt_examples);
}

function upper_first(cad){
	if(cad.length === 0){
		return cad;
	}
	return cad.charAt(0).toUpperCase() + cad.substring(1);
}

async function calc_vtxt_next_presentation(bibobj, bl_obj){
	const txt_id = bibobj.id_dv_ver + SUF_VERSE_TXT;
	const pre_id = bibobj.id_dv_ver + SUF_VERSE_PRE;
	
	let dv_txt = null;
	let dv_pre = null;
	let nxt_pre = "";
	
	if(! in_nodejs()){
		dv_txt = document.getElementById(txt_id);
		dv_pre = document.getElementById(pre_id);
		nxt_pre = dv_pre.innerHTML;
	}
	
	const pLOC = gvar.biblang.curr_LOC;
	
	const is_stg_bib = gvar.is_strong_bib[pLOC];
	let pLOCx = "";
	if(is_stg_bib){
		pLOCx = pLOC.substring(0, pLOC.length - 1) + 'x';
	}

	let curr_cls = "";
	let nxt_cls = "";
	let conv_fn = null;
	let orig_pre = bibobj.bible;
	let is_LOC = false;
	let is_LOCx = false;
	let is_wstg = false;
	
	if(orig_pre != pLOC){
		orig_pre = upper_first(bibobj.bible.toLowerCase());
		if(bibobj.pre_conv_fn != null){
			const conv_fn = bibobj.pre_conv_fn;
			if(conv_fn == verse_to_hebrew){
				orig_pre = bibobj.bible.toUpperCase();
			}
			if(conv_fn == verse_to_min_greek){
				orig_pre = bibobj.bible.toLowerCase();
			}
			if(conv_fn == verse_to_may_greek){
				orig_pre = bibobj.bible.toUpperCase();
			}			
		}
	}

	if(nxt_pre == ""){
		nxt_pre = orig_pre;
	}
	const is_orig_pre = (nxt_pre == orig_pre);
	
	if(bibobj.dbg_calc_nxt_pre){
		console.log(`calc_vtxt_next_presentation. BEFORE. is_LOC=${is_LOC}. nxt_pre=${nxt_pre}. pLOC=${pLOC}. is_stg_bib=${is_stg_bib}.
			orig_pre=${orig_pre}. is_orig_pre=(${nxt_pre} == ${orig_pre})=${is_orig_pre}`);
	}
	
	if(bibobj.book > 39){
		const pNT = gvar.biblang.curr_NT.toUpperCase();
		const pnt = gvar.biblang.curr_NT.toLowerCase();
		const pNt = upper_first(pnt);
		const is_nt = (nxt_pre == pnt);
		const is_NT = (nxt_pre == pNT);
		const is_Nt = (nxt_pre == pNt);
		is_LOC = (nxt_pre == pLOC);
		is_LOCx = (nxt_pre == pLOCx);
		nxt_cls = "is_match_nt";
		if(is_nt){ // is pnt
			conv_fn = verse_to_min_greek;
			nxt_pre = pNT;
		}
		if(is_NT){ // is pNT
			conv_fn = verse_to_may_greek;
			nxt_pre = pNt;
		}
		if(is_Nt){ // is pNt
			nxt_pre = pLOC;
			nxt_cls = "is_match_loc";
		}
		if(is_LOC){ // is pLOC
			//was_loc = true;
			nxt_pre = pnt;
			if(is_stg_bib){ nxt_pre = pLOCx; }
		}
		if(is_LOCx){ // is pLOCx
			nxt_pre = pnt;
		}
	} else {
		const is_LXX = (gvar.biblang.curr_OT == "LXX");
		const pot = gvar.biblang.curr_OT.toLowerCase();  // only if is_LXX
		const pOT = gvar.biblang.curr_OT.toUpperCase();
		const pOt = upper_first(pot);
		const is_ot = (nxt_pre == pot); // only if is_LXX
		const is_OT = (nxt_pre == pOT);
		const is_Ot = (nxt_pre == pOt);
		is_LOC = (nxt_pre == pLOC);
		is_LOCx = (nxt_pre == pLOCx);
		nxt_cls = "is_match_ot";
		if(is_ot){ // is pot
			conv_fn = verse_to_hebrew;
			if(is_LXX){	conv_fn = verse_to_min_greek; }
			nxt_pre = pOT;
		}
		if(is_OT){ // is pOT
			conv_fn = verse_to_hebrew;
			if(is_LXX){	conv_fn = verse_to_may_greek; }
			nxt_pre = pOt;
		}
		if(is_Ot){ // is pOt
			nxt_pre = pLOC;
			nxt_cls = "is_match_loc";
		}
		if(is_LOC){ // is pLOC
			//was_loc = true;
			nxt_pre = pOT;
			if(is_stg_bib){ nxt_pre = pLOCx; }
			else if(is_LXX){ nxt_pre = pot; }
		}
		if(is_LOCx){ // is pLOCx
			nxt_pre = pOT;
			if(is_LXX){ nxt_pre = pot; }
		}
	}
	
	if(bibobj.dbg_calc_nxt_pre){
		console.log(`calc_vtxt_next_presentation. AFTER: is_LOC=${is_LOC}. nxt_pre=${nxt_pre}. pLOC=${pLOC}. orig_pre=${orig_pre}. `);
	}
	
	let vtxt = "INVALID_BIBLE_TEXT";
	if(bibobj.vtxt != null){
		let is_orig = true;
		vtxt = bibobj.vtxt;
		if(is_stg_bib){ vtxt = bibobj.vstxt; }
		if(! is_LOC && ! is_LOCx){
			await fill_cri_asc(bibobj);
			vtxt = bibobj.cri_asc;
			is_orig = false;
		} else {
			await fill_loc_asc(bibobj);
			vtxt = bibobj.loc_asc;
			if(is_stg_bib && ! is_LOCx){ vtxt = bibobj.vstxt; }
		}
		if(conv_fn != null){
			vtxt = conv_fn(vtxt);
		}
		if(is_stg_bib && bibobj.dbg_calc_nxt_pre){
			console.log(`calc_vtxt_next_presentation. \n\t bibobj.vstxt=${bibobj.vstxt} \n\t  vtxt=${vtxt} `);
		}
		const is_not_loc = ((orig_pre != pLOC) && (! is_LOC) && (! is_LOCx));
		if(is_orig_pre || is_not_loc){
			if(bibobj.dbg_calc_nxt_pre){
				console.log(`calc_vtxt_next_presentation. doing set_css_matches in vtxt=${vtxt}`);
			}
			add_scods_matches(bibobj, bl_obj);
			vtxt = set_css_matches(vtxt, bibobj, bl_obj);
		}
	}
	bibobj.curr_htm = vtxt;

	if(in_nodejs()){
		return;
	}
	
	if(conv_fn == verse_to_hebrew){
		dv_txt.classList.add("in_right");
	} else {
		dv_txt.classList.remove("in_right");
	}
	dv_txt.innerHTML = vtxt;
	dv_txt.orig_txt = vtxt;
	
	is_LOC = is_LOC || is_LOCx;	
	
	if(is_LOC){
		dv_pre.classList.remove("is_match_loc");
		dv_pre.classList.add(nxt_cls);
	} 
	if((nxt_pre == pLOC) || (nxt_pre == pLOCx)){
		dv_pre.classList.remove("is_match_ot");
		dv_pre.classList.remove("is_match_nt");
		dv_pre.classList.add("is_match_loc");
	}
	if(is_LOC){
		dv_txt.classList.remove("is_match_ot");
		dv_txt.classList.remove("is_match_nt");
		dv_txt.classList.add("is_match_loc");
	} else {
		dv_txt.classList.remove("is_match_loc");
		if(bibobj.book > 39){
			dv_txt.classList.add("is_match_nt");
		} else {
			dv_txt.classList.add("is_match_ot");
		}
	}
	dv_pre.innerHTML = nxt_pre;
	
}

function get_matches_txta_rx(itm_txt){
	const trx = gvar.biblang.txta_rx;
	if(trx == null){
		return null;
	}
	if(trx.length < 2){
		return null;
	}
	const rx_str = trx.substring(1);
	const rxo = new RegExp(rx_str, "g");
	const vs_ocu = get_txt_matches(itm_txt, rxo);
	return vs_ocu;
	//const htm = insert_all_tags(vs_txt, vs_ocu, "is_sel_scod");
	//dv_txt.innerHTML = htm.txt;
}

function add_scods_matches(bibobj, bl_obj){
	const vstxt = bibobj.vstxt;
	if(vstxt == null){
		return;
	}
	
	const pLOC = gvar.biblang.curr_LOC;
	const is_stg_bib = gvar.is_strong_bib[pLOC];
	if(! is_stg_bib){
		return;
	}

	if(bl_obj.scod_found == null){ bl_obj.scod_found = {}; }

	const vs_id = bibobj.ocus_vs_id;
	if(bl_obj.scod_found[vs_id]){
		return;
	}
	
	if(gvar.biblang.all_ocu == null){ gvar.biblang.all_ocu = {}; }
	const comm_ocu = gvar.biblang.all_ocu;
	
	const all_scods = bl_obj.all_scods;
	let ii = 0;
	for(ii = 0; ii < all_scods.length; ii++){
		const scod = all_scods[ii];
		add_scod_ocus(scod, bibobj, bl_obj);
	}	

	bl_obj.scod_found[vs_id] = true;
}

function add_scod_ocus(scod, bibobj, bl_obj){
	if(bibobj.bible == null){ return; }
	const vstxt = bibobj.vstxt;
	if(vstxt == null){ return; }
	
	const vs_id = bibobj.ocus_vs_id;
	
	const tg_scod_str = `<${scod}${CLOSING_STRONG}`;
	const rxstr = `<(G|H)[0-9]*${CLOSING_STRONG}`;
	const rxo = new RegExp(rxstr, "g");
	let prv_beg = 0;
	const all_mocu = [];
	get_txt_matches(vstxt, rxo, (ocu, all_ocu) => {
		ocu.is_stg = true; 
		let prv_end = 0;
		let prv_ocu = null;
		if(all_ocu.length > 0){
			const lst = all_ocu.length - 1;
			prv_ocu = all_ocu[lst];
		}
		if(prv_ocu != null){
			prv_end = prv_ocu.idx + prv_ocu.lng;
		}
		const sub_vstxt = vstxt.substring(prv_end, ocu.idx);
		const is_empty = sub_vstxt.match(/^\s*$/);
		if(! is_empty){
			prv_beg = prv_end;
			ocu.beg = prv_beg;
		} else {
			if(prv_ocu != null){
				ocu.beg = prv_ocu.beg;
			} else {
				ocu.beg = prv_beg;
			}
		}
		ocu.tlng = (ocu.idx + ocu.lng) - ocu.beg;
		const tok = vstxt.substring(ocu.beg, (ocu.idx + ocu.lng));
		const scod_str = vstxt.substring(ocu.idx, ocu.idx + ocu.lng);
		//console.log(`scod_str=${scod_str}`);
		if(tg_scod_str == scod_str){
			all_mocu.push(ocu);
		}
		if(DEBUG_ADD_SCOD_OCUS){
			console.log(`tok='${tok}'`);
		}
	});
	
	if(all_mocu.length == 0){
		return;
	}
	fix_all_mocus(all_mocu);
	
	let bib = null;
	if(bl_obj.all_ocu == null){	bl_obj.all_ocu = {}; }
	const comm_ocu = bl_obj.all_ocu;
	if(comm_ocu[bibobj.bible] != null){ 
		bib = bibobj.bible;
	}
	const bibi = bibobj.bible + "i";
	if((bib == null) && (comm_ocu[bibi] != null)){
		bib = bibi;
	}
	if(bib == null){
		bib = bibobj.bible;
	}
	if(comm_ocu[bib] == null){ comm_ocu[bib] = {}; }
	
	if(comm_ocu[bib][vs_id] == null){ comm_ocu[bib][vs_id] = []; }
	comm_ocu[bib][vs_id].push(...all_mocu);	
}

function fix_all_mocus(all_mocu){
	let ii = 0;
	for(ii = 0; ii < all_mocu.length; ii++){
		const ocu = all_mocu[ii];
		ocu.idx = ocu.beg;
		ocu.lng = ocu.tlng;
	}
}

function remove_add_comment(){
	const dv_add = document.getElementById(id_add_comment);
	if(dv_add != null){
		dv_add.remove();
	}
}

function save_comment(inp_box, pnt_idx_sel){
	if(inp_box.value != ""){
		gvar.biblang.history[pnt_idx_sel].comment = inp_box.value;
		toggle_history_info("keep");
	} else {
		delete gvar.biblang.history[pnt_idx_sel].comment;
		toggle_history_info("keep");
	}
}

function toggle_add_comment(pnt_idx_sel){
	const dv_his_opers = document.getElementById(id_his_opers);
	let dv_add = get_new_dv_under(dv_his_opers, id_add_comment);
	if(dv_add == null){
		return null;
	}
	dv_add.classList.add("grid_add_his_comment");
	dv_add.innerHTML = "";
	
	dv_his_opers.when_remove_fn = remove_add_comment;
	
	const inp_box = document.createElement("input");
	inp_box.id = id_his_comment;
	inp_box.value = "";
	const comm = gvar.biblang.history[pnt_idx_sel].comment;
	if(comm != null){
		inp_box.value = comm;
	}
	inp_box.type = "text";
	dv_add.appendChild(inp_box);
	
	inp_box.addEventListener('keydown', async function(ev) {
		if(ev.key === "Enter"){
			ev.stopPropagation();
			save_comment(inp_box, pnt_idx_sel);
		}
	});

	const dv_save = document.createElement("div");
	dv_save.innerHTML = gvar.all_msg.save_button;
	dv_save.classList.add("is_button");
	dv_add.appendChild(dv_save);

	dv_save.addEventListener('click', function() {
		save_comment(inp_box, pnt_idx_sel);
		/*
		if(inp_box.value != ""){
			gvar.biblang.history[pnt_idx_sel].comment = inp_box.value;
			toggle_history_info("keep");
		} else {
			delete gvar.biblang.history[pnt_idx_sel].comment;
			toggle_history_info("keep");
		}*/
		dv_his_opers.remove();
	});
	
	inp_box.scrollIntoView({ behavior: 'smooth'});
}

function toggle_load_history(){
	const dv_select = document.getElementById(id_select);
	
	let dv_ld_his = get_new_dv_under(dv_select, id_load_history);
	if(dv_ld_his == null){
		toggle_button(dv_ld_his, id_butt_load_history);
		return null;
	}
	toggle_button(dv_ld_his, id_butt_load_history);
	dv_ld_his.classList.add("grid_load_history");
	dv_ld_his.innerHTML = "";

	const inp_box = document.createElement("input");
	inp_box.type = "file";
	//inp_box.classList.add("width_95", "big_font");
	//inp_box.value = "SEBIBLIA_HISTORIA.json";
	dv_ld_his.appendChild(inp_box);

	let to_load = null;
	inp_box.addEventListener('change', function() {
		if(this.files && this.files[0]){
			to_load = this.files[0];
		}
	});
	
	const dv_load = document.createElement("div");
	dv_load.innerHTML = gvar.all_msg.load_button;
	dv_load.classList.add("is_block", "big_item", "is_button");
	dv_ld_his.appendChild(dv_load);
	
	dv_load.addEventListener('click', function() {
		if(to_load != ""){
			console.log("RECUPERANDO=" + to_load.name);
			const rdr = new FileReader();
			rdr.onload = function(ev){
				try {
					const his = JSON.parse(ev.target.result);
					//console.log(his);
					gvar.biblang.history = his;
					const dv_hist = document.getElementById(id_history);
					if(dv_hist != null){
						toggle_history_info("keep");
					}
					console.log("RECUPERAR " + to_load.name + " TERMINADO");
				} catch (err){
					console.error("NOT a JSON file." + err);
				}
			};
			
			rdr.readAsText(to_load);
		}
		dv_ld_his.remove();
	});
}

function save_file(nam, obj){
	const data = [];
	const the_str = JSON.stringify(obj, null, "  ");
	data.push(the_str);
	
	const file = new File(data, nam, {type: 'application/octet-stream'});
	var url = URL.createObjectURL(file);
	window.open(url);
	URL.revokeObjectURL(url); // This seems to work here.
}

function init_shortcuts(){
	window.addEventListener('keydown', function(ev) {
		if(gvar.all_key_down == null){
			gvar.all_key_down = {};
		}
		const all_dwn = gvar.all_key_down;
		all_dwn[ev.key.toLowerCase()] = true;
		if((ev.ctrlKey || ev.metaKey) && all_dwn['a']){			
			ev.preventDefault();
			ev.stopPropagation();
			if(all_dwn['h']){
				toggle_history_info();
				scroll_to_top(document.getElementById(id_history));
			}
			if(all_dwn['b']){
				toggle_books_info();
				scroll_to_top(document.getElementById(id_books));
			}
			if(all_dwn['l']){
				const hrf = get_search_href();
				if((hrf != null) && (gvar.save_link_href == null)){ gvar.save_link_href = hrf; }
			}
			if(all_dwn['e']){
				toggle_lang_examples(gvar.examples);
				scroll_to_top(document.getElementById(id_examples));
			}
			if(all_dwn['m']){
				open_manual();
			}
			if(all_dwn['v']){
				toggle_variables_info();
				scroll_to_top(document.getElementById(id_variables));
			}
			if(all_dwn['d']){
				toggle_dbg_info();
				scroll_to_top(document.getElementById(id_dbg_data));
			}
			if(all_dwn['k']){
				toggle_show_link();
				scroll_to_top(document.getElementById(id_show_link));
			}
			if(all_dwn['u']){
				save_result();
			}
			if(all_dwn['s']){
				save_history();
			}
			if(all_dwn['r']){
				toggle_load_history();
				scroll_to_top(document.getElementById(id_load_history));
			}
			if(all_dwn['i']){
				init_history();
			}
		}
	});
	window.addEventListener('keyup', async function(ev) {
		if(gvar.all_key_down == null){
			gvar.all_key_down = {};
		}
		const kk = ev.key.toLowerCase();
		gvar.all_key_down[kk] = false;
	});
}

function save_result(){
	const obj = gvar.last_all_bibobj;
	if(obj != null){
		save_file(gvar.all_msg.results_fnam, obj);
	}
}

function save_history(){
	const obj = gvar.biblang.history;
	if(obj != null){
		save_file(gvar.all_msg.history_fnam, obj);
	}
}

function toggle_show_link(){
	const dv_select = document.getElementById(id_select);
	var dv_href = get_new_dv_under(dv_select, id_show_link, "force");
	if(dv_href == null){
		toggle_button(dv_href, id_butt_show_link);
		return;
	}
	toggle_button(dv_href, id_butt_show_link);
	dv_href.classList.add("search_info");

	dv_href.innerHTML = "";
	
	const hrf = get_search_href();
	
	const inp_box = document.createElement("input");
	inp_box.classList.add("full_width");
	inp_box.value = hrf;
	inp_box.type = "text";
	dv_href.appendChild(inp_box);
	
}

async function go_prev_chapter(){
	const dv_verses = document.getElementById("id_verses");
	const all_bibobj = dv_verses.all_bibobj;
	if(all_bibobj == null){
		console.error("all_bibobj == null");
		return;
	}
	if(all_bibobj.length == 0){
		console.error("all_bibobj.length == null");
		return;
	}
	const bibobj = all_bibobj[0];
	let boo = bibobj.book;
	let chp = bibobj.chapter - 1;
	if(chp < 1){
		if(boo > 1){
			boo--;
			const all_chp = Object.keys(bib_chapter_sizes[boo]);
			chp = all_chp[all_chp.length - 1];
		} else {
			chp = bibobj.chapter;
		}
	}
	let frm = gvar.num2abbr[boo] + "." + chp;
	
	const dv_expr = document.getElementById(id_expression);
	dv_expr.value = frm;
	await do_select();
}

async function go_next_chapter(){
	const dv_verses = document.getElementById("id_verses");
	const all_bibobj = dv_verses.all_bibobj;
	if(all_bibobj == null){
		console.error("all_bibobj == null");
		return;
	}
	if(all_bibobj.length == 0){
		console.error("all_bibobj.length == null");
		return;
	}
	const bibobj = all_bibobj[all_bibobj.length - 1];
	let boo = bibobj.book;
	let chp = bibobj.chapter + 1;
	const all_chp = Object.keys(bib_chapter_sizes[boo]);
	const num_chp = all_chp[all_chp.length - 1];
	if(chp > num_chp){
		if(boo < 66){
			boo++;
			chp = 1;
		} else {
			chp = bibobj.chapter;
		}
	}
	let frm = gvar.num2abbr[boo] + "." + chp;
	
	const dv_expr = document.getElementById(id_expression);
	dv_expr.value = frm;
	await do_select();
}

function go_verse(idx){
	const dv_verses = document.getElementById("id_verses");
	const all_bibobj = dv_verses.all_bibobj;
	if(all_bibobj == null){
		console.error("all_bibobj == null");
		return;
	}
	if(all_bibobj.length == 0){
		console.error("all_bibobj.length == null");
		return;
	}
	if((all_bibobj.length - 1) < idx){
		console.error("(all_bibobj.length - 1) < idx");
		return;
	}
	const bibobj = all_bibobj[idx];
	const dv_ver = document.getElementById(bibobj.id_dv_ver);
	scroll_to_top(dv_ver, dv_verses);
	scroll_to_top(dv_verses);
}

function toggle_show_message(msg){
	const dv_select = document.getElementById(id_select);
	const dv_href = get_new_dv_under(dv_select, id_show_message, "force");
	if(dv_href == null){
		return;
	}
	dv_href.classList.add("search_info");

	dv_href.innerHTML = msg;
	
	setTimeout(() => {
		dv_href.remove();
	}, 3000);

	dv_href.scrollIntoView({ behavior: 'smooth', block: 'center'});
	//scroll_to_top(dv_href);
}

