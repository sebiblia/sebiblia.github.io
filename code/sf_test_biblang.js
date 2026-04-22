
import * as filesys from "node:fs";

import { init_biblang, eval_biblang_command, get_txt_matches, verse_disp,  
	conf_to_mini, mini_to_conf, encode_mini, decode_mini, 
} from './sf_biblang_mgr.js'
import { gvar, fill_verses, verse_cod2obj, fill_strong_parts, } from './sf_search_mgr.js';
import { init_lang, } from './sf_lang_mgr.js';
import { diffSequence } from './sf_diff_sequence.js';
import { distance, closest,  } from './sf_word_dist.js';
//import { is_bib_citation,  } from './tmp_parse_cit.js';

import { get_bible_verse, find_ana, get_text_analysis, calc_prev_scode, calc_next_scode, 
	get_next_scode, get_prev_scode, fill_bibobj_vtxt, fill_bibobj_cit_and_ref, fill_cri_asc, 
} from './sf_bible_mgr.js';


/*

	WEB : bibles_dir + "WEB_BIB.js",
	KJV : bibles_dir + "KJV_BIB.js",
	KJVs : bibles_dir + "KJVs_BIB.js",
	SBLM : bibles_dir + "SBLM_BIB.js",
	SBLMi : bibles_dir + "SBLMi_BIB.js",
	RVA : bibles_dir + "RVA_BIB.js",
	RVAi : bibles_dir + "RVAi_BIB.js",
	RVAs : bibles_dir + "RVAs_BIB.js",
	RVAsi : bibles_dir + "RVAsi_BIB.js",
	
	WLC_S : strongs_dir + "WLC_SBIB.js",
	ALE_S : strongs_dir + "ALE_SBIB.js",
	TKH_S : strongs_dir + "TKH_SBIB.js",
	LXX_S : strongs_dir + "LXX_SBIB.js",
	
	NES_S : strongs_dir + "NES_SBIB.js",
	BYZ_S : strongs_dir + "BYZ_SBIB.js",
	TR_S : strongs_dir + "TR_SBIB.js",
	WH_S : strongs_dir + "WH_SBIB.js",
*/


const DEBUG_CK_TXTA = false;


const OT_bibs = {
	"WLC":1,
	"ALE":1,
	"TKH":1,
	"LXX":1,		// CAREFUL. if you change this, then also file "LXX" occurences.
};

const NT_bibs = {
	"BYZ":1,
	"TR":1,
	"WH":1,
	"NES":1,
};


function file_exists(nm_file){
	console.log("calling file_exists with " + nm_file);
	filesys.access(nm_file, filesys.constants.F_OK, (err) => {
		if(err){
			console.log(nm_file + " NO existe");
		} else {
			console.log(nm_file + " EXISTE");
		}
	});
}

async function main_biblang_command(){
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' <command>');
		process.exit(1);
	}
	
	const command = process.argv[2];
	
	gvar.dbg_biblang = true;

	init_lang('es');
	init_biblang('es');
	
	const bl_obj = await eval_biblang_command(command);
	const all_bibobj = await fill_verses(bl_obj);
	
	console.log(all_bibobj);
	
	/*
	const his = gvar.biblang.history;
	if((his != null) && (his.length > 0)){
		console.log("LAST_HISTO");
		const last = his[his.length - 1];
		
		//const conf = JSON.stringify(last.conf);
		//console.log(conf);
		//console.log(last.expr);
		
		console.log(last.conf);
		const mm = conf_to_mini(last.conf);
		const cc = mini_to_conf(mm);
		console.log(mm);
		console.log(cc);

		const mm2 = encode_mini(mm);
		const cc2 = decode_mini(mm2);
		console.log(mm2);
		console.log(cc2);
		
		const enc_conf = encodeURIComponent(mm2);
		const enc_expr = encodeURIComponent(last.expr);
		console.log(enc_conf);
		console.log(enc_expr);
		
	}
	*/
	
	//console.log(bl_obj.lverses);	
}

