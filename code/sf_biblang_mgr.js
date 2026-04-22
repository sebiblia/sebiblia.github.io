

import { isArgumentsArray, ExpressionParser } from './sf_expression_parser.js'
import { gvar, update_evaluating_bar, } from './sf_search_mgr.js';
import { bib_chapter_sizes, } from './sf_bib_chapter_sizes.js';
import { get_bible_verse, get_scode_verses, dbg_log_all_loaded_files, calc_vstxt, import_crono_bib, } from './sf_bible_mgr.js';
import { distance, closest,  } from './sf_word_dist.js';

const DEBUG_MATCHES = false;
const DEBUG_GET_RANGE = false;
const DEBUG_SCOD_IDX = false;
const DEBUG_FOLLOWED = false;
const DEBUG_PARSER = false;

const DEFAULT_HIS_MAX_SZ = 1000;

const NUM_OCU_UPDATE_BAR = 10000;

const GREEK_PREFIX = "G";
const GET_TOK = "GET_TOK";

const SCOD_VERSES_SUFIX = "_sv";
const SCOD_SVERSES_SUFIX = "_S";

const MIN_VERSE = [1, 1, 1];
const MAX_VERSE = [66, 22, 21];

const CRONO_TOT_VERSES = 31370;
const CRONO_PAGE_SZ = 20;

let ALL_BOOK_NAMES = [];

const biblang_def = {
	INFIX_OPS: {
		'*': (a, b) => calc_before_any(a, b),
		'%': (a, b) => calc_followed_by(a, b),
		'&': (a, b) => calc_and(a, b),
		'|': (a, b) => calc_or(a, b, '|'),
		'!': (a, b) => calc_not(a, b),
		';': (a, b) => calc_or(a, b, ';'),
		'=': (a, b) => calc_asig(a, b),
		'::': (a, b) => calc_range(a, b),
		'..': (a, b) => calc_comment(a, b),
	},
	PREFIX_OPS: {
		// '#': (bib) => set_bib(bib),
	},
	PRECEDENCE: [['::'], ['!'], ['|'], ['&'], ['%'], ['*'], ['='], [';'], ['..']],
	LITERAL_OPEN: '/',
	LITERAL_CLOSE: '/',
	GROUP_OPEN: '(',
	GROUP_CLOSE: ')',
	SEPARATORS: [';', '!', '|', '&', '%', '*'],
	WHITESPACE_CHARS: [' '],
	SYMBOLS: ['(', ')', '/'],
	AMBIGUOUS: {},
	 
	termDelegate: function(term, prev) {
		return calc_base_term(term, prev);
	},
	descriptions: [
		/*{
			op: '.',
			fix: 'prefix',
			sig: ["base: Number", "exponent: Number", "Number"],
			text: "Returns the result of raising the base to the exponent: POW(base, exponent).",
		},*/
	],
};

const conf2mini = {
	curr_OT: 'O',
	curr_NT: 'N',
	curr_LOC: 'L',
	presentation: 'P',
	regex_input: 'i',
	size_output: 's',
	regex_insensitive: 'r',
	intervals: 'I',
};

const mini2conf = {};

const ibibs = {
	"RVA":"RVAi",
	"RVAs":"RVAsi",
	"SBLM":"SBLMi",
};

export const OT_nams = {
	"WLC":1,
	"ALE":1,
	"TKH":1,
	"LXX":1,		// CAREFUL. if you change this, then also file "LXX" occurences.
};

export const NT_nams = {
	"BYZ":1,
	"TR":1,
	"WH":1,
	"NES":1,
};

export const LOC_nams = {
	"RVA":1,
	"RVAs":1,
	"SBLM":1,
	"KJV":1,
	"KJVs":1,
	"WEB":1,
};

const out_nams = {
	"asc":1,
	"min":1,
	"may":1,
};

const size_nams = {
	"sco":1,
	"rx":1,			// CAREFUL. if you change this, then also file "size_output.rx" occurences.
	"wd":1,			// CAREFUL. if you change this, then also file "size_output.wd" occurences.
	"his":1,			// CAREFUL. if you change this, then also file "size_output.his" occurences.
};

const loc_input = "loc";
const ot_input = "ot";
const nt_input = "nt";
const sco_input = "sco";

const rx_in_nams = {
	"loc":1,	// use loc_input to locate and compare
	"ot":1,		// use ot_input to locate and compare
	"nt":1,		// use nt_input to locate and compare
	"sco":1,	// use sco_input to locate and compare
};

const rx_insen = "rxi";
const rx_sensi = "rxs";
const dbg_lang = "dbg";
const inc_crono = "inc_crono";
const dec_crono = "dec_crono";
const nodbg_lang = "nodbg";
const reset_history = "rhis";
const open_text_analysis = "txta";
const format_desc = "f:";

const range_nams = {
	"all":[],
	"ot":[],
	"nt":[],
	"pa":[45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57],	// paul or pablo
	"ev":[40, 41, 42, 43],	// evangelios or evangelio (gospel)
};

const book_sizes = [];

function init_book_sizes(){
	const cha_sz = bib_chapter_sizes;
	book_sizes.push(0);
	let ii = 1;
	for(; ii <= 66; ii++){
		const all_chap = Object.values(cha_sz[ii]);
		const bk_sz = all_chap.reduce((tot, sz) => tot + sz, 0);
		book_sizes.push(bk_sz);
	}
}

function init_ranges(){
	range_nams.all = [];
	const rng_all = range_nams.all;
	let ii = 1;
	for(; ii <= 66; ii++){
		rng_all.push(ii);
	}

	range_nams.ot = [];
	const rng_ot = range_nams.ot;
	ii = 1;
	for(; ii <= 39; ii++){
		rng_ot.push(ii);
	}

	range_nams.nt = [];
	const rng_nt = range_nams.nt;
	ii = 40;
	for(; ii <= 66; ii++){
		rng_nt.push(ii);
	}
}

function size_outputs_to_all(){
	const sizes = Object.keys(size_nams);
	
	if(gvar.biblang.size_output == null){ gvar.biblang.size_output = {}; }
	let ii = 0;
	for(ii = 0; ii < sizes.length; ii++){
		const kk = sizes[ii];
		gvar.biblang.size_output[kk] = "all";
	}
}

function update_size_outputs_from(out_sizes){
	if(out_sizes == null){
		return;
	}
	const sizes = Object.keys(size_nams);
	
	if(gvar.biblang.size_output == null){ gvar.biblang.size_output = {}; }
	let ii = 0;
	for(ii = 0; ii < sizes.length; ii++){
		const kk = sizes[ii];
		if(out_sizes[kk] != null){
			gvar.biblang.size_output[kk] = out_sizes[kk];
		}
	}
}

export function reset_curr_range(){
	gvar.biblang.curr_range = JSON.parse(JSON.stringify(range_nams.all));
}

function reset_texta(){
	gvar.biblang.txta_verse = null;
	gvar.biblang.txta_rx = null;
}

function reset_presentation(){
	gvar.biblang.changed_presentation = false;
	gvar.biblang.presentation = "asc";
}

function reset_curr_rx_insensitive(){
	gvar.biblang.regex_insensitive = true;
}

function reset_crono(){
	gvar.biblang.crono_op = false;
}

function init_history(){
	if(gvar.biblang == null){ gvar.biblang = {}; }
	gvar.biblang.history = [];
	gvar.biblang.size_output.his = DEFAULT_HIS_MAX_SZ;
}

function get_his_max_sz(){
	if(gvar.biblang == null){ gvar.biblang = {}; }
	if(gvar.biblang.size_output == null){ gvar.biblang.size_output = {}; }
	if(gvar.biblang.size_output.his == null){ gvar.biblang.size_output.his = DEFAULT_HIS_MAX_SZ; }
	const maxsz = Number(gvar.biblang.size_output.his);
	return maxsz;
}

