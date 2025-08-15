
import { get_new_dv_under, scroll_to_top, toggle_select_option, get_opt_id, 
} from './sf_select_option_mgr.js';

import { verse_to_min_greek, verse_to_may_greek, verse_to_hebrew, get_text_analysis, make_strong_ref, get_scode_def, get_citation, 
	get_scode_mutus, get_scode_roots, get_next_scode, get_prev_scode, fill_bibobj_vtxt, local_scod_bibles, get_verse_refs, 
} from './sf_bible_mgr.js';

import { init_lang, } from './sf_lang_mgr.js';
import { init_biblang, eval_biblang_command, set_biblang_conf, verse_disp, get_txt_matches, 
	conf_to_mini, mini_to_conf, encode_mini, decode_mini, OT_nams, NT_nams, LOC_nams, add_dbg_log, 
} from './sf_biblang_mgr.js'

//import { keyb_handler, 
//} from './sf_tokenizer.js';
/*
id_search
id_old_test
id_new_test
id_loc_bib
id_select
id_find

*/
const DEBUG_FILL_VERSES = false;
const DEBUG_TEXT_ANA = false;
const DEBUG_SCODS = false;
const DEBUG_POP_MENU = false;
const DEBUG_FILL_SPARTS = false;
const DEBUG_VERSE_REFS = false;
const DEBUG_HREFS = false;

export let gvar = {};


const GET_var_expr = "biblang";
const GET_var_conf = "conf";

const PERSISTANT_STATE = true;		// DO NOT CHANGE. ONLY FOR DEBUGGING CHANGE TO false.
const STORAGE_STATE_ID = "STORAGE_STATE_ID";

const SUF_SCOD_DEF = "_scod_def";
const SUF_VERSE_TXT = "_verse_txt";

const id_grid_text_analysis = "id_grid_text_analysis";
const id_pop_menu_sele = "id_pop_menu_sele";
const id_select = "id_select";
const id_dbg_data = "id_dbg_data";
const id_history = "id_history";
const id_menu_tok = "id_menu_tok";
const id_header = "id_header";
const id_info = "id_info";
const id_scodes = "id_scodes";
const id_del_expr = "id_del_expr";
const id_menu_scod_def = "id_menu_scod_def";
const id_menu_mutus = "id_menu_mutus";
const id_search_href = "id_search_href";
const id_dv_evaluating = "id_dv_evaluating";
const id_evaluating_bar = "id_evaluating_bar";
const id_evaluating_name = "id_evaluating_name";
const id_examples = "id_examples";
const id_tra_txt = "id_tra_txt";
const id_verse_refs = "id_verse_refs";

const GREEK_PREFIX = "G";
const SCOD_PREFIX = "[";
const SCOD_SUFIX = "]";

const tra_class = {
	"Ben": "is_bh_en_tra",
	"B2es": "is_bh_en2es_tra",
	"Sen": "is_stg_en_tra",
	"Ses": "is_stg_es_tra",
	"LOC": "is_stg_loc_tra",
};

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

function set_ui_rx_in(dv_rx_in, cod){
	const dv_out_txt = document.getElementById("id_out_txt");
	if(cod == "OT"){
		set_ui_rx_cls(dv_rx_in, "is_match_ot");
		set_ui_rx_cls(dv_out_txt, "is_match_ot");
	}
	if(cod == "NT"){
		set_ui_rx_cls(dv_rx_in, "is_match_nt");
		set_ui_rx_cls(dv_out_txt, "is_match_nt");
	}
	if(cod == "LOC"){
		set_ui_rx_cls(dv_rx_in, "is_match_loc");
		set_ui_rx_cls(dv_out_txt, "is_match_loc");
	}
}