async function main_diff_bib(){
	const num_arg = process.argv.length;
	if(num_arg < 3) {
		console.log('Usage: node ' + process.argv[1] + ' "book:chapter:verse" <cri>');
		process.exit(1);
	}

	const vr1 = process.argv[2];
	let pm2 = "";
	if(num_arg >= 4){
		pm2 = process.argv[3];
	}

	init_lang('es');
	init_biblang('es');

	const n2b = gvar.num2book_en;
	
	const avr = vr1.split(":");
	const book = avr[0];
	const chapter = avr[1];
	const verse = avr[2];

	let bib = "WLC";
	let lpref = "HEB";
	if(OT_bibs[pm2] != null){
		bib = pm2;
	}
	if(book > 39){
		lpref = "GRE";
		bib = "BYZ";
		if(NT_bibs[pm2] != null){
			bib = pm2;
		}
	}
	const lbib = lpref + "_LOC";
	
	const bibobj = {};
	bibobj.cri_txt = bib;
	bibobj.book_name = n2b[book];
	bibobj.book = book;
	bibobj.chapter = chapter;
	bibobj.verse = verse;
	
	
	console.log("" + bib + ":" + lbib + ":" + book + ":" + chapter + ":" + verse);
	
	const ana = await get_text_analysis(bibobj);
	
	console.log(JSON.stringify(ana, null, " "));
	
}

function find_lcs(s1, s2){
	const rr = [];
	diffSequence(
		s1.length,
		s2.length,
		(idx1, idx2) => Object.is(s1[idx1], s2[idx2]),
		(n_comm, idx1, idx2) => {
			for (; n_comm > 0; n_comm -= 1, idx1 += 1) {
				rr.push(s1[idx1]);
			}
		},
	);
	return rr;
}


async function main_distance(){
	if (process.argv.length < 4) {
		console.log('Usage: node ' + process.argv[1] + ' <wrd1> <wrd2> [<wrd3> <wrd4> <wrd5> ...]');
		process.exit(1);
	}

	const wd1 = process.argv[2];
	const wd2 = process.argv[3];
	const rest = process.argv.slice(3);
	
	const dd = distance(wd1, wd2);

	console.log("distance(" + wd1 + "," + wd2 + ")");
	console.log(dd);

	const cc = closest(wd1, rest);
	
	console.log("closest(" + wd1 + "," + JSON.stringify(rest, null, null) + ")");
	console.log(cc);
	
}

async function main_test_scode_next_and_prev(){
	const num_arg = process.argv.length;
	if(num_arg < 3) {
		console.log('Usage: node ' + process.argv[1] + ' "book:chapter:verse" <cri>');
		process.exit(1);
	}

	const scod = process.argv[2];
	const prv = await get_prev_scode(scod);
	const nxt = await get_next_scode(scod);
	console.log(prv);
	console.log(nxt);
}

function main_test_inc_dec(){
	const num_arg = process.argv.length;
	if(num_arg < 4) {
		console.log('Usage: node ' + process.argv[1] + ' "book:chapter:verse" disp');
		process.exit(1);
	}

	gvar.dbg_biblang = true;

	init_lang('es');
	init_biblang('es');
	
	const verse = process.argv[2];
	const disp = Number(process.argv[3]);
	
	const vr = verse.split(":");
	const prv = verse_disp(vr, -disp);
	const nxt = verse_disp(vr, disp);
	console.log(prv);
	console.log(nxt);
}

async function main_test_matches(){
	const num_arg = process.argv.length;
	if(num_arg < 2) {
		console.log('Usage: node ' + process.argv[1] + ' "book:chapter:verse" <cri>');
		process.exit(1);
	}

	//const scod = process.argv[2];
	
	const vtxt = `Y habló Caín á su hermano Abel: y aconteció que estando ellos en el campo, Caín se levantó contra su hermano Abel, y le mató.`;
	console.log(vtxt);
	
	let mm = get_txt_matches(vtxt, /herm/gi);
	console.log(mm);
	mm = get_txt_matches(vtxt, /mano/gi);
	console.log(mm);
}

function test_reduce(){
	const all_chap = [1, 2, 3, 4, 5];
	const bk_sz = all_chap.reduce((tot, sz) => tot + sz, 0);
	console.log(bk_sz);
}