function init_dbg_conf(){
	gvar.biblang.dbg_log = [];
	gvar.biblang.size_output.dbg = 1000;
}

function init_biblang_conf(){
	gvar.biblang.curr_OT = "WLC";
	gvar.biblang.curr_NT = "BYZ";
	gvar.biblang.curr_LOC = gvar.biblang.default_LOC;
	
	gvar.biblang.changed_presentation = false;
	gvar.biblang.presentation = "asc";
	gvar.biblang.regex_input = "loc";
	
	size_outputs_to_all();
	
	gvar.biblang.regex_insensitive = true;

	reset_crono();
	reset_curr_range();
}

function get_biblang_conf(){
	const conf = {};
	conf.curr_OT = gvar.biblang.curr_OT;
	conf.curr_NT = gvar.biblang.curr_NT;
	conf.curr_LOC = gvar.biblang.curr_LOC;

	conf.presentation = gvar.biblang.presentation;
	conf.regex_input = gvar.biblang.regex_input;
	conf.size_output = JSON.parse(JSON.stringify(gvar.biblang.size_output));
	
	conf.regex_insensitive = gvar.biblang.regex_insensitive;
	conf.curr_range = JSON.parse(JSON.stringify(gvar.biblang.curr_range));	
	conf.intervals = range_to_intervals(conf.curr_range);
	
	return conf;
}

export function set_biblang_conf(conf){
	if(conf == null){ return; }
	if(conf.curr_OT != null){ gvar.biblang.curr_OT = conf.curr_OT; }
	if(conf.curr_NT != null){ gvar.biblang.curr_NT = conf.curr_NT; }
	if(conf.curr_LOC != null){ gvar.biblang.curr_LOC = conf.curr_LOC; }

	//if(conf.presentation != null){ gvar.biblang.presentation = conf.presentation; }
	if(conf.regex_input != null){ gvar.biblang.regex_input = conf.regex_input; }
	update_size_outputs_from(conf.size_output);
	
	if(conf.regex_insensitive != null){ gvar.biblang.regex_insensitive = conf.regex_insensitive; }
	if(conf.curr_range != null){
		gvar.biblang.curr_range = JSON.parse(JSON.stringify(conf.curr_range));
	}
}

function fill_reversed_object(orig, reverse){
	for (const [key, value] of Object.entries(orig)) {
		reverse[value] = key;
	}  
}

export function init_biblang(lng){
	if(gvar.biblang == null){ gvar.biblang = {}; }

	gvar.biblang.default_LOC = "WEB";
	if(lng == 'es'){
		gvar.biblang.default_LOC = "SBLM";
	}
	
	fill_reversed_object(conf2mini, mini2conf);
	
	gvar.biblang.parser = new ExpressionParser(biblang_def);
	
	init_book_names();
	init_book_sizes();
	init_ranges();
	init_biblang_conf();
	init_history();
	init_dbg_conf();
}

function init_book_names(){
	const n1 = Object.keys(gvar.abbr2num);
	const n2 = Object.keys(gvar.book2num);
	
	ALL_BOOK_NAMES  = [...new Set([...n1, ...n2])];
}

export function cmp_verses(vv1, vv2){
	const v1 = vv1.split(":");
	const v2 = vv2.split(":");
	let cv = (v1[0] - v2[0]);
	if(cv != 0){
		return cv;
	}
	cv = (v1[1] - v2[1]);
	if(cv != 0){
		return cv;
	}
	cv = (v1[2] - v2[2]);
	return cv;
}

function arr_intersec(aa, bb){
	if((aa == null) && (bb == null)){ return null; }
	if(aa == null){ return bb; }
	if(bb == null){ return aa; }
	return aa.filter(ee => bb.includes(ee));
}

function arr_union(aa, bb){
	if((aa == null) && (bb == null)){ return null; }
	if(aa == null){ return bb; }
	if(bb == null){ return aa; }
	return [...new Set([...aa, ...bb])];
}

function arr_diff(aa, bb){
	if((aa == null) && (bb == null)){ return null; }
	if(aa == null){ return bb; }
	if(bb == null){ return aa; }
	return aa.filter(ee => ! bb.includes(ee));
}

async function calc_before_any(aa, bb){
	gvar.biblang.add_scod = true;
	const oaa = await aa();
	gvar.biblang.add_scod = false;
	gvar.biblang.add_scod = true;
	const obb = await bb();
	gvar.biblang.add_scod = false;
	
	const rop = "(" + oaa.op + " % " + obb.op + ")";
	
	const vaa = oaa.lverses;
	
	let vfoll = null;
	let all_idx = null;
	
	if(oaa.lscods != null){
		if(oaa.all_idx != null){
			all_idx = oaa.all_idx;
		} else {
			all_idx = await calc_scod_idx(vaa, oaa.lscods);
		}
		calc_scod_idx_before_any(all_idx, obb.lscods);
		vfoll = Object.keys(all_idx);
	}
	if(vfoll == null){
		vfoll = arr_intersec(oaa.lverses, obb.lverses);
	}
	
	const robj = { op: rop, lverses: vfoll, lscods: arr_union(oaa.lscods, obb.lscods), };
	if((oaa.is_txta_oper || obb.is_txta_oper) && (vfoll.length > 0)){
		gvar.biblang.txta_verse = vfoll[0];
	}
	if(gvar.dbg_biblang){
		add_dbg_log("calc_followed_by");
		add_dbg_log(rop);
		console.log(vaa);
		console.log(oaa.lscods);
		console.log(all_idx);		
		console.log(obb.lscods);
		add_dbg_log("_____________________________");
	}
	return robj;
}
 
async function calc_followed_by(aa, bb){
	gvar.biblang.add_scod = true;
	const oaa = await aa();
	gvar.biblang.add_scod = false;
	gvar.biblang.add_scod = true;
	const obb = await bb();
	gvar.biblang.add_scod = false;
	
	const rop = "(" + oaa.op + " % " + obb.op + ")";
	
	const vaa = oaa.lverses;
	
	let vfoll = null;
	let all_idx = null;
	
	if(oaa.lscods != null){
		if(oaa.all_idx != null){
			all_idx = oaa.all_idx;
		} else {
			all_idx = await calc_scod_idx(vaa, oaa.lscods);
		}
		calc_scod_idx_followed_by(all_idx, obb.lscods);
		vfoll = Object.keys(all_idx);
	}
	if(vfoll == null){
		vfoll = arr_intersec(oaa.lverses, obb.lverses);
	}
	
	const robj = { op: rop, lverses: vfoll, lscods: arr_union(oaa.lscods, obb.lscods), };
	if((oaa.is_txta_oper || obb.is_txta_oper) && (vfoll.length > 0)){
		gvar.biblang.txta_verse = vfoll[0];
	}
	if(gvar.dbg_biblang){
		add_dbg_log("calc_followed_by");
		add_dbg_log(rop);
		console.log(vaa);
		console.log(oaa.lscods);
		console.log(all_idx);		
		console.log(obb.lscods);
		add_dbg_log("_____________________________");
	}
	return robj;
}
 
async function calc_and(aa, bb){
	const oaa = await aa();
	//const obb = await bb();
	const obb = await bb(oaa);

	const rop = "(" + oaa.op + " & " + obb.op + ")";
	
	const vaa = oaa.lverses;
	const vbb = obb.lverses;
	const vand = arr_intersec(vaa, vbb);
	
	if(gvar.dbg_biblang){
		add_dbg_log("calc_and");
		add_dbg_log(rop);
		console.log(vaa);
		console.log(vbb);
		console.log(vand);
		add_dbg_log("_____________________________");
	}
	const robj = { op: rop, lverses: vand, lscods: arr_union(oaa.lscods, obb.lscods), };
	if((oaa.is_txta_oper || obb.is_txta_oper) && (vand.length > 0)){
		gvar.biblang.txta_verse = vand[0];
	}
	return robj;
}
 