function set_ui_tra(dv_tra, cod){
	
	const all_rem = Object.values(tra_class);
	dv_tra.classList.remove(...all_rem);
	if(tra_class[cod] != null){
		dv_tra.classList.add(tra_class[cod]);
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

function add_menu(dv_menu, ops_menu, update_fn){
	dv_menu.addEventListener('click', function() {
		const all_ops = Object.values(ops_menu);
		if(dv_menu.get_options_fn != null){
			dv_menu.get_options_fn(all_ops);
		}
		let cls_itm = null;
		if(dv_menu.set_cls_itm_fn != null){
			cls_itm = dv_menu.set_cls_itm_fn;
		}
		toggle_select_option(dv_menu, id_crit_sele, all_ops, function(dv_ret, dv_ops, val_sel, idx_sel){
			set_selec(dv_ret, val_sel);
			dv_ops.remove();
		}, null, cls_itm);
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
		set_ui_rx_in(dv_itm, cod);
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

function init_menus(){
	
	const dv_old_tes = document.getElementById("id_old_test");
	dv_old_tes.classList.add("is_match_ot");
	add_menu(dv_old_tes, gvar.old_crit_txt);
	const dv_new_tes = document.getElementById("id_new_test");
	dv_new_tes.classList.add("is_match_nt");
	add_menu(dv_new_tes, gvar.new_crit_txt);
	const dv_loc_bib = document.getElementById("id_loc_bib");
	dv_loc_bib.classList.add("is_match_loc");
	add_menu(dv_loc_bib, gvar.loc_bible);
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	dv_rx_tgt.get_options_fn = get_tgt_rx_options;
	dv_rx_tgt.update_ui_fn = set_ui_rx_in;
	dv_rx_tgt.set_cls_itm_fn = set_rxtgt_cls_itm_ui;
	add_menu(dv_rx_tgt, gvar.tgt_rx, get_tgt_rx_options);
	set_ui_rx_in(dv_rx_tgt, dv_rx_tgt.innerHTML.trim());
	const dv_out_txt = document.getElementById("id_out_txt");
	add_menu(dv_out_txt, gvar.out_txt);
	
	const dv_tra_txt = document.createElement("div");
	dv_out_txt.after(dv_tra_txt);
	
	dv_tra_txt.id = id_tra_txt;
	dv_tra_txt.classList.add("bib_item", "is_option");
	dv_tra_txt.innerHTML = "Ben";
	dv_tra_txt.update_ui_fn = (dv_ret, cod) => {
		set_ui_tra(dv_ret, cod);
		refresh_text_analysis();
	};
	dv_tra_txt.set_cls_itm_fn = set_tra_cls_itm_ui;
	add_menu(dv_tra_txt, gvar.tra_txt);
	set_ui_tra(dv_tra_txt, dv_tra_txt.innerHTML.trim());

	//dv_out_txt.insertAdjacentElement('afterend', dv_tab);
	
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
	
	const dv_select = document.getElementById(id_select);
	dv_select.addEventListener('click', async function() {
		await do_select();
		return;
	});

	inp_box.addEventListener('keydown', async function(ev) {
		if(ev.key === "Enter"){
			await do_select();
		}
		return;
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
	const rxtgt = dv_rx_tgt.innerHTML.trim();
	const dv_out_txt = document.getElementById("id_out_txt");
	const otxt = dv_out_txt.innerHTML.trim();
	const dv_expr = document.getElementById(id_expression);
	const expr = dv_expr.value.trim();

	const rxin = rxtgt.toLowerCase();
	const txtout = otxt.toLowerCase();
	
	const conf = {};
	conf.curr_OT = oldt;
	conf.curr_NT = newt;
	conf.curr_LOC = loc_bib;
	conf.regex_input = rxin;
	conf.output = txtout;
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
		dv_rx_tgt.innerHTML = conf.regex_input.toUpperCase();
		set_ui_rx_in(dv_rx_tgt, dv_rx_tgt.innerHTML.trim());
	}
	const dv_out_txt = document.getElementById("id_out_txt");
	if(conf.output != null){
		dv_out_txt.innerHTML = conf.output.toUpperCase();
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
	const rxtgt = dv_rx_tgt.innerHTML.trim();
	const dv_out_txt = document.getElementById("id_out_txt");
	const otxt = dv_out_txt.innerHTML.trim();
	const dv_expr = document.getElementById(id_expression);
	const expr = dv_expr.value.trim();
	
	const rxin = rxtgt.toLowerCase();
	const txtout = otxt.toLowerCase();
	
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
		conf.output = txtout;
	}
	//let comm = `.${oldt} ; .${newt} ; .${loc_bib} ; :${rxin} ; .${txtout} ; ${expr}`;
	//start_biblang_command();		
	const bl_obj = await eval_biblang_command(expr, conf);
	
	fill_search_info(bl_obj);
	await fill_verses(bl_obj);

	//end_biblang_command();
	
	if(dv_dbg_log != null){
		toggle_dbg_info("keep");
	}	
	
	const dv_hist = document.getElementById(id_history);
	if(dv_hist != null){
		toggle_history_info("keep");
	}
}

function init_handlers(){
	const dv_verses = document.getElementById("id_verses");
	dv_verses.addEventListener('wheel', function(ev) {
		ev.stopPropagation();
	});
}

export async function start_srch_mgr(curr_lang){
	init_lang(curr_lang);
	init_biblang(curr_lang);
	init_menus();
	if(PERSISTANT_STATE){ read_storage_state(); }
	init_handlers();
	
	if(PERSISTANT_STATE){ window.addEventListener('beforeunload', write_storage_state); }
	
	const conf = set_search_from_url();
	if(conf != null){
		await do_select(conf);
	}
}

function get_conversion_func(){
	let otxt = gvar.biblang.output.toUpperCase();
	const rxi_val = gvar.biblang.regex_input.toUpperCase();
	if(rxi_val == "LOC"){
		otxt = "ASC";
	}
}

function verse_cod2obj(vrs_cod){
	const cod_ver = vrs_cod.split(':');
	const id_ver = cod_ver.join('_');
	const bibobj = {};
	
	//bibobj.bible = bib_ot;
	
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
		
	return bibobj;
}

async function fill_sdefs(bl_obj){
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
		//dv_def.classList.add("txt_ana_full_item");
		const sdef = await get_scode_def(scod, lang);
		
		const sco_txt = conv_fn_nt(sdef.asc);
		//const href_sco = make_strong_ref(scod);
		//const htm = `<a class="exam_ref big_font" href="${href_sco}" target="_blank">${scod}</a> <span>${sco_txt}</span>: ${sdef.def}`;
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
	/*if(has_vrs){
		if(! has_ocu && ! has_sco){
			dv_info.remove();
			return;
		}
	}*/
	
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
	}
	
}

async function fill_verses(bl_obj){
	const all_vrs = bl_obj.lverses;
	const oldt = gvar.biblang.curr_OT;
	const newt = gvar.biblang.curr_NT;
	const loc_bib = gvar.biblang.curr_LOC;
	let otxt = gvar.biblang.output.toUpperCase();
	const dv_old_tes = document.getElementById("id_old_test");
	dv_old_tes.innerHTML = oldt;
	const dv_new_tes = document.getElementById("id_new_test");
	dv_new_tes.innerHTML = newt;
	const dv_loc_bib = document.getElementById("id_loc_bib");
	dv_loc_bib.innerHTML = loc_bib;
	
	const rxi_val = gvar.biblang.regex_input.toUpperCase();

	if(rxi_val == "LOC"){
		otxt = "ASC";
	}
	
	const dv_out_txt = document.getElementById("id_out_txt");
	dv_out_txt.innerHTML = otxt;
	
	const dv_rx_tgt = document.getElementById("id_rx_tgt");
	dv_rx_tgt.innerHTML = rxi_val;
	set_ui_rx_in(dv_rx_tgt, dv_rx_tgt.innerHTML.trim());
	
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
	
	const dv_verses = document.getElementById("id_verses");
	dv_verses.innerHTML = "";

	if(all_vrs.length == 0){
		dv_verses.innerHTML = gvar.all_msg.no_verses;
	}
	
	scroll_to_top(dv_verses);

	gvar.biblang.prog_bar.part_name = gvar.all_msg.adding_verses;
	const tot_verses = all_vrs.length;
	//update_ev_bar(0, tot_verses);

	if(DEBUG_FILL_VERSES){
		console.log("fill_verses. bib_ot=" + bib_ot);
		console.log("fill_verses. bib_nt=" + bib_nt);
	}	
	
	let ii = 0;
	for(ii = 0; ii < all_vrs.length; ii++){
		//update_ev_bar(ii, tot_verses);
		const bibobj = verse_cod2obj(all_vrs[ii]);
		const dv_ver = document.createElement("div");
		dv_ver.id = bibobj.id_dv_ver;
		dv_ver.innerHTML = bibobj.id_dv_ver;
		dv_verses.appendChild(dv_ver);
		
		bibobj.ui_idx = ii;
		bibobj.bible = bib_ot;
		let conv_fn = conv_fn_ot;
		if(bibobj.book > 39){
			bibobj.bible = bib_nt;
			conv_fn = conv_fn_nt;
		}
		if(conv_fn != null){
			bibobj.conv_fn = conv_fn;
		}
		
		await fill_bibobj_vtxt(bibobj);
		
		add_ui_bibobj(bibobj, dv_ver, conv_fn, bl_obj)		
	}
	
	await fill_sdefs(bl_obj);
}
	
function pop_menu_handler(){
	const dv_pop_sec = document.getElementById("id_pop_opt_sec");

	let dv_pop_men = null;
	dv_pop_men = get_new_dv_under(dv_pop_sec, id_pop_menu_sele);
	if(dv_pop_men == null){
		if(DEBUG_POP_MENU){ console.log("toggle_pop_menu OFF"); }
		return;
	}
	
	let op = document.createElement("div");
	op.classList.add("exam", "is_block", "big_item");
	op.innerHTML = gvar.all_msg.history;
	op.addEventListener('click', toggle_history_info);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.classList.add("exam", "is_block", "big_item");
	op.innerHTML = gvar.all_msg.books;
	op.addEventListener('click', toggle_books_info);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.classList.add("exam", "is_block", "big_item");
	op.innerHTML = gvar.all_msg.examples;
	op.addEventListener('click', toggle_examples);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.classList.add("exam", "is_block", "big_item");
	op.innerHTML = gvar.all_msg.debug;
	op.addEventListener('click', toggle_dbg_info);
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.classList.add("exam", "is_block", "big_item");
	op.innerHTML = gvar.all_msg.copy_link;
	op.addEventListener('click', async () => {
		await get_href();
	});
	dv_pop_men.appendChild(op);
	
	op = document.createElement("div");
	op.classList.add("exam", "is_block", "big_item");
	op.innerHTML = gvar.all_msg.show_link;
	op.addEventListener('click', () => {
		const dv_select = document.getElementById(id_select);
		var dv_href = get_new_dv_under(dv_select, id_search_href);
		if(dv_href == null){
			return;
		}
		dv_href.classList.add("search_info");
		const hrf = get_search_href();
		dv_href.innerHTML = hrf;
	});
	dv_pop_men.appendChild(op);
	
	scroll_to_top(dv_pop_men);
}

function toggle_history_info(toggle_op){
	const dv_expr = document.getElementById(id_expression);
	let his_vals = gvar.biblang.history.map((itm) => itm.expr);
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		dv_expr.value = val_sel;
		//const idx_conf = dv_ops
		const conf = gvar.biblang.history[idx_sel].conf;
		await do_select(conf);
		//dv_ops.remove();
	}
	if(his_vals.length == 0){
		his_vals = ["NO DATA TO SHOW. Do a search first."];
		clk_fn = null;
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	toggle_select_option(dv_select, id_history, his_vals, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
}

function toggle_examples(toggle_op){
	const dv_expr = document.getElementById(id_expression);
	let his_vals = gvar.examples;
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		dv_expr.value = val_sel;
		await do_select();
	}
	if(his_vals.length == 0){
		his_vals = ["NO DATA TO SHOW. Do a search first."];
		clk_fn = null;
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	toggle_select_option(dv_select, id_examples, his_vals, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
}

function toggle_books_info(){
	const dv_expr = document.getElementById(id_expression);
	let abbr = Object.keys(gvar.abbr2num);
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		add_to_expr(val_sel);
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = ["is_option"];
	const dv_select = document.getElementById(id_select);
	toggle_select_option(dv_select, "id_books", abbr, clk_fn, cls_men, cls_itm);
}

function toggle_dbg_info(toggle_op){
	let log = gvar.biblang.dbg_log;
	let clk_fn = null;
	if(log.length == 0){
		log = [`NO DATA TO SHOW. Run a command.`];
	}
	const cls_men = ["aux_item", "has_border"];
	const cls_itm = [];
	const dv_select = document.getElementById(id_select);
	const dv_to_scroll = null;
	toggle_select_option(dv_select, id_dbg_data, log, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
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
	
	//const full_ana = await get_text_analysis(bibobj, bl_obj);		
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
	if(bibobj.conv_fn != null){
		cri = bibobj.conv_fn(tok.id);
	}
	let bib_cri = bibobj.cri_txt;
	let is_deleted = false;
	if(! tok.comm && ! is_added && (bib_cri != "LXX")){
		bib_cri = "BH";
		is_deleted = true;
	}
	
	const t1 = add_tok_item(dv_ana, 1, cri, is_added, is_deleted);
	const t2 = add_tok_item(dv_ana, "auto", tok.id, is_added, is_deleted, true);
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
		const cls = tra_class[tok.dict];
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

function toggle_scod_menu(dv_up, bibobj, tok){
	if(tok.sco.length == 0){
		return null;
	}
	const dv_expr = document.getElementById(id_expression);
	const ops = gvar.tok_ops_scod; // ["select", "add", "biblehub"];
	let clk_fn = async function(dv_ret, dv_ops, val_sel, idx_sel){
		let the_expr = null;
		if(idx_sel == 0){
			dv_expr.value = tok.sco;
			await do_select();
		}
		if(idx_sel == 1){
			add_to_expr(tok.sco);
		}
		if(idx_sel == 2){
			// go to biblehub
			const href_sco = make_strong_ref(tok.sco);
			window.open(href_sco, '_blank');
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

function insert_all_tags(vs_txt, vs_ocu, cls){
	const socu = vs_ocu.sort(cmp_ocurrence);

	const ini_tag = `<span class="${cls}">`;
	const end_tag = `</span>`;
	
	let htm = { txt: vs_txt, disp: 0, lpos: 0, };
	let ii = 0;
	for(; ii < vs_ocu.length; ii++){
		const ocu = vs_ocu[ii];
		insert_tag(htm, ocu.idx, ini_tag);
		const end_pos = ocu.idx + ocu.lng;
		insert_tag(htm, end_pos, end_tag);
	}
	
	return htm;
}

function set_css_matches(vs_txt, bibobj, bl_obj){
	if(vs_txt == null){	return vs_txt; }
	if(bl_obj.all_ocu == null){	return vs_txt; }
	if(bibobj.bible == null){ return vs_txt; }
	let bib = bibobj.bible;
	
	let cls = "is_match_loc";
	if(OT_nams[bib] != null){
		cls = "is_match_ot";
	}
	if(NT_nams[bib] != null){
		cls = "is_match_nt";
	}
	
	if(bl_obj.all_ocu[bib] == null){ 
		bib += "i";
		if(bl_obj.all_ocu[bib] == null){ return vs_txt; }
	}
	
	const vs_id = "" + bibobj.book + ":" + bibobj.chapter + ":" + bibobj.verse;
	if(bl_obj.all_ocu[bib][vs_id] == null){ return vs_txt; }
	
	const vs_ocu = bl_obj.all_ocu[bib][vs_id];
	
	const htm = insert_all_tags(vs_txt, vs_ocu, cls);
	return htm.txt;
	
	/*
	const socu = vs_ocu.sort(cmp_ocurrence);

	const ini_tag = `<span class="${cls}">`;
	const end_tag = `</span>`;
	
	let htm = { txt: vs_txt, disp: 0, lpos: 0, };
	let ii = 0;
	for(; ii < vs_ocu.length; ii++){
		const ocu = vs_ocu[ii];
		insert_tag(htm, ocu.idx, ini_tag);
		const end_pos = ocu.idx + ocu.lng;
		insert_tag(htm, end_pos, end_tag);
	}
	
	return htm.txt;
	*/
}

function toggle_scod_actions(dv_def, scod){
	const id_menu = id_menu_scod_def;
		
	const ops = gvar.ops_def_scod; // ["prv", "nxt", "roots", "mutual", "encuentra", "adicionar", "bh"]
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
			dv_expr.value = scod;
			await do_select();
		}
		if(idx_sel == 5){
			add_to_expr(scod);
		}
		if(idx_sel == 6){
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

function toggle_scod_subops(dv_parent_ops, scod, id_menu, idx_sel, sub_ops){
	const opt_id = get_opt_id(id_menu, idx_sel);
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
	toggle_select_option(dv_opt, id_menu_mutus, sub_ops, clk_fn, cls_men, cls_itm, dv_to_scroll, toggle_op);
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

function add_ui_bibobj(bibobj, dv_ver, conv_fn, bl_obj){
	
	const vhref = bibobj.href_bh;
	let vcit = "INVALID_BIBLE_CITATION";
	if(bibobj.vcit != null){
		vcit = `<b>${bibobj.vcit}</b>`;
	}
	let vtxt = "INVALID_BIBLE_TEXT";
	if(bibobj.vtxt != null){
		vtxt = bibobj.vtxt;
		if(conv_fn != null){
			vtxt = conv_fn(vtxt);
		}
		vtxt = set_css_matches(vtxt, bibobj, bl_obj);
	}
	
	const butt_classes = ["is_verse_oper"];
	
	dv_ver.innerHTML = "";
	
	add_ui_disp(dv_ver, bibobj, 10, vcit, ["is_verse_cit"]);
	//add_ui_disp(dv_ver, bibobj, 10, "(10)", butt_classes);
	add_ui_disp(dv_ver, bibobj, 20, "(20)", butt_classes);
	add_ui_disp(dv_ver, bibobj, 40, "(40)", butt_classes);

	let dv_itm = null;
	
	dv_itm = document.createElement("div");
	dv_itm.classList.add(...butt_classes);
	dv_itm.innerHTML = "refs";
	dv_itm.addEventListener('click', function() {
		toggle_refs_menu(dv_itm, bibobj);
	});		
	dv_ver.appendChild(dv_itm);
	
	dv_itm = document.createElement("div");
	dv_itm.classList.add(...butt_classes);
	dv_itm.innerHTML = gvar.biblehub_butt;
	dv_itm.addEventListener('click', function() {
		window.open(vhref, '_blank');
	});		
	dv_ver.appendChild(dv_itm);

	vtxt = `<b>${vtxt}</b>`;
	
	const dv_txt = document.createElement("div");
	dv_txt.id = dv_ver.id + SUF_VERSE_TXT;
	dv_txt.innerHTML = vtxt;
	dv_txt.orig_txt = vtxt;
	if(conv_fn == verse_to_hebrew){
		dv_txt.classList.add("in_right");
	}
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

async function get_href(){
	try{
		const hrf = get_search_href();
		if(hrf != null){
			await navigator.clipboard.writeText(hrf);
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

function fill_strong_parts(bibobj){
	if(bibobj.dict != "LOC"){
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
		ops = refs.split(" ").map((vid) => get_vid_citacion(vid));
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