function test_splice(){
	const all_chap = [0, 1, 2, 3, 4, 5];
	all_chap.splice(all_chap.length);
	all_chap.splice(4);
	console.log(all_chap);
}

async function fill_dat_bibobj(bibobj){
	if(bibobj.book == null){ console.error("bibobj.book == null"); return; }
	if(bibobj.chapter == null){ console.error("bibobj.chapter == null"); return; }
	if(bibobj.verse == null){ console.error("bibobj.verse == null"); return; }
	if(bibobj.cri_txt == null){ console.error("bibobj.cri_txt == null"); return; }
	if(bibobj.bible == null){ console.error("bibobj.bible == null"); return; }
	
	fill_bibobj_cit_and_ref(bibobj);
	await fill_bibobj_vtxt(bibobj);
	await fill_cri_asc(bibobj);
}

function get_pct_strong(bibobj1, bibobj2){
	const txt_bib = bibobj1.vtxt;
	const txt_stg = bibobj2.vtxt;
	if(txt_bib == null){
		console.error("txt_bib == null");
		console.log(bibobj1);
		return;
	}
	if(txt_stg == null){
		console.error("txt_stg == null");
		console.log(bibobj2);
		return;
	}
	/*
	console.log(txt_bib);
	console.log(txt_stg);
	*/
	
	const all_stg = txt_stg.split(" ");
	let num_find = 0;
	let ii = 0;
	for(ii = 0; ii < all_stg.length; ii++){
		const stg = all_stg[ii];
		const rxstr = `${stg}`;
		const rxo = new RegExp(rxstr);
		const mm = txt_bib.match(rxo);
		if(mm){
			num_find++;
		}
	}
	//console.log(`${num_find}/${all_stg.length}`);
	
	const resp = (num_find / all_stg.length);
	return resp;
}

async function get_pct_strong_txta(bibobj, bl_obj){
	fill_strong_parts(bibobj);
	
	const txt_bib = bibobj.vtxt;
	const full_ana = await get_text_analysis(bibobj, bl_obj);
	
	if(full_ana == null){
		console.error("full_ana == null");
		return;
	}
	const toks = full_ana.ana.map((itm) => itm.sco).filter(ee => ((ee != null) && (ee != "HUNK") && (ee != "GUNK")));
	const all_scod = toks.join(" ");
	bibobj.all_scod = all_scod;
	if(DEBUG_CK_TXTA){
		console.log(toks.length);
		console.log(txt_bib);
		console.log(all_scod);
	}
	

	const rxstr1 = `\[(G|H)[0-9]*\]`;
	const rxo1 = new RegExp(rxstr1, "g");
	const toks2 = txt_bib.match(rxo1);
	
	if(toks2 == null){
		console.error("toks2 == null. " + bibobj.vcit + "=" + txt_bib);
		return;
	}
	
	if(DEBUG_CK_TXTA){
		console.log(toks);
		console.log(toks2);
	}
	
	let num_find2 = 0;
	let ii = 0;
	for(ii = 0; ii < toks2.length; ii++){
		const tok = toks2[ii];
		const stg = tok.substring(1, tok.length - 1);
		if(toks.includes(stg)){
			num_find2++;
		} else {
			if(DEBUG_CK_TXTA){
				console.log("BAD=" + stg);
			}
		}
	}
	
	let num_find1 = 0;
	/*
	for(ii = 0; ii < toks.length; ii++){		
		const stg = toks[ii];
		const rxstr = `\\[${stg}\\]`;
		const rxo = new RegExp(rxstr);
		const mm = txt_bib.match(rxo);
		if(mm){
			if(DEBUG_CK_TXTA){
				console.log(rxstr);
			}
			
			num_find1++;
		}
	}
	*/

	const resp1 = (num_find1 / toks.length);
	const resp2 = (num_find2 / toks2.length);
	if(DEBUG_CK_TXTA){
		console.log(num_find1);
		console.log(toks.length);
		console.log(resp1);
		console.log("---");
		console.log(num_find2);
		console.log(toks2.length);
		console.log(resp2);
	}
	return resp2;
}