async function calc_or(aa, bb, symb){
	const oaa = await aa();
	const obb = await bb();
	
	const rop = "(" + oaa.op + ` ${symb} ` + obb.op + ")";
	
	const vaa = oaa.lverses;
	const vbb = obb.lverses;
	const vor = arr_union(vaa, vbb);
	
	if(gvar.dbg_biblang){
		add_dbg_log("calc_or");
		add_dbg_log(rop);
		console.log(vaa);
		console.log(vbb);
		console.log(vor);
		add_dbg_log("_____________________________");
	}
	const robj = { op: rop, lverses: vor, lscods: arr_union(oaa.lscods, obb.lscods), };
	if((oaa.is_txta_oper || obb.is_txta_oper) && (vor.length > 0)){
		gvar.biblang.txta_verse = vor[0];
	}
	return robj;
}

async function calc_asig(aa, bb){
	const oaa = await aa(GET_TOK);
	const obb = await bb();
	
	//const is_tok = (typeof oaa === "string");
	const is_tok = (oaa.is_get_tok == true);
	
	if(! is_tok){
		if(gvar.dbg_biblang){
			add_dbg_log("calc_asig");
			add_dbg_log("BAD_ASIG");
			add_dbg_log("_____________________________");
		}
		return { op: "BAD_ASIG", lverses: [], };
	}
	
	const rop = `( ${oaa.op} = ${obb.op} )`;
	const var_name = oaa.op;
	
	if(gvar.biblang.all_user_vars == null){ gvar.biblang.all_user_vars = {}; }
	
	obb.op = var_name;
	gvar.biblang.all_user_vars[var_name] = obb;
	
	const vbb = obb.lverses;
	
	if(gvar.dbg_biblang){
		add_dbg_log("calc_asig");
		add_dbg_log(rop);
		console.log(var_name);
		console.log(vbb);
		add_dbg_log("_____________________________");
	}
	return { op: rop, lverses: [], };
}

async function calc_not(aa, bb){
	const oaa = await aa();
	const obb = await bb();

	const rop = "(" + oaa.op + " ! " + obb.op + ")";
	
	const vaa = oaa.lverses;
	const vbb = obb.lverses;
	//const vtmp = vaa.filter(ee => ! vbb.includes(ee));
	const vtmp = arr_diff(vaa, vbb);
	const vnot = vtmp;
		
	if(gvar.dbg_biblang){
		add_dbg_log("calc_not");
		add_dbg_log(rop);
		console.log(vaa);
		console.log(vbb);
		console.log(vnot);
		add_dbg_log("_____________________________");
	}
	const robj = { op: rop, lverses: vnot, lscods: arr_union(oaa.lscods, obb.lscods), };
	if((oaa.is_txta_oper || obb.is_txta_oper) && (vnot.length > 0)){
		gvar.biblang.txta_verse = vnot[0];
	}
	return robj;
}

function next_book_in_range(book){
	let nx_book = book + 1;
	const rng = gvar.biblang.curr_range;
	if(rng != null){
		while((nx_book <= 66) && ! rng.includes(nx_book)){
			nx_book++;
		}
	}
	return nx_book;
}

function prev_book_in_range(book){
	let nx_book = book - 1;
	const rng = gvar.biblang.curr_range;
	if(rng != null){
		while((nx_book >= 1) && ! rng.includes(nx_book)){
			nx_book--;
		}
	}
	return nx_book;
}

function first_book_in_range(){
	const rng = gvar.biblang.curr_range;
	if(rng != null){
		gvar.biblang.curr_range = rng.sort((n1, n2) => (n1 - n2));
	}
	return next_book_in_range(0);
}

function last_book_in_range(){
	const rng = gvar.biblang.curr_range;
	if(rng != null){
		gvar.biblang.curr_range = rng.sort((n1, n2) => (n1 - n2));
	}
	return prev_book_in_range(67);
}

export function verse_disp(vr, disp){
	let out = vr;
	const dd = disp;
	while(disp > 0){
		out = inc_verse(out);
		disp--;
	}
	while(disp < 0){
		out = dec_verse(out);
		disp++;
	}
	if(out == null){
		if(dd > 0){
			return MAX_VERSE;
		}
		if(dd < 0){
			return MIN_VERSE;
		}
	}
	return out;
}

function inc_verse(vr){
	if(vr == null){
		return null;
	}
	const cha_sz = bib_chapter_sizes;
	let book = Number(vr[0]);
	let chapter = Number(vr[1]);
	let verse = Number(vr[2]);
	if(cha_sz[book] == null){
		return null;
	}
	const rng_chap = cha_sz[book][chapter];
	if(rng_chap == null){
		return null;
	}
	if(verse < rng_chap){
		return [book, chapter, verse + 1];
	} else {
		const all_chap = Object.keys(cha_sz[book]);
		const rng_book = all_chap[all_chap.length - 1];
		if(chapter < rng_book){
			return [book, chapter + 1, 1];
		} else {
			const nxt_book = next_book_in_range(book);
			//if(book < 66){
			//	return [book + 1, 1, 1];
			if(nxt_book <= 66){
				return [nxt_book, 1, 1];
			} else {
				return null;
			}
		}
	}
	return null;
}

function dec_verse(vr){
	if(vr == null){
		return null;
	}
	const cha_sz = bib_chapter_sizes;
	let book = Number(vr[0]);
	let chapter = Number(vr[1]);
	let verse = Number(vr[2]);
	if(cha_sz[book] == null){
		return null;
	}
	const chap_sz = cha_sz[book][chapter];
	if(chap_sz == null){
		return null;
	}
	if(verse > 1){
		return [book, chapter, verse - 1];
	} else {
		if(chapter > 1){
			const pchap = chapter - 1;
			const lvers = cha_sz[book][pchap];
			return [book, pchap, Number(lvers)];
		} else {
			const pbook = prev_book_in_range(book);
			if(pbook >= 1){
				const all_chap = Object.keys(cha_sz[pbook]);
				const lchap = all_chap[all_chap.length - 1];
				const lvers = cha_sz[pbook][lchap];
				return [pbook, Number(lchap), Number(lvers)];
			} else {
				return null;
			}
		}
	}
	return null;
}

export function fill_range(vr1, vr2){
	if(gvar.dbg_biblang){
		add_dbg_log("fill_range");
		add_dbg_log(vr1);
		add_dbg_log(vr2);
	}
	const fill = [];
	const v1 = vr1.split(':').map(ii => Number(ii));
	const v2 = vr2.split(':').map(ii => Number(ii));
	let vii = vr1.split(':').map(ii => Number(ii));
	while(true){
		if(vii[0] > v2[0]){
			break;
		}
		if((vii[0] == v2[0]) && (vii[1] > v2[1])){
			break;
		}
		if((vii[0] == v2[0]) && (vii[1] == v2[1]) && (vii[2] > v2[2])){
			break;
		}
		
		const vrf = vii.join(':');
		fill.push(vrf);

		vii = inc_verse(vii);
		if(vii == null){
			break;
		}
	}
	if(gvar.dbg_biblang){
		add_dbg_log("_____________________________");
	}
	return fill;
}

async function calc_range(aa, bb){
	const oaa = await aa();
	const obb = await bb();

	const rop = "(" + oaa.op + " :: " + obb.op + ")";
	
	const vaa = oaa.lverses;
	const vbb = obb.lverses;
	const r1 = vaa.sort(cmp_verses);
	const r2 = vbb.sort(cmp_verses);
	
	let first = null;
	let last = null;
	if(vaa.length > 0){
		first = r1[r1.length - 1];
	}
	if(vbb.length > 0){
		if(first == null){
			return r2;
		}
		last = r2[r2.length - 1];
	}
	let fill = [];
	if((first != null) && (last != null)){
		fill = fill_range(first, last);
	}
	let rng = [...new Set([...r1, ...fill, ...r2])];
	
	if(gvar.dbg_biblang){
		add_dbg_log("calc_range");
		add_dbg_log(rop);
		console.log(first);
		console.log(last);
		console.log(r1);
		console.log(r2);
		console.log(rng);
		add_dbg_log("_____________________________");
	}
	return { op: rop, lverses: rng, };
}

async function calc_comment(aa, bb){
	const oaa = await aa();
	const obb = await bb(GET_TOK);
	if(gvar.dbg_biblang){
		add_dbg_log("calc_comment");
		add_dbg_log(oaa.op);
		add_dbg_log(obb.op);
		add_dbg_log("ignoring second argument");
		add_dbg_log("_____________________________");
	}
	return oaa;
}

function set_bib(inbib){
	const bib = inbib.toUpperCase();
	if(OT_nams[bib] != null){
		gvar.biblang.curr_OT = bib;
		if(gvar.dbg_biblang){
			add_dbg_log("set_bib OT");
			add_dbg_log(bib);
		}
		return true;
	}
	if(NT_nams[bib] != null){
		gvar.biblang.curr_NT = bib;
		if(gvar.dbg_biblang){
			add_dbg_log("set_bib NT");
			add_dbg_log(bib);
		}
		return true;
	}
	if(LOC_nams[bib] != null){
		gvar.biblang.curr_LOC = bib;
		if(gvar.dbg_biblang){
			add_dbg_log("set_bib LOC");
			add_dbg_log(bib);
		}
		return true;
	}
	if(LOC_nams[inbib] != null){
		gvar.biblang.curr_LOC = inbib;
		if(gvar.dbg_biblang){
			add_dbg_log("set_bib LOC");
			add_dbg_log(inbib);
		}
		return true;
	}
	
	return false;
}

//const regex_verse = /^\d+:\d+:\d+$/;
const regex_verse = /^\d/;

function is_verse_id(tm){
	const matches = tm.match(regex_verse);	
	if(matches){
		return true;
	}
	return false;
}
 
const regex_scode = /^[HGhg]\d+$/;

function is_scode(tm){
	const cod = tm.toUpperCase();
	const matches = cod.match(regex_scode);	
	if(matches){
		return true;
	}
	return false;
}

const regex_bibrx = /^\/([^/]*)\/$/;

function is_bib_regex(tm){
	const matches = tm.match(regex_bibrx);
	if(matches){
		const val = matches[1];
		return val;
	}
	return false;
}

function get_book_num(nm){
	let num = gvar.abbr2num[nm];
	if(num != null){ return num; }
	num = gvar.book2num[nm];
	return num;
}

function is_book_name(nam){
	const nm = nam.toLowerCase();
	let num = get_book_num(nm);
	if(num != null){ return num; }

	if(nm.length > 3){
		const cc = closest(nm, ALL_BOOK_NAMES);
		const dd = distance(nm, cc);
		if(dd <= 2){
			num = get_book_num(cc);
			if(num != null){ return num; }
		}
	}
	
	return false;
}

function is_number(val){
	if((typeof val === 'number') && ! isNaN(val)){
		return true;
	}
	return false;
}

const regex_citation = /^([^.-]+)[.-](\d+)(.*)/;

export function parse_citation(tm){
	const cha_sz = bib_chapter_sizes;
	const citobj = {};
	citobj.txt = tm;
	const matches = tm.match(regex_citation);
	if(matches){
		let nam = matches[1].toLowerCase();
		const book = is_book_name(nam);
		if(! book){ return false; }
		citobj.book = Number(book);
		citobj.chapter = Number(matches[2]);
		if(cha_sz[citobj.book] == null){
			return false;
		}
		if(cha_sz[citobj.book][citobj.chapter] == null){
			return false;
		}
		let rest = matches[3];
		
		if(rest.length > 0){
			return parse_verses(rest, citobj);
		} 
		
		citobj.verse = 1;
		citobj.verse_end = Number(cha_sz[citobj.book][citobj.chapter]);;
		
		const v1 = "" + citobj.book + ":" + citobj.chapter + ":" + citobj.verse;
		const v2 = "" + citobj.book + ":" + citobj.chapter + ":" + citobj.verse_end;
		const rng = fill_range(v1, v2);
		return rng;
	}		
	return false;
}

function parse_verses(rest, citobj){
	let all_verses = [];
	const secs = rest.split(',');
	let ii = 0;
	for(ii = 0; ii < secs.length; ii++){
		const sec = secs[ii];
		const lims = sec.split('-');
		if(lims.length == 0){
			return false;
		}
		if(lims.length > 2){
			return false;
		}
		const beg = lims[0];
		let end = beg;
		if(lims.length > 1){
			end = lims[1];
		}
		const v1 = to_vid(beg, citobj);
		const v2 = to_vid(end, citobj);
		if(v1 == null){	return false; }
		if(v2 == null){	return false; }
		const rng = fill_range(v1, v2);
		all_verses = arr_union(all_verses, rng);
	}
	return all_verses;
}

function is_valid_cit(citobj){
	const cha_sz = bib_chapter_sizes;
	if(cha_sz[citobj.book][citobj.chapter] == null){
		return false;
	}
	if(citobj.verse > cha_sz[citobj.book][citobj.chapter]){
		return false;
	}
	return true;
}

function to_vid(vcit, citobj){
	const vrr = vcit.split(':');
	if(vrr.length == 0){
		return null;
	}
	if(vrr.length > 2){
		return null;
	}
	let nc = null;
	let nv = null;
	if(vrr.length > 1){
		if(vrr[0].length > 0){
			nc = Number(vrr[0]);
			nv = Number(vrr[1]);
			if(! is_number(nc)){ return null; }
			if(! is_number(nv)){ return null; }			
			if(nc < citobj.chapter){ return null; }			
			if((nc == citobj.chapter) && (nv < citobj.verse)){ return null; }
			
			citobj.chapter = nc;
			citobj.verse = nv;
			
			if(! is_valid_cit(citobj)){ return null; }
			
			const vid = "" + citobj.book + ":" + citobj.chapter + ":" + citobj.verse;
			return vid;
		} else {
			if(vrr[1].length == 0){ return null; }
			nv = Number(vrr[1]);
		}
	}
	if(nv == null){
		nv = Number(vrr[0]);
	}
	if(! is_number(nv)){ return null; }
	if(nv < citobj.verse){ return null; }
	
	citobj.verse = nv;
	
	if(! is_valid_cit(citobj)){ return null; }
	
	const vid = "" + citobj.book + ":" + citobj.chapter + ":" + citobj.verse;
	return vid;
}