async function main_test_verses(){
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' <command>');
		process.exit(1);
	}
	
	const command = process.argv[2];
	let bib_1 = "RVAs";
	if (process.argv.length > 3) {
		bib_1 = process.argv[3];
	}
		
	gvar.dbg_biblang = false;

	init_lang('es');
	init_biblang('es');
	
	gvar.biblang.curr_OT = "TKH";
	gvar.biblang.curr_NT = "WH";
	
	const ot_s = gvar.biblang.curr_OT + "_S";
	const nt_s = gvar.biblang.curr_NT + "_S";
	
	const bl_obj = await eval_biblang_command(command);
	const all_vrs = bl_obj.lverses;
	if(all_vrs == null){
		console.error("all_vrs == null");
		return;
	}

	const ck_con_bad = 3;
	let num_con_bad = 0;
	
	let num_bad = 0;
	let sum_bad = 0;
	
	let ii = 0;
	for(ii = 0; ii < all_vrs.length; ii++){
		const cod_vr = all_vrs[ii];
		
		const bibobj1 = verse_cod2obj(cod_vr);
		bibobj1.bible = bib_1;
		
		await fill_dat_bibobj(bibobj1);
		
		const pct = await get_pct_strong_txta(bibobj1, bl_obj);
		
		/*
		const bibobj2 = JSON.parse(JSON.stringify(bibobj1));		
		bibobj2.bible = ot_s;
		
		if(bibobj2.book > 39){			
			bibobj2.bible = nt_s;
		}
		
		await fill_dat_bibobj(bibobj2);
		
		const pct = get_pct_strong(bibobj1, bibobj2);
		*/
		
		const bad = (pct < 0.8);
		if(bad){
			num_con_bad++;
		} else {
			num_con_bad = 0;
		}
			
		const too_bad = (num_con_bad >= ck_con_bad);
		if(too_bad){
			num_con_bad = 0;
			
			sum_bad += pct;
			num_bad++;
			console.log(bibobj1.vcit + " PCT=" + pct);
			//console.log(bibobj1.vtxt);
			//console.log(bibobj1.all_scod);
			//	console.log(bibobj2.vtxt);
			//console.log("========================================================");
		}
	}
	
	console.log("TOTAL_BAD=" + num_bad);
	if(num_bad > 0){
		const bad_avg = sum_bad / num_bad;
		console.log("AVERAGE_BAD=" + bad_avg);
	}
	console.log(bib_1);
	console.log(ot_s);
	console.log(nt_s);
	
}

async function main_test_parse_cit(){
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' <cit>');
		process.exit(1);
	}
	
	const cit = process.argv[2];
		
	gvar.dbg_biblang = false;

	init_lang('es');
	init_biblang('es');
	
	gvar.biblang.curr_OT = "WLC";
	gvar.biblang.curr_NT = "BYZ";
	
	const ot_s = gvar.biblang.curr_OT + "_S";
	const nt_s = gvar.biblang.curr_NT + "_S";

	const is_cit = false;
	//const is_cit = is_bib_citation(cit);

	console.log("===========================================================");
	console.log("cit=" + cit);
	console.log(is_cit);
}

async function main_biblang_tokens(){
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' <command>');
		process.exit(1);
	}
	
	const command = process.argv[2];
	
	gvar.dbg_biblang = true;

	init_lang('es');
	init_biblang('es');
	
	let toks = ["VACIO"];
	let toks2 = null;
	let rpn = null;
	const par = gvar.biblang.parser;
	//rpn = par.expressionToRpn(command);
	const all_tt = ['mat'];
	//toks = par.expressionToThunk(command, all_tt);
	const bl_obj = await eval_biblang_command(command);
	/*
	console.log("THE_TOKENS");
	console.log(toks);
	console.log("THE_RPN");
	console.log(rpn);
	
	//toks2 = par.rpnToTokens(rpn);
	console.log("TOKS2");
	console.log(toks2);
	*/
}


//test_splice();
//test_reduce();
//main_diff_bib();
//main_distance();
//main_test_scode_next_and_prev();
//main_test_matches();
//main_test_inc_dec();
//main_test_verses();
//main_test_parse_cit();
main_biblang_tokens();

//main_biblang_command();