async function calc_scode(scode){
	const scod = scode.toUpperCase();
	if(gvar.biblang.all_scods == null){ gvar.biblang.all_scods = []; }
	gvar.biblang.all_scods.push(scod);
	
	const add_s_cod = gvar.biblang.add_scod;
	
	let bib = gvar.biblang.curr_OT + SCOD_VERSES_SUFIX;
	const is_gre = scod.startsWith(GREEK_PREFIX);
	if(is_gre){
		bib = gvar.biblang.curr_NT + SCOD_VERSES_SUFIX;
	}
	let arr_vrs = [];
	const vss = await get_scode_verses(bib, scod);
	//console.log(vss);
	if(vss.length > 0){
		const all_vrs = vss.split(' ');
		arr_vrs = [...new Set([...all_vrs])];
	}
	
	const rop = scode;
	
	if(gvar.dbg_biblang){
		let msg = "calc_scode";
		if(add_s_cod){
			msg = msg + " ADD scode";
		}
		add_dbg_log(msg);
		add_dbg_log(rop);
		console.log("get_scode_verses(" + bib + "," + scod + ")");
	}
	
	const is_lxx = (gvar.biblang.curr_OT == "LXX");
	if(is_gre && is_lxx){
		bib = gvar.biblang.curr_OT + SCOD_VERSES_SUFIX;

		let arr_vrs2 = [];
		const vss2 = await get_scode_verses(bib, scod);
		if(vss2.length > 0){
			arr_vrs2 = vss2.split(' ');
		}
		if(arr_vrs2.length > 0){
			const all_vrs = [...new Set([...arr_vrs, ...arr_vrs2])];
			arr_vrs = all_vrs;
		}
		if(gvar.dbg_biblang){
			let msg = "calc_scode LXX";
			if(add_s_cod){
				msg = msg + " ADD scode";
			}
			add_dbg_log(msg);
			add_dbg_log(rop);
			console.log("get_scode_verses(" + bib + "," + scod + ")");
			console.log(arr_vrs2);
		}
	}
	
	const in_rng_vrs = arr_vrs.filter(vr => verse_in_range(vr));
	
	if(gvar.dbg_biblang){
		//console.log(arr_vrs);
		console.log(in_rng_vrs);
		add_dbg_log("_____________________________");
	}
	
	//const robj = { op: rop, lverses: arr_vrs, };
	const robj = { op: rop, lverses: in_rng_vrs, };
	if(add_s_cod != null){
		robj.lscods = [scod];
	}
	return robj;
}

async function calc_citation(cit){
	const rop = cit.txt;
	if(gvar.dbg_biblang){
		add_dbg_log("calc_citation");
		add_dbg_log(rop);
	}
	const v1 = "" + cit.book + ":" + cit.chapter + ":" + cit.verse;
	const v2 = "" + cit.book + ":" + cit.chapter + ":" + cit.verse_end;
	
	const rng = fill_range(v1, v2);
	return { op: rop, lverses: rng, };
}

function calc_verse_id(wrd){
	const rop = wrd;
	if(gvar.dbg_biblang){
		add_dbg_log("calc_verse_id");
		add_dbg_log(rop);
		add_dbg_log("_____________________________");
	}
	return { op: rop, lverses: [wrd], };
}

const regex_bibvar = /^([.+=><:\-]+)([\w\d:_.]+)$/;

function is_bib_var(tm){
	const matches = tm.match(regex_bibvar);	
	if(matches){
		const kk = matches[1];
		const nam = matches[2];
		if(gvar.dbg_biblang){
			console.log("is_bib_var");
			console.log(matches);
			console.log("_____________________________");
		}
		return { txt:tm, kind: kk, name:nam};
	}
	return false;
}

async function calc_bibvar(bvar){
	const kk = bvar.kind;
	const nam = bvar.name;
	const rop = bvar.txt;
	if(gvar.dbg_biblang){
		add_dbg_log("calc_bibvar");
		add_dbg_log(kk);
		add_dbg_log(nam);
		add_dbg_log(rop);
	}
	const robj = { op: rop, lverses: [], };
	if(nam == 'all'){
		reset_presentation();
		reset_curr_rx_insensitive();
		reset_curr_range();
		size_outputs_to_all();
		return robj;
	}
	if(kk == ':'){
		const vr = nam.toLowerCase();
		if(rx_in_nams[vr] != null){
			gvar.biblang.regex_input = vr;
			if(gvar.dbg_biblang){ add_dbg_log("regex_input=" + vr); }
		}
	}
	if(kk == '.'){
		const set_ok = set_bib(nam);
		if(set_ok){
			return robj;
		}
		const vr = nam.toLowerCase();
		if(out_nams[vr] != null){
			gvar.biblang.presentation = vr;
			gvar.biblang.changed_presentation = true;

			if(gvar.dbg_biblang){ add_dbg_log("presentation=" + vr); }
		}
		if(vr == rx_insen){
			gvar.biblang.regex_insensitive = true;
			if(gvar.dbg_biblang){ add_dbg_log("regex_insensitive=" + vr); }
		}
		if(vr == rx_sensi){
			gvar.biblang.regex_insensitive = false;
			if(gvar.dbg_biblang){ add_dbg_log("regex_insensitive=" + vr); }
		}
		if(vr == dbg_lang){
			gvar.dbg_biblang = true;
			add_dbg_log("dbg_biblang ON");
		}
		if(vr == nodbg_lang){
			add_dbg_log("dbg_biblang OFF");
			gvar.dbg_biblang = false;
		}
		if(vr == reset_history){
			add_dbg_log("reseting history");
			gvar.biblang.history = [];
		}
		if(vr == open_text_analysis){
			add_dbg_log("open_text_analysis");
			robj.is_txta_oper = true;
		}
		if(vr == inc_crono){
			add_dbg_log("inc_crono");
			gvar.biblang.crono_op = inc_crono;
		}
		if(vr == dec_crono){
			add_dbg_log("dec_crono");
			gvar.biblang.crono_op = dec_crono;
		}
		if(vr.startsWith(format_desc)){
			gvar.biblang.current_format = nam;
		}
	}
	const rng_var = get_name_range(nam);
	if(rng_var.length > 0){
		set_new_range(kk, rng_var);
	}
	if(gvar.dbg_biblang){
		add_dbg_log("_____________________________");
	}
	
	return robj;
}

function set_new_range(kk, rng_var){
	if(rng_var.length <= 0){
		return;
	}
	const rng1 = gvar.biblang.curr_range;
	if(kk == '<'){
		const rng2 = get_range(1, rng_var[0] - 1);
		gvar.biblang.curr_range = arr_intersec(rng1, rng2);
	}
	if(kk == '<='){
		const rng2 = get_range(1, rng_var[rng_var.length - 1]);
		gvar.biblang.curr_range = arr_intersec(rng1, rng2);
	}
	if(kk == '>'){
		const rng2 = get_range(rng_var[rng_var.length - 1] + 1, 66);
		gvar.biblang.curr_range = arr_intersec(rng1, rng2);
	}
	if(kk == '>='){
		const rng2 = get_range(rng_var[0], 66);
		gvar.biblang.curr_range = arr_intersec(rng1, rng2);
	}
	if(kk == '='){
		gvar.biblang.curr_range = rng_var;
	}
	if(kk == '+'){
		gvar.biblang.curr_range = arr_union(rng1, rng_var);
	}
	if(kk == '-'){
		gvar.biblang.curr_range = arr_diff(rng1, rng_var);
	}
	if(gvar.dbg_biblang){
		add_dbg_log("new_range");
		const str_rng2 = JSON.stringify(rng_var, null, null);
		add_dbg_log(str_rng2);			
		const str_rng = JSON.stringify(gvar.biblang.curr_range, null, null);
		add_dbg_log(str_rng);
	}
}

function get_range(min, max){
	let ii = min;
	if(min < 1){ return []; }
	if(max > 66){ return []; }
	const rng = [];
	for(ii = min; ii <= max; ii++){
		rng.push(ii);
	}
	return rng;
}

function get_name_range(rnam){
	const nam = rnam.toLowerCase();
	const is_big_rng = (range_nams[nam] != null);
	if(is_big_rng){
		return range_nams[nam];
	}
	const is_book_abbr = (gvar.abbr2num[nam] != null);
	if(is_book_abbr){
		if(gvar.dbg_biblang){
			add_dbg_log("book abbr " + nam);
		}
		const num = Number(gvar.abbr2num[nam]);
		return [num];
	}
	return [];
}

function no_tildes_word(wrd){
	const ntil = wrd.replace(/Á/g, 'A').replace(/á/g, 'a')
		.replace(/É/g, 'E').replace(/é/g, 'e')
		.replace(/Í/g, 'I').replace(/í/g, 'i')
		.replace(/Ó/g, 'O').replace(/ó/g, 'o')
		.replace(/Ú/g, 'U').replace(/ú/g, 'u');
	return ntil;
}

function get_rx_input_bib(){
	let bib = gvar.biblang.curr_LOC;
	if(gvar.biblang.regex_input == ot_input){
		bib = gvar.biblang.curr_OT;
		set_new_range("<=", get_name_range("ot"));
	}
	if(gvar.biblang.regex_input == nt_input){
		bib = gvar.biblang.curr_NT;
		set_new_range(">=", get_name_range("nt"));
	}
	return bib;
}

async function calc_word(word, prev){
	if(prev == GET_TOK){
		return { op: word, lverses: [], is_get_tok: true, }
	}
	if(gvar.biblang.all_user_vars == null){ gvar.biblang.all_user_vars = {}; }
	if(gvar.biblang.all_user_vars[word] != null){
		return gvar.biblang.all_user_vars[word];
	}
	
	const wrd = no_tildes_word(word);
	const rop = word;
	let bib = get_rx_input_bib();
	
	let num = gvar.biblang.size_output.rx;
	if(gvar.dbg_biblang){
		add_dbg_log("calc_word");
		add_dbg_log(rop);
		console.log(bib + " " + num  + " " + wrd + " " + prev);
		add_dbg_log("_____________________________");
	}
	const found = await find_regex(bib, num, wrd, prev);
	
	return { op: rop, lverses: found, };
}

async function calc_bibregex(rx, prev){
	if(prev == GET_TOK){
		return { op: rx, lverses: [], is_get_tok: true, }
	}
	const rop = "/" + rx + "/";
	if((gvar.biblang.txta_verse != null) && (rx.length > 0) && (rx[0] == '=')){
		gvar.biblang.txta_rx = rx;
		return { op: rop, lverses: [], }
	}
	if(gvar.dbg_biblang){
		add_dbg_log("calc_bibregex");
		add_dbg_log(rop);
	}
	let bib = get_rx_input_bib();
	
	let num = gvar.biblang.size_output.rx;
	const found = await find_regex(bib, num, rx, prev);
	
	return { op: rop, lverses: found, };
}

export function get_txt_matches(vtxt, rxo, fix_ocu){
	let all_ocu = [];
	let prv = null;
	let rr = null;
	if(DEBUG_MATCHES){
		console.log(`get_txt_matches(${vtxt}, ${rxo}, ${fix_ocu})`);
	}
	while((rr = rxo.exec(vtxt)) !== null){
		//gvar.biblang.prog_bar.tot_ocu++;
		//update_prog_bar();
		
		let ocu = {
			idx: rr.index,
			lng: rr[0].length,
			fmt: gvar.biblang.current_format,
		};
		
		if(prv != null){
			const prv_end = prv.idx + prv.lng;
			if(prv_end >= ocu.idx){
				const ocu_end = ocu.idx + ocu.lng;
				if(ocu_end > prv_end){
					prv.lng += (ocu_end - prv_end);
				}
				ocu = null;
			}
		}
		
		if(ocu != null){
			if(DEBUG_MATCHES){
				console.log(`FOUND ocu=`);
				console.log(ocu);
			}
			if(fix_ocu != null){ 
				fix_ocu(ocu, all_ocu);
			}			
			all_ocu.push(ocu);
			prv = ocu;
		}
		
		//all_ocu.push(ocu);
	}
	
	if(DEBUG_MATCHES){
		console.log("get_txt_matches");
		console.log(all_ocu);
	}

	return all_ocu;
}

async function verse_matches(bib, vii, rxo){
	const n2b = gvar.num2book_en;
	const book = Number(vii[0]);
	const chapter = Number(vii[1]);
	const verse = Number(vii[2]);

	//console.log("TRYING get_bible_verse(" + bib + ", " + n2b[book] + ", " + chapter + ", " + verse + ")");
	let vtxt = await get_bible_verse(bib, n2b[book], chapter, verse);
	if(vtxt == null){
		console.log("null verse for get_bible_verse(" + bib + ", " + n2b[book] + ", " + chapter + ", " + verse + ")");
		return [];
	}
	if(gvar.is_strong_bib[bib]){
		vtxt = calc_vstxt(vtxt);
	}
	//console.log(vtxt);
	
	const all_ocu = get_txt_matches(vtxt, rxo);
	return all_ocu;
}

function to_insenitive_bib(bib){
	if(ibibs[bib] != null){
		return ibibs[bib];
	}
	return bib;
}

async function find_regex(bib, num, rx, prev){	
	if(gvar.biblang.all_rx_found == null){ gvar.biblang.all_rx_found = {}; }
	if(gvar.biblang.all_rx_found[bib] == null){ gvar.biblang.all_rx_found[bib] = {}; }
	if(gvar.biblang.all_rx_found[bib][rx] != null){
		if(gvar.dbg_biblang){
			add_dbg_log("find_regex");
			add_dbg_log("RETURNING ALREADY CALCULATED REGEX");
			add_dbg_log(rx);
			add_dbg_log("_____________________________");
		}
		return gvar.biblang.all_rx_found[bib][rx];
	}
	
	
	let rxbib = bib;
	let rxo = null;
	if(gvar.biblang.all_ocu == null){ gvar.biblang.all_ocu = {}; }
	const comm_ocu = gvar.biblang.all_ocu;
	
	gvar.biblang.prog_bar.part_name = rx;
	
	if(gvar.biblang.regex_insensitive){
		rxo = new RegExp(rx, "ig");
		rxbib = to_insenitive_bib(bib);
	} else {
		rxo = new RegExp(rx, "g");
	}
	
	if(prev != null){
		if(prev.lverses == null){
			if(gvar.dbg_biblang){
				add_dbg_log("find_regex");
				add_dbg_log("BAD_OPER");
				add_dbg_log("_____________________________");
			}
			return [];
		}
		
		const prv_verses = prev.lverses;
		if(gvar.dbg_biblang){
			add_dbg_log("find_regex PREV");
			add_dbg_log(prev.op);
		}
		gvar.biblang.prog_bar.tot_verses_part = prv_verses.length;
		let ii = 0;
		const all_mm = [];
		for(ii = 0; ii < prv_verses.length; ii++){
			gvar.biblang.prog_bar.num_verses_part = ii;
			const vr = prv_verses[ii];
			const vii = vr.split(":");
			const all_ocu = await verse_matches(rxbib, vii, rxo);
			if(all_ocu.length > 0){
				all_mm.push(vr);
				if(comm_ocu[rxbib] == null){ comm_ocu[rxbib] = {}; }
				if(comm_ocu[rxbib][vr] == null){ comm_ocu[rxbib][vr] = []; }
				comm_ocu[rxbib][vr].push(...all_ocu);
			}
		}
		gvar.biblang.all_rx_found[bib][rx] = all_mm;
		return all_mm;
	}
	
	let max = num;
	const found = [];
	const fst_book = first_book_in_range();

	gvar.biblang.prog_bar.tot_verses_part = calc_range_tot_verses();
	
	if(gvar.dbg_biblang){
		add_dbg_log("find_regex");
		add_dbg_log(rx);
		add_dbg_log(rxo);
		add_dbg_log(fst_book);
	}
	
	if(fst_book <= 66){
		let vii = [fst_book, 1, 1];
		while(true){
			if(vii == null){ break; }		
			const all_ocu = await verse_matches(rxbib, vii, rxo);
			if(all_ocu.length > 0){
				const vr = vii.join(":");
				found.push(vr);
				if(comm_ocu[rxbib] == null){ comm_ocu[rxbib] = {}; }
				if(comm_ocu[rxbib][vr] == null){ comm_ocu[rxbib][vr] = []; }
				comm_ocu[rxbib][vr].push(...all_ocu);
			}
			if((max != "all") && (found.length >= max)){
				break;
			}
			
			vii = inc_verse(vii);		
			gvar.biblang.prog_bar.num_verses_part++;
		}
	}
	if(gvar.dbg_biblang){
		console.log(found);
		add_dbg_log("_____________________________");
	}
	gvar.biblang.all_rx_found[bib][rx] = found;
	return found;
}

async function calc_base_term(term, prev){
	if(DEBUG_PARSER){ 
		//console.trace();
		console.log(`calc_base_term. term=${term}, prev=${prev}`); 
	}
	if(is_verse_id(term)){
		return calc_verse_id(term);
	}
	if(is_scode(term)){
		return calc_scode(term);
	}
	const rx = is_bib_regex(term)
	if(rx){
		return calc_bibregex(rx, prev);
	}
	const bvar = is_bib_var(term)
	if(bvar){
		return calc_bibvar(bvar);
	}
	const cit = parse_citation(term);
	if(cit){
		const rop = term;
		if(gvar.dbg_biblang){
			add_dbg_log("parse_citation");
			add_dbg_log(rop);
		}
		return { op: rop, lverses: cit, };
	}
	return calc_word(term, prev);
}

function range_to_intervals(range){
	let rng = range;
	if(rng == null){
		return [];
	}
	rng = rng.sort((n1, n2) => (n1 - n2));
	
	const all_rng = [];
	const n2a = gvar.num2abbr;
	let prv = -1;
	let b0 = null;
	let b1 = null;
	let ii = 0;
	for(; ii < rng.length; ii++){
		const book = rng[ii];
		
		if(book == (prv + 1)){
			b1 = book; 
		} else {
			if(b0 != null){
				all_rng.push([n2a[b0], n2a[b1]]);
			}
			b0 = book;
			b1 = book;
		}
		prv = book;
	}
	if(b0 != null){
		all_rng.push([n2a[b0], n2a[b1]]);
	}
	if(gvar.dbg_biblang){
		add_dbg_log("UI_RANGE");
		add_dbg_log(all_rng);
		add_dbg_log("_____________________________");
	}
	return all_rng;
}

function intervals_to_range(intervals){
	if(intervals == null){
		return [];
	}
	const a2n = gvar.abbr2num;
	
	let range = [];
	let ii = 0;
	for(; ii < intervals.length; ii++){
		const itv = intervals[ii];
		const jj_beg = Number(a2n[itv[0]]);
		const jj_end = Number(a2n[itv[1]]);
		let jj = jj_beg;
		for(; jj <= jj_end; jj++){
			range.push(jj);
		}
	}
	return range;
}

export function conf_to_mini(conf){
	if(conf.intervals == null){
		conf.intervals = range_to_intervals(conf.curr_range);
	}
	const mini = {};
	const kks = Object.keys(mini2conf);
	let ii = 0;
	for(; ii < kks.length; ii++){
		const kk = kks[ii];
		const kk2 = mini2conf[kk];
		if(kk2 != null){
			mini[kk] = conf[kk2];
		}
	}
	return mini;
}

export function mini_to_conf(mini){
	const conf = get_biblang_conf();
	const kks = Object.keys(conf2mini);
	let ii = 0;
	for(; ii < kks.length; ii++){
		const kk = kks[ii];
		const kk2 = conf2mini[kk];
		if(kk2 != null){
			conf[kk] = mini[kk2];
		}
	}
	conf.curr_range = intervals_to_range(conf.intervals);
	//conf.size_output
	return conf;
}

function fix_bool(cad){
	if(cad == "true"){ return true; }
	return false;
}

function fix_sz(sz){
	if(sz == "all"){ return sz; }
	return Number(sz);
}

export function encode_mini(mini){
	if(mini.s != null){
		mini.s = Object.entries(mini.s).map(rr => rr.join(":")).join("+");
	}
	mini.I = mini.I.map(rr => rr.join(":")).join("+");
	const ents = Object.entries(mini);
	const encoded = ents.map(rr => rr.join("$")).join("|");
	return encoded;
}

export function decode_mini(emini){
	const ents = emini.split("|").map(rr => rr.split("$"));
	const decoded = Object.fromEntries(ents); 
	decoded.I = decoded.I.split("+").map(rr => rr.split(":"));
	if(decoded.s != null){
		decoded.s = Object.fromEntries(decoded.s.split("+").map(rr => { const oo = rr.split(":"); return [oo[0], fix_sz(oo[1])]}));
	}
	decoded.r = fix_bool(decoded.r);
	return decoded;
}

function in_nodejs(){
	return (typeof window === 'undefined');
}

function update_history(command){
	const maxsz = get_his_max_sz();
	if(gvar.biblang.history == null){ gvar.biblang.history = []; }
	const his = gvar.biblang.history;
	
	if(gvar.biblang.his_idx_pop != null){
		const idx = gvar.biblang.his_idx_pop;
		his.splice(idx + 1);
		gvar.biblang.his_idx_pop = null;
	}
	
	while((his.length > 0) && (his.length >= maxsz)){ his.shift(); }
	const curr_conf = get_biblang_conf();
	his.push({conf: curr_conf, expr: command});
	
	const lpos = his.length - 1;
	if(! in_nodejs()){
		if(gvar.biblang.his_first_pushed == null){
			gvar.biblang.his_first_pushed = lpos;
		}
		window.history.pushState(lpos, '');
	}
}

export async function eval_biblang_command(command, config){
	const par = gvar.biblang.parser;
	if(par == null){
		console.error(eval_biblang_term);
	}
	reset_presentation();
	reset_curr_rx_insensitive();
	reset_curr_range();
	reset_texta();
	reset_crono();

	if(config != null){
		set_biblang_conf(config);
	}
	gvar.biblang.prog_bar = {};
	gvar.biblang.prog_bar.start_time = performance.now();
	gvar.biblang.prog_bar.tot_updates = 0;
	gvar.biblang.prog_bar.tot_ocu = 0;
	gvar.biblang.dbg_log = [];
	
	delete gvar.biblang.current_format;
	
	gvar.biblang.all_scods = [];
	gvar.biblang.all_ocu = {};
	gvar.biblang.all_rx_found = {};
	
	dbg_log_all_loaded_files();
	
	if(! gvar.biblang.recovering_his){
		update_history(command);
	} else {
		gvar.biblang.recovering_his = null;
	}
	
	if(gvar.dbg_biblang){
		add_dbg_log("INITIAL_CONF");
		add_dbg_log(get_biblang_conf());
		const toks = par.tokenize(command);
		add_dbg_log("TOKENS");
		add_dbg_log(toks);
	}

	let robj = { op: "eval_biblang_command error. CHECK DEBUG INFO.", lverses: [], };
	try{
		robj = await par.expressionToValue(command);
	} catch(err){
		add_dbg_log("ERROR in eval_biblang_command");
		add_dbg_log(err);
		console.error("expressionToValue error", err);
		add_dbg_log("_____________________________");
		robj = { op: "expressionToValue error. CHECK DEBUG INFO.", lverses: [], };
	}
	
	if(DEBUG_PARSER){ console.log("ev_blang_command"); console.log(robj); }
    if(Array.isArray(robj)) {
		if(robj.length > 0){
			robj = await robj[0];
		} else {
			robj = { op: "Empty_expr in eval_biblang_command error. CHECK DEBUG INFO.", lverses: [], };
		}
	}
	
	const all_vss = robj.lverses;
	if(DEBUG_PARSER){ console.log("ev_blang_command"); console.log(all_vss); }
	robj.lverses = all_vss.sort(cmp_verses);;
	
	robj.all_scods = gvar.biblang.all_scods;
	robj.all_ocu = gvar.biblang.all_ocu;
	
	if(! gvar.biblang.changed_presentation && (Object.keys(robj.all_ocu).length == 0) && (gvar.biblang.regex_input != "loc")){
		gvar.biblang.presentation = "min";
	}

	if(gvar.biblang.all_user_vars == null){ gvar.biblang.all_user_vars = {}; }
	gvar.biblang.all_user_vars["$last"] = robj;
	
	gvar.biblang.all_scods = [];
	gvar.biblang.all_ocu = {};

	robj.intervals = range_to_intervals(gvar.biblang.curr_range);
	
	if(gvar.biblang.crono_op && is_crono_req(robj)){
		await calc_crono_op(robj, gvar.biblang.crono_op);
	}
	
	if(gvar.dbg_biblang){
		add_dbg_log("FINAL_RESULT");
		add_dbg_log(robj.op);
		add_dbg_log("FINAL_NUM_VERSES=" + robj.lverses.length);
		console.log(robj.lverses);
		add_dbg_log("FINAL_CONF");
		add_dbg_log(get_biblang_conf());
		add_dbg_log("TOT_UPDATES");
		add_dbg_log(gvar.biblang.prog_bar.tot_updates);
		add_dbg_log("_____________________________");
	}
	return robj;
}

export function add_dbg_log(obj){
	if(! gvar.dbg_biblang){
		return;
	}
	if(gvar.biblang.dbg_log == null){
		gvar.biblang.dbg_log = [];
	}
	
	const log = gvar.biblang.dbg_log;
	const dbgsz = Number(gvar.biblang.size_output.dbg);
	while((log.length > 0) && (log.length >= dbgsz)){ log.shift(); }
	const msg = JSON.stringify(obj, null, " ");
	
	log.push(msg);
	console.log(obj);
}

function calc_range_tot_verses(){
	const rng = gvar.biblang.curr_range;
	const ror_vrs = rng.reduce((tot, ii) => tot + book_sizes[ii], 0);
	return ror_vrs;
}

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

async function calc_scod_idx(arr_vrs, lscods){
	const all_idx = {};
	let ii = 0;
	for(ii = 0; ii < arr_vrs.length; ii++){
		const vr = arr_vrs[ii];
		const vii = vr.split(":");
		const n2b = gvar.num2book_en;
		const book = Number(vii[0]);
		const chapter = Number(vii[1]);
		const verse = Number(vii[2]);

		let sbib = gvar.biblang.curr_OT + SCOD_SVERSES_SUFIX;
		if(book > 39){
			sbib = gvar.biblang.curr_NT + SCOD_SVERSES_SUFIX;
		}

		const vtxt = await get_bible_verse(sbib, n2b[book], chapter, verse);
		if(vtxt == null){
			console.log("null verse for get_bible_verse(" + sbib + ", " + n2b[book] + ", " + chapter + ", " + verse + ")");
			continue;
		}
		const svr = vtxt.split(' ');
		const vr_all_idx = get_all_scod_idx(svr, lscods);
		if(vr_all_idx.length > 0){
			all_idx[vr] = {};
			all_idx[vr].svr = svr;
			all_idx[vr].arr_idx = vr_all_idx;
		}
		if(DEBUG_SCOD_IDX){
			console.log(`sbib=${sbib} BOOK=${n2b[book]} VERSE=${vr} vtxt=${vtxt} \n 
				lscods=${lscods.join(':')} vr_all_idx=${vr_all_idx.join(':')}`);
		}
	}
	return all_idx;
}

function get_all_scod_idx(svr, lscods){
	let all_idx = [];
	let ii = 0;
	for(ii = 0; ii < svr.length; ii++){
		const scod = svr[ii];
		const in_scods = lscods.includes(scod);
		if(in_scods){
			all_idx.push(ii);
		}
	}
	return all_idx;
}

function calc_scod_idx_followed_by(all_idx, lscods){
	const vrs = Object.keys(all_idx);
	let ii = 0;
	for(ii = 0; ii < vrs.length; ii++){
		const vr = vrs[ii];
		const obj = all_idx[vr];
		const keep = followed_by_any(obj.svr, obj.arr_idx, lscods);
		if(! keep){
			delete all_idx[vr];
		}
	}	
}

function followed_by_any(svr, arr_idx, lscods){
	let ii = 0;
	let updated = false;
	for(ii = 0; ii < arr_idx.length; ii++){
		const idx = arr_idx[ii];
		const nxt = idx + 1;
		if(nxt > svr.length){
			continue;
		}
		
		if(DEBUG_FOLLOWED){
			console.log(`SVR=${svr} \n svr[${nxt}]=${svr[nxt]} lscods=${lscods.join(',')}`);
		}
		if(lscods.includes(svr[nxt])){
			arr_idx[ii] = nxt;
			updated = true;
		}
	}
	return updated;
}

function calc_scod_idx_before_any(all_idx, lscods){
	const vrs = Object.keys(all_idx);
	let ii = 0;
	for(ii = 0; ii < vrs.length; ii++){
		const vr = vrs[ii];
		const obj = all_idx[vr];
		const keep = first_before_any(obj.svr, obj.arr_idx, lscods);
		if(! keep){
			delete all_idx[vr];
		}
	}	
}

function first_before_any(svr, arr_idx, lscods){
	if(arr_idx == null){ return false; }
	if(svr == null){ return false; }
	if(arr_idx.length == 0){ return false; }
	const rest = svr.slice(arr_idx[0] + 1);
	const bf_any = arr_intersec(rest, lscods);
	const has_elem = (bf_any.length > 0);
	return has_elem;
}

function verse_in_range(vr){
	const vii = vr.split(":");
	const book = Number(vii[0]);
	const in_rng = gvar.biblang.curr_range.includes(book);
	return in_rng;
}

function is_crono_req(robj){
	if(robj.lverses.length != 1){
		return false;
	}
	if(robj.all_scods.length != 0){
		return false;
	}
	const kks = Object.keys(robj.all_ocu);
	if(kks.length != 0){
		return false;
	}
	return true;
}

async function calc_crono_op(robj, op){
	await import_crono_bib();
	const n2v = gvar.crono_bib.num2vid;
	const v2n = gvar.crono_bib.vid2num;
	if(robj.lverses.length != 1){
		console.error("NOT A CRONO OP !!!");
	}
	const vid = robj.lverses[0];
	let nv = v2n[vid];
	//console.log("CRONO_BASE_NUM:" + nv);
	if(op == inc_crono){
		nv += 1;
	} else {
		//const num_dec = (1 + CRONO_PAGE_SZ);
		const num_dec = CRONO_PAGE_SZ;
		nv -= num_dec;
	}
	//console.log("CRONO_NEXT_BASE_NUM:" + nv);
	if(nv < 0){ nv = 0; }
	if(nv > CRONO_TOT_VERSES){ nv = CRONO_TOT_VERSES; }
	let ii = 0;
	const crono_verses = [];
	for(ii = 0; ii < CRONO_PAGE_SZ; ii++){
		const nv_add = nv + ii;
		if(nv_add > CRONO_TOT_VERSES){
			break;
		}
		//console.log("CRONO_NUM:" + nv_add);
		const vid_add = n2v[nv_add];
		crono_verses.push(vid_add);
	}
	robj.lverses = crono_verses;
}

