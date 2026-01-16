
import { gvar, } from './sf_search_mgr.js';
import { diffSequence } from './sf_diff_sequence.js';
import { distance, closest,  } from './sf_word_dist.js';
import { add_dbg_log, } from './sf_biblang_mgr.js';
import { scroll_to_top, } from './sf_select_option_mgr.js';


const DEBUG_BIBLE_MGR = false;
const DEBUG_ANALYSIS = false;
const DEBUG_NOT_COMMON = false;
const DEBUG_FILL_BIBOBJ = false;
const DEBUG_VSTXT = false;

export const CLOSING_STRONG = '_>'; 	// to avoid html conflicts H1 ... H6 headers

const GREEK_PREFIX = "G";
const MAX_HEBREW_SCOD = 8675;
const MAX_GREEK_SCOD = 5624;

const bibles_dir = "../data/js_bib/";
const strongs_dir = "../data/js_sbib/";
const loc_dir = "../data/js_loc/";
const sloc_dir = "../data/js_sloc/";

const scodes_dir = "../data/js_scods/";
const scod_defs_dir = "../data/js_scod_defs/";

const vrefs_dir = "../data/js_refs/";

const loading_img = "../img/loading_icon.gif";

const local_smutus_file = "../data/js_mutu/MUT_SCOD_REF.js";
const local_sroots_file = "../data/js_roots/ROOTS_SCOD.js";

const id_dv_loading = "id_dv_loading";
const id_ui_loading = "id_ui_loading";

const local_vrefs_files = {
	REFS1: vrefs_dir + "VERSE_REFS.js",
};

const local_sdefs_files = {
	en: scod_defs_dir + "EN_SCOD_DEFS.js",
	es: scod_defs_dir + "ES_SCOD_DEFS.js",
	SDEFS: scod_defs_dir + "SCOD_LOC_DEFS.js",
};

const local_scods_files = {
	WLC_sv : scodes_dir + "WLC_SVERSES.js",
	ALE_sv : scodes_dir + "ALE_SVERSES.js",
	TKH_sv : scodes_dir + "TKH_SVERSES.js",
	LXX_sv : scodes_dir + "LXX_SVERSES.js",
	
	NES_sv : scodes_dir + "NES_SVERSES.js",
	BYZ_sv : scodes_dir + "BYZ_SVERSES.js",
	TR_sv : scodes_dir + "TR_SVERSES.js",
	WH_sv : scodes_dir + "WH_SVERSES.js",	
};

export const local_scod_bibles = {
	KJVs : 1,
	RVAs : 1,
	RVAsi : 1,
};

const local_bible_files = {
	WLC : bibles_dir + "WLC_BIB.js",
	ALE : bibles_dir + "ALE_BIB.js",
	TKH : bibles_dir + "TKH_BIB.js",
	LXX : bibles_dir + "LXX_BIB.js",
	
	NES : bibles_dir + "NES_BIB.js",
	BYZ : bibles_dir + "BYZ_BIB.js",
	TR : bibles_dir + "TR_BIB.js",
	WH : bibles_dir + "WH_BIB.js",
	
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
	
	HEB_LOC : loc_dir + "HEB_TRA.js",
	GRE_LOC : loc_dir + "GRE_TRA.js",
};

const local_text_files = {
	HEB_EN : loc_dir + "HEB_EN.js",
	HEB_ES : loc_dir + "HEB_ES.js",
	GRE_EN : loc_dir + "GRE_EN.js",
	GRE_ES : loc_dir + "GRE_ES.js",
};

const stra_text_files = {
	uKJV : sloc_dir + "STRA_KJV.js",
	uRVA : sloc_dir + "STRA_RVA.js",
};

const socu_text_files = {
	oKJV : sloc_dir + "SOCU_KJV.js",
	oRVA : sloc_dir + "SOCU_RVA.js",
};

const bh_lang = {
	"Ben": "en",
	"B2es": "es",
};

const bh_dict = {
	"en": "Ben",
	"es": "B2es",
};

const stg_lang = {
	"Sen": "en",
	"Ses": "es",
};

const stg_dict = {
	"en": "Sen",
	"es": "Ses",
};


const hebrew_chars = {
ALEF:'\u05D0',
BET:'\u05D1',
GIMEL:'\u05D2',
DALET:'\u05D3',
HE:'\u05D4',
VAV:'\u05D5',
ZAYIN:'\u05D6',
HET:'\u05D7',
TET:'\u05D8',
YOD:'\u05D9',
F_KAF:'\u05DA',
KAF:'\u05DB',
LAMED:'\u05DC',
F_MEM:'\u05DD',
MEM:'\u05DE',
F_NUN:'\u05DF',
NUN:'\u05E0',
SAMEKH:'\u05E1',
AYIN:'\u05E2',
F_PE:'\u05E3',
PE:'\u05E4',
F_TSADI:'\u05E5',
TSADI:'\u05E6',
KUF:'\u05E7',
RESH:'\u05E8',
SHIN:'\u05E9',
TAV:'\u05EA',
};

const ascii_heb_finals = {
'c':1,
'm':1,
'n':1,
'f':1,
'z':1,
}

const ascii_to_hebrew = {
'e':hebrew_chars.ALEF,
'b':hebrew_chars.BET,
'g':hebrew_chars.GIMEL,
'd':hebrew_chars.DALET,
'h':hebrew_chars.HE,
'v':hebrew_chars.VAV,
'x':hebrew_chars.ZAYIN,
'k':hebrew_chars.HET,
'p':hebrew_chars.TET,
'i':hebrew_chars.YOD,
'cf':hebrew_chars.F_KAF,
'c':hebrew_chars.KAF,
'l':hebrew_chars.LAMED,
'mf':hebrew_chars.F_MEM,
'm':hebrew_chars.MEM,
'nf':hebrew_chars.F_NUN,
'n':hebrew_chars.NUN,
's':hebrew_chars.SAMEKH,
'a':hebrew_chars.AYIN,
'ff':hebrew_chars.F_PE,
'f':hebrew_chars.PE,
'zf':hebrew_chars.F_TSADI,
'z':hebrew_chars.TSADI,
'q':hebrew_chars.KUF,
'r':hebrew_chars.RESH,
'w':hebrew_chars.SHIN,
't':hebrew_chars.TAV,
};

const ascii_to_min_greek = {
'a':'α',
'b':'β',
'g':'γ',
'd':'δ',
'e':'ε',
'F':'ϝ',
'N':'ͷ',
'S':'ϛ',
'z':'ζ',
'H':'ͱ',
'h':'η',
'q':'θ',
'i':'ι',
'j':'ϳ',
'k':'κ',
'l':'λ',
'm':'μ',
'n':'ν',
'x':'ξ',
'o':'ο',
'p':'π',
'M':'ϻ',
'K':'ϟ',
'Q':'ϙ',
'r':'ρ',
's':'ς',
's':'σ',
'Z':'ͼ',
't':'τ',
'u':'υ',
'f':'φ',
'c':'χ',
'y':'ψ',
'w':'ω',
};

const ascii_to_may_greek = {
'a':'Α',
'b':'Β',
'g':'Γ',
'd':'Δ',
'e':'Ε',
'F':'Ϝ',
'N':'Ͷ',
'S':'Ϛ',
'z':'Ζ',
'H':'Ͱ',
'h':'Η',
'q':'Θ',
'i':'Ι',
'j':'Ϳ',
'k':'Κ',
'l':'Λ',
'm':'Μ',
'n':'Ν',
'x':'Ξ',
'o':'Ο',
'p':'Π',
'M':'Ϻ',
'K':'Ϟ',
'Q':'Ϙ',
'r':'Ρ',
's':'Σ',
's':'Σ',
'Z':'ͼ',
't':'Τ',
'u':'Υ',
'f':'Φ',
'c':'Χ',
'y':'Ψ',
'w':'Ω',
};

export async function get_text_analysis(bibobj, bl_obj){
	let full_ana = null;
	try{
		gvar.curr_dv_ver_id = bibobj.id_dv_ver;		// UGLY. It is to show the loding image under the right verse. 
		full_ana = await calc_text_analysis(bibobj, bl_obj);
		gvar.curr_dv_ver_id = null;
	} catch(err){
		add_dbg_log("ERROR in get_text_analysis");
		add_dbg_log("" + `.${bib};${book}.${chapter}:${verse}`);
		add_dbg_log(err);
		add_dbg_log("_____________________________");
		console.error("get_text_analysis error", err);
		full_ana = {
			tasc: "calc_text_analysis error. CHECK DEBUG INFO",
			tsco: "calc_text_analysis error. CHECK DEBUG INFO",
			tloc: "calc_text_analysis error. CHECK DEBUG INFO",
			ana: [ { id: "BAD_id", sco: "BAD_sco", tra: "BAD_tra", idtra: "BAD_idtra", } ],
		};
	}
	return full_ana;
}

function fill_bibobj_tra_info(bibobj){
	const book = bibobj.book_name;
	const num_book = gvar.book2num[book];
	let lpref = "HEB";
	if(num_book > 39){
		lpref = "GRE";
	}
	const lbib = lpref + "_LOC";

	bibobj.ltra_dict = null;
	bibobj.loc_tra = null;
	bibobj.loc_bib = null;
	
	const blang = bh_lang[bibobj.dict];
	
	let ltra = null;
	if(blang != null){
		bibobj.ltra_dict = bh_dict[blang];
		bibobj.loc_tra = lpref + "_" + blang.toUpperCase();
	}
	
	bibobj.loc_bib = lbib;
}

export async function fill_loc_asc(bibobj){
	const loc_bib = gvar.biblang.curr_LOC;
	if(bibobj.bible == loc_bib){
		bibobj.loc_asc = bibobj.vtxt;
	}
	if(bibobj.loc_asc != null){
		return;
	}
	const book = bibobj.book_name;
	const chapter = bibobj.chapter;
	const verse = bibobj.verse;
	
	bibobj.loc_asc = await get_bible_verse(loc_bib, book, chapter, verse);
	if(bibobj.bible == loc_bib){
		bibobj.vtxt = bibobj.loc_asc;
		calc_bibobj_vstxt(bibobj);
	}
}

export async function fill_cri_asc(bibobj){
	let cri_bib = gvar.biblang.curr_OT;
	if(bibobj.book > 39){
		cri_bib = gvar.biblang.curr_NT;
	}
	if(bibobj.bible == cri_bib){
		bibobj.cri_asc = bibobj.vtxt;
	}
	if(bibobj.cri_asc != null){
		return;
	}
	const book = bibobj.book_name;
	const chapter = bibobj.chapter;
	const verse = bibobj.verse;
	
	bibobj.cri_asc = await get_bible_verse(cri_bib, book, chapter, verse);
	if(bibobj.bible == cri_bib){
		bibobj.vtxt = bibobj.cri_asc;
	}
}

async function fill_cri_sco(bibobj){
	if(bibobj.cri_sco != null){
		return;
	}
	const bib = bibobj.cri_txt;
	const book = bibobj.book_name;
	const chapter = bibobj.chapter;
	const verse = bibobj.verse;
	
	const sbib = bib + "_S";
	bibobj.cri_sco = await get_bible_verse(sbib, book, chapter, verse);
}

async function calc_text_analysis(bibobj, bl_obj){
	const bib = bibobj.cri_txt;
	const book = bibobj.book_name;
	const chapter = bibobj.chapter;
	const verse = bibobj.verse;
	
	await fill_cri_asc(bibobj);
	await fill_cri_sco(bibobj);
	
	const asc = bibobj.cri_asc;
	const sco = bibobj.cri_sco;

	const fullana = {
		tasc: asc,
		tsco: sco,
		tloc: "",
		ana: {},
	};	
	
	let loc = "";
	let ana = null;
	
	if(bib != "LXX"){
		fill_bibobj_tra_info(bibobj);
		if(DEBUG_BIBLE_MGR){ console.log("" + bibobj.loc_bib + " " + book + "_" + chapter + ":" + verse);	}
		loc = await get_bible_verse(bibobj.loc_bib, book, chapter, verse);
		
		fullana.tloc = loc;

		ana = get_obj_analysis(asc, sco, loc, bl_obj);		
		ana.dict = bibobj.dict;
		fullana.ana = ana;
		
		await fill_translation(bibobj, fullana);
		
	} else {
		const vasc = asc.split(" ");
		const vsco = sco.split(" ");
		ana = vasc.map((tok, idx) => { 
			return { id: tok, sco: vsco[idx], };
		});		
		ana.dict = bibobj.dict;
		fullana.ana = ana;
	}
	
	await fill_stra_translation(ana, bl_obj);
	
	await fill_scod_translation(ana, bl_obj);
	
	return fullana;
}

function get_obj_analysis(asc, sco, loc, bl_obj){
	const vasc = asc.split(" ");
	const vsco = sco.split(" ");
	const vtmp = loc.split(" ");
	const vloc = vtmp.map((tok) => { 
		const arr = tok.split(":");
		return arr[0];
	});
	const ana = vtmp.map((tok) => { 
		const arr = tok.split(":");
		return { id: arr[0], idtra: arr[1], };
	});
	const comm = find_ana(vasc, vloc, ana);
	
	fill_scodes(ana, vsco, vasc, bl_obj);
	// [ { id: "asc", sco: "sco"; txt: "g/h"; tra: "tra"; idtra: "idtra"; is_cri: "T/F" } , ... ]
	return ana;
}

function is_selected_scode(bl_obj, scode){
	if(bl_obj == null){ return false; }
	if(bl_obj.all_scods == null){ return false; }
	if(bl_obj.all_scods.includes(scode)){ return true; }
	return false;
}

function fill_scodes(ana, vsco, vasc, bl_obj){
	if(DEBUG_ANALYSIS){
		console.log("vasc " + vasc.length);
		console.log(vasc);
		console.log("vsco " + vsco.length);
		console.log(vsco);
	}
	let ii = 0;
	for(; ii < ana.length; ii++){
		const obj = ana[ii];
		if(obj.idx1 != null){
			const idx1 = obj.idx1;
			if(! obj.comm){
				console.error("FALSE idx1");
			}
			if(vasc[idx1] != obj.id){
				console.error("FALSE idx1 (case 2)");
			}
			const scode = vsco[idx1];
			obj.sco = scode;
			obj.sel_scod = is_selected_scode(bl_obj, scode);
		} 
		if(obj.added != null){
			fill_added_scodes(obj.added, vsco, vasc, bl_obj);
		}
		//obj.sco = vsco[]:;
	}
}

function fill_added_scodes(added, vsco, vasc, bl_obj){
	if(DEBUG_ANALYSIS){
		console.log("added " + added.length);
		console.log(added);
	}
	let ii = 0;
	for(; ii < added.length; ii++){
		const obj = added[ii];
		if(obj.idx1 != null){
			const idx1 = obj.idx1;
			if(vasc[idx1] != obj.id){
				console.error("FALSE idx1 (case 2)");
			}
			const scode = vsco[idx1];
			obj.sco = scode;
			obj.sel_scod = is_selected_scode(bl_obj, scode);
		} 
	}
}

async function fill_stra_translation(ana, bl_obj){
	const straid = ana.dict;
	let f_nm = stra_text_files[straid];
	if(f_nm == null){
		return;
	}
	
	let ii = 0;
	for(; ii < ana.length; ii++){
		const obj = ana[ii];
		if((obj.sco != null) && (obj.tra == null)){
			const stxt = await get_stra_text(straid, obj.sco, obj.id);
			obj.tra = stxt;
			obj.sel_scod = is_selected_scode(bl_obj, obj.sco);
			obj.dict = straid;
		} 
		if(obj.added != null){
			await fill_added_stra_stranslation(obj.added, bl_obj, straid);
		}
		//obj.sco = vsco[]:;
	}
}

async function fill_added_stra_stranslation(added, bl_obj, straid){
	let ii = 0;
	for(; ii < added.length; ii++){
		const obj = added[ii];
		if((obj.sco != null) && (obj.tra == null)){
			const stxt = await get_stra_text(straid, obj.sco, obj.id);
			obj.tra = stxt;
			obj.sel_scod = is_selected_scode(bl_obj, obj.sco);
			obj.dict = straid;
		} 
	}
}

async function fill_scod_translation(ana, bl_obj){
	let lang = stg_lang[ana.dict];
	if(lang == null){
		const loc_bib = gvar.biblang.curr_LOC;
		lang = gvar.bib_lang[loc_bib];
	}
	if(lang == null){
		lang = gvar.lang;
	}
	
	let ii = 0;
	for(; ii < ana.length; ii++){
		const obj = ana[ii];
		if((obj.sco != null) && (obj.tra == null)){
			const def_obj = await get_scode_def(obj.sco, lang);
			obj.tra = def_obj.def;
			obj.sel_scod = is_selected_scode(bl_obj, obj.sco);
			obj.dict = stg_dict[lang];
		} 
		if(obj.added != null){
			await fill_added_scod_stranslation(obj.added, bl_obj, lang);
		}
		//obj.sco = vsco[]:;
	}
}

async function fill_added_scod_stranslation(added, bl_obj, lang){
	let ii = 0;
	for(; ii < added.length; ii++){
		const obj = added[ii];
		if((obj.sco != null) && (obj.tra == null)){
			const def_obj = await get_scode_def(obj.sco, lang);
			obj.tra = def_obj.def;
			obj.sel_scod = is_selected_scode(bl_obj, obj.sco);
			obj.dict = stg_dict[lang];
		} 
	}
}

function add_common(rr, s1, nc, ii1){
	for (; nc > 0; nc -= 1, ii1 += 1) {
		rr.push(s1[ii1]);
	}
}

function mark_common(ana2, nc, idx2, idx1){
	for (; nc > 0; nc -= 1, idx2 += 1, idx1 += 1) {
		ana2[idx2].comm = true;
		ana2[idx2].idx1 = idx1;
	}
}

function add_not_common(ana2, prv2, idx2, s1, prv1, idx1){
	if(prv2 >= idx2){
		console.error("FALSE INDEX");
	}
	if(prv1 >= idx1){
		console.error("FALSE INDEX");
	}
	const fst1 = prv1 + 1;
	let ii1 = fst1;
	const not_comm1 = s1.slice(fst1, idx1);
	if(DEBUG_NOT_COMMON){
		console.log("not_comm1 [" + fst1 + "," + idx1 + ")");
		console.log(not_comm1);
		console.log(prv2);
	}
	let ii2 = prv2;
	while(not_comm1.length > 0){
		const fst2 = ii2 + 1;
		if(fst2 >= idx2){
			break;
		}
		const wd1 = not_comm1.shift();
		const not_comm2 = ana2.slice(fst2, idx2).map(oo => oo.id);
		if(DEBUG_NOT_COMMON){
			console.log("not_comm2");
			console.log(not_comm2);
		}
		const wd2 = closest(wd1, not_comm2);
		const iwd2 = not_comm2.findIndex(ee => (ee === wd2));
		const aii2 = fst2 + iwd2;
		
		const obj2 = ana2[aii2];
		if(obj2.id != wd2){
			console.error("FALSE FIND");
		}
		if(obj2.added == null){ obj2.added = []; };
		if(s1[ii1] != wd1){
			console.error("FALSE ii1");
		}
		obj2.added.push({id: wd1, idx1: ii1});
		ii2 = aii2;
		ii1++;
	}
	if(not_comm1.length > 0){
		if(DEBUG_NOT_COMMON){
			console.log("ENTRA=======================================");
			console.log(not_comm1);
			console.log(ana2);
			console.log(ii2);
		}
		let obj2 = ana2[ii2];
		if(obj2 == null){
			if(ii2 < 0){
				obj2 = ana2[0];
			}
			if(ii2 >= ana2.length){
				obj2 = ana2[ana2.length - 1];
			}
		}
		if(obj2.added == null){ obj2.added = []; };
		while(not_comm1.length > 0){
			const wd1 = not_comm1.shift();
			if(s1[ii1] != wd1){
				console.error("FALSE ii1 (case 2)");
			}			
			obj2.added.push({id: wd1, idx1: ii1});
			ii1++;
		}
	}
}

export function find_ana(s1, s2, ana2){
	const rr = [];
	let prv1 = -1;
	let prv2 = -1;
	diffSequence(
		s1.length,
		s2.length,
		(idx1, idx2) => Object.is(s1[idx1], s2[idx2]),
		(n_comm, idx1, idx2) => {
			add_common(rr, s1, n_comm, idx1);
			mark_common(ana2, n_comm, idx2, idx1);
			add_not_common(ana2, prv2, idx2, s1, prv1, idx1);
			prv1 = idx1 + n_comm - 1;
			prv2 = idx2 + n_comm - 1;
		},
	);
	add_not_common(ana2, prv2, s2.length, s1, prv1, s1.length);
	return rr;
}

function get_spart(sparts, obj){
	if(sparts == null){ return null; }
	if(obj == null){ return null; }
	const scod = obj.sco;
	if(scod == null){ return null; }
	if(DEBUG_ANALYSIS){ console.log(`get_spart. SCOD=${scod}`); }
	const pp = sparts[scod];
	if(pp == null){ return null; }
	if(pp.length == 0){ return null; }
	const ocu = pp.shift();
	if(ocu == null){ return null; }
	if(DEBUG_ANALYSIS){ console.log(`get_spart. STX=${ocu.stx}`); }
	return ocu.stx;
}

async function get_obj_translation(obj, sparts, bibobj){
	let tra = get_spart(sparts, obj);
	if(tra != null){
		obj.is_stra = true;
	}
	
	const ltra = bibobj.loc_tra;
	if((tra == null) && (ltra != null)){
		tra = await get_local_text(ltra, obj.idtra);
		if(sparts != null){
			obj.dict = bibobj.ltra_dict;
		}
	}
	return tra;
}

async function fill_translation(bibobj, fullana){
	const ana = fullana.ana;
	let sparts = null;
	if(bibobj.sparts != null){
		sparts = JSON.parse(JSON.stringify(bibobj.sparts));
	}
	let ii = 0;
	for(; ii < ana.length; ii++){
		const obj = ana[ii];		
		obj.dict = bibobj.dict;
		obj.tra = await get_obj_translation(obj, sparts, bibobj);
		if(obj.added != null){
			fill_added_obj_translation(obj, sparts, bibobj);
		}
	}
}

async function fill_added_obj_translation(pnt, sparts, bibobj){
	const added = pnt.added;
	let ii = 0;
	for(; ii < added.length; ii++){
		const obj = added[ii];
		if((obj.sco != null) && (obj.tra == null)){
			obj.dict = bibobj.dict;
			obj.tra = await get_obj_translation(obj, sparts, bibobj);
		} 
	}
}

export async function get_verse_refs(verse_id){
	const locid = "REFS1";
	try{
		await import_local_vrefs(locid);
		
		return gvar.full_vrefs[locid][verse_id];
	} catch {
		console.error("FAILED get_vrefs " + locid + " " + verse_id);
		return null;
	}
}

async function import_local_vrefs(locid){
	if(local_vrefs_files[locid] == null){
		return;
	}
	if(gvar.full_vrefs == null){
		gvar.full_vrefs = {};
	} 
	if(gvar.full_vrefs[locid] != null){
		return;
	}
	const loc_fl = local_vrefs_files[locid];
	const md_loc = await import_file(loc_fl, locid);
	
	gvar.full_vrefs[locid] = md_loc.verse_refs;
}

export async function get_local_text(locid, idtxt){
	try{
		await import_local_text(locid);
		
		return gvar.full_local_text[locid][idtxt];
	} catch {
		console.error("FAILED get_local_text " + locid + " " + idtxt);
		return null;
	}
}

async function import_local_text(locid){
	if(local_text_files[locid] == null){
		return;
	}
	if(gvar.full_local_text == null){
		gvar.full_local_text = {};
	} 
	if(gvar.full_local_text[locid] != null){
		return;
	}
	const loc_fl = local_text_files[locid];
	const md_loc = await import_file(loc_fl, locid);
	
	gvar.full_local_text[locid] = md_loc.loc_txt;
}

export async function get_bible_verse(bib_cod, book, chapter, verse){
	try{
		await import_bible(bib_cod);
	
		let vtxt = gvar.full_bible[bib_cod][book][chapter][verse];
		return vtxt;
	} catch (err) {
		console.error("FAILED get_bible_verse " + bib_cod + " " + book + ":" + chapter + ":" + verse);
		return null;
	}
}

async function import_file(bib_fl, fl_id){
	await start_loading(bib_fl, fl_id, true);
	add_dbg_log("importing file " + bib_fl);
	
	const resp = await import(bib_fl);

	add_dbg_log("FINISHED importing file " + bib_fl);
	end_loading();
	return resp;
}

async function import_bible(bib_cod){
	if(local_bible_files[bib_cod] == null){
		return;
	}
	if(gvar.full_bible == null){
		gvar.full_bible = {};
	} 
	if(gvar.full_bible[bib_cod] != null){
		return;
	}
	const bib_fl = local_bible_files[bib_cod];
	const md_bib = await import_file(bib_fl, bib_cod);
	
	gvar.full_bible[bib_cod] = md_bib.bib_verses;	
}

export function get_citation(bibobj){
	let vcit = "INVALID_CITATION";
	if((bibobj.book != null) && (bibobj.chapter != null) && (bibobj.verse != null)){ 
		vcit = get_loc_book_abbr(bibobj.book) + "." + bibobj.chapter + ":" + bibobj.verse;
		if((bibobj.last_verse != null) && (bibobj.last_verse != "")){ vcit = vcit + "-" + bibobj.last_verse; }
	}
	return vcit;
}

export function fill_bibobj_cit_and_ref(bibobj){
	const cit_obj = JSON.parse(JSON.stringify(bibobj));
	cit_obj.bib_ver = "text";
	cit_obj.site = "biblehub";
	
	bibobj.href_bh = make_bible_ref(cit_obj);
	bibobj.vcit = get_citation(bibobj);
}

export function calc_vstxt(vtxt){
	let vstxt = vtxt.replace(/\[/g, '<');
	vstxt = vstxt.replace(/\]/g, CLOSING_STRONG);
	return vstxt;
}

function calc_bibobj_vstxt(bibobj){
	let vtxt = bibobj.vtxt;
	if((vtxt != null) && gvar.is_strong_bib[bibobj.bible]){
		let vstxt = calc_vstxt(vtxt);
		bibobj.vstxt = vstxt;
		if(DEBUG_VSTXT){
			console.log(`fill_bibobj_vtxt. vstxt=${vstxt}`);
		}
	}
}

export async function fill_bibobj_vtxt(bibobj){
	if((bibobj.book != null) && (bibobj.chapter != null) && (bibobj.verse != null)){ 
		let vtxt = await get_bible_verse(bibobj.bible, gvar.num2book_en[bibobj.book], bibobj.chapter, bibobj.verse);		
		bibobj.vtxt = vtxt;
		calc_bibobj_vstxt(bibobj);
	}	
	if(DEBUG_FILL_BIBOBJ){
		console.log("fill_bibobj_vtxt");
		console.log(bibobj);
	}	
}

const regex_scode = /^([HGhg])(\d+)$/;

export function make_strong_ref(scod){
	let bibref = null;
	const cod = scod.toUpperCase();
	const matches = cod.match(regex_scode);	
	if(matches){
		const kk = matches[1];
		let lang = "hebrew";
		if(kk == "G"){
			lang = "greek";
		}
		let num = Number(matches[2]);
		bibref = `https://www.biblehub.com/${lang}/${num}.htm`;
	}
	return bibref;
}

function make_bible_ref(cit_obj){
	// https://www.biblegateway.com/passage/?search=exodus+1%3A4-7&version=RVR1960
	const book_nam =  get_book_nam(cit_obj.book);
	//console.log("make_bible_ref. cit_obj= " + JSON.stringify(cit_obj, null, "  ") + "\nbook_nam=" + book_nam);
	let bibref = null;
	if(cit_obj.site == "blueletterbible"){
		bibref = "https://www.blueletterbible.org/" + cit_obj.bib_ver + "/" + cit_obj.abbr + "/" + cit_obj.chapter + "/" + cit_obj.verse;
		return bibref;
		//https://www.blueletterbible.org/kjv/mat/3/4/
	}
	if(cit_obj.site == "biblehub"){
		if(cit_obj.bib_ver == "text"){
			bibref = "https://www.biblehub.com/text/" + book_nam + "/" + cit_obj.chapter + "-" + cit_obj.verse + ".htm";
			return bibref;
		} else {
			bibref = "https://www.biblehub.com/" + cit_obj.bib_ver + "/" + book_nam + "/" + cit_obj.chapter + ".htm";
			return bibref;
		}
	}
	if(cit_obj.site == "bibliaparalela"){
		// https://bibliaparalela.com/nblh/genesis/1.htm
		bibref = "https://bibliaparalela.com/" + cit_obj.bib_ver + "/" + book_nam + "/" + cit_obj.chapter + ".htm";
		return bibref;
	}
	if(cit_obj.site == "biblegateway"){
		bibref = "https://www.biblegateway.com/passage/?search=" + book_nam + "+" + cit_obj.chapter + ":" + cit_obj.verse;
		if(! (cit_obj.last_verse == bib_defaults.LAST_VERSE)){
			bibref += "-" + cit_obj.last_verse;
		}
		bibref += "&version=" + cit_obj.bib_ver;
		return bibref;
	}
	
}

function get_book_nam(book){
	let book_nam = book; 
	if(isNaN(book)){ // bibrefs references
		book_nam = book;
	} else { // normal references
		let num = Number(book);
		book_nam =  gvar.num2book_en[num];
	}
	return book_nam;
}

/*
function get_loc_book_nam(book){
	let num = -1;
	if(isNaN(book)){ // bibrefs references
		num = gvar.book2num[book];
	} else { // normal references
		num = Number(book);
	}
	let book_nam =  gvar.num2book[num];  
	return book_nam;
}*/

function get_loc_book_abbr(book){
	let num = -1;
	if(isNaN(book)){ // bibrefs references
		num = gvar.book2num[book];
	} else { // normal references
		num = Number(book);
	}
	let book_nam =  gvar.num2abbr[num];  
	return book_nam;
}

function word_to_min_greek(word){
	const letras = word.split('');
	let gre = letras.map(ll => ascii_to_min_greek[ll]);
	return gre.join('');
}

export function verse_to_min_greek(verse){
	const all_ww = verse.split(' ');
	let gre = all_ww.map(ww => word_to_min_greek(ww));
	return gre.join(' ');
}

function word_to_may_greek(word){
	const letras = word.split('');
	let gre = letras.map(ll => ascii_to_may_greek[ll]);
	return gre.join('');
}

export function verse_to_may_greek(verse){
	const all_ww = verse.split(' ');
	let gre = all_ww.map(ww => word_to_may_greek(ww));
	return gre.join(' ');
}

function word_to_hebrew(word){
	const letras = word.split('');
	const last = letras[letras.length - 1];
	if(ascii_heb_finals[last] != null){
		letras[letras.length - 1] = last + 'f';
	}
	let heb = letras.map(ll => ascii_to_hebrew[ll]);
	return heb.join('');
}

export function verse_to_hebrew(verse){
	const all_ww = verse.split(' ');
	let heb = all_ww.map(ww => word_to_hebrew(ww));
	return heb.join(' ');
}

export async function get_scode_verses(bib_cod, scode){
	try{
		await import_scodes(bib_cod);
		
		let resp = gvar.full_scodes[bib_cod][scode];
		if(resp == null){
			resp = "";
		}
		return resp;
	} catch {
		console.error("FAILED get_scode_verses " + bib_cod + " " + scode);
		return null;
	}
}

async function import_scodes(bib_cod){
	if(local_scods_files[bib_cod] == null){
		return;
	}
	if(gvar.full_scodes == null){
		gvar.full_scodes = {};
	} 
	if(gvar.full_scodes[bib_cod] != null){
		return;
	}
	const scod_fl = local_scods_files[bib_cod];
	const md_scod = await import_file(scod_fl, bib_cod);
	
	gvar.full_scodes[bib_cod] = md_scod.scode_verses;	
}

export async function get_scode_mutus(scode){
	try{
		await import_smutus();
		
		let resp = gvar.full_smutus[scode];
		if(resp == null){
			resp = "";
		}
		return resp;
	} catch {
		console.error("FAILED get_scode_mutus " + scode);
		return null;
	}
}

async function import_smutus(){
	if(gvar.full_smutus != null){
		return;
	}
	const md_smutus = await import_file(local_smutus_file, "SMUTUS");
	
	gvar.full_smutus = md_smutus.loc_txt;	
}

export async function get_scode_roots(scode){
	try{
		await import_sroots();
		
		let resp = gvar.full_sroots[scode];
		if(resp == null){
			resp = "";
		}
		return resp;
	} catch {
		console.error("FAILED get_scode_roots " + scode);
		return null;
	}
}

async function import_sroots(){
	if(gvar.full_sroots != null){
		return;
	}
	const md_sroots = await import_file(local_sroots_file, "SROOTS");
	
	gvar.full_sroots = md_sroots.loc_txt;	
}

export async function get_next_scode(scode){
	const all_sdefs = await get_sdefs();
	if(all_sdefs == null){
		return null;
	}
	let nxt = calc_next_scode(scode);
	while(nxt != null){
		if(all_sdefs[nxt] != null){
			return nxt;
		}
		nxt = calc_next_scode(nxt);
	}
	return null;
}

export async function get_prev_scode(scode){
	const all_sdefs = await get_sdefs();
	if(all_sdefs == null){
		return null;
	}
	let prv = calc_prev_scode(scode);
	while(prv != null){
		if(all_sdefs[prv] != null){
			return prv;
		}
		prv = calc_prev_scode(prv);
	}
	return null;
}

export async function get_sdefs(){
	try{
		await import_sdefs("SDEFS");		
		return gvar.full_sdefs.SDEFS;
	} catch {
		console.error("cannot get_sdefs");
		return null;
	}
}

export async function get_scode_def(scode, lang){
	const bad = { asc:"", def:"", };
	const all_sdefs = await get_sdefs();
	if(all_sdefs == null){
		return bad;
	}
	try{
		let arr_def = all_sdefs[scode];
		if(arr_def == null){
			return bad;
		}
		await import_sdefs(lang);
		if(arr_def.length != 2){
			return bad;
		}
		const scod_asc = arr_def[0];
		const scod_id = arr_def[1];
		let scod_def = gvar.full_sdefs[lang][scod_id];
		if(scod_def == null){
			return bad;
		}
		return { asc: scod_asc, def: scod_def, };
	} catch {
		console.error("FAILED get_scode_def(" + scode + ", " + lang + ")");
		return bad;
	}
}

async function import_sdefs(lang){
	if(local_sdefs_files[lang] == null){
		return;
	}
	if(gvar.full_sdefs == null){
		gvar.full_sdefs = {};
	} 
	if(gvar.full_sdefs[lang] != null){
		return;
	}
	const scod_fl = local_sdefs_files[lang];
	const md_scod = await import_file(scod_fl, lang);
	
	let defs = md_scod.loc_txt;
	if(lang == "SDEFS"){
		defs = md_scod.scod_defs;
	}
	gvar.full_sdefs[lang] = defs;
}

function get_loaded_files_from(file_names, loaded){
	if(loaded == null){
		return [];
	}
	const all_kk = Object.keys(file_names);
	let ii = 0;
	const all_loaded = [];
	for(ii = 0; ii < all_kk.length; ii++){
		const nm = all_kk[ii];
		if(loaded[nm] != null){
			all_loaded.push(nm);
		}
	}
	return all_loaded;
}

export function dbg_log_all_loaded_files(){
	if(! gvar.dbg_biblang){
		return;
	}
	add_dbg_log("FILES ALREADY LOADED AT START OF BIBLANG COMMAND");
	const f1 = get_loaded_files_from(local_text_files, gvar.full_local_text);
	const f2 = get_loaded_files_from(local_scods_files, gvar.full_scodes);
	const f3 = get_loaded_files_from(local_bible_files, gvar.full_bible);
	const f4 = get_loaded_files_from(local_sdefs_files, gvar.full_sdefs);
	const all_f = [...new Set([...f1, ...f2, ...f3, ...f4])];
	const str_f = all_f.join(" , ");
	add_dbg_log(str_f);
	add_dbg_log("_______________________________");
}

function img_renderized(img_elem){
	return new Promise(resolve => {
		img_elem.onload = () => {
			requestAnimationFrame(resolve);
		}
	});
}

async function download_file(file_nam) {
	if(in_nodejs()){	// working from node
		return;
	}
	// download_bar css class
	const pbar = document.getElementById(id_ui_loading);
	const resp = await fetch(file_nam);
	const rdr = resp.body.getReader();
	const full_len = resp.headers.get('content-length');
	let num_recv = 0;

	while (true) {
		const { done, value } = await rdr.read();
		if(done){
			break;
		}
		num_recv += value.length;
		pbar.value = num_recv / full_len;
	}

	//const texto = await resp.text();
	//console.log(texto);
}

async function in_cache(file_nam){
	const resp = await fetch(file_nam, { cache: 'only-if-cached' }).catch(() => {
		return false;
	});
	if(resp.ok){
		if(DEBUG_BIBLE_MGR){ console.log("" + file_nam + " ALREADY IN CACHE (1)"); }
		return true;
	} 
	return false;
}

async function is_cached(url) {
	try {
		const response = await fetch(url, {
			cache: 'only-if-cached',
			mode: 'same-origin' // Required for 'only-if-cached'
		});

		if (response.ok) {
			//const data = await response.json();
			return true;
			//console.log('Data retrieved from cache:', data);
		} else if (response.status === 504) {
			return false;
			//console.log('Resource not found in cache (504 Gateway Timeout).');
		} else {
			console.error(`Error: ${response.status} - ${response.statusText}`);
			return false;
		}
	} catch (error) {
		console.error(url + ' NOT CACHED. Fetch error.', error);
		return false;
	}
	return false;
}

async function start_loading(file_nam, fl_id, use_pbar){
	if(in_nodejs()){	// working from node
		return;
	}
	let msg_in_cache = "";
	const is_ok = await is_cached(file_nam);
	if(is_ok){
		if(DEBUG_BIBLE_MGR){ console.log("" + file_nam + " ALREADY IN CACHE (2)"); }
		msg_in_cache = gvar.all_msg.in_cache;
		//return;
	}
	//gvar.curr_dv_ver_id
	let dv_loading = document.getElementById(id_dv_loading);
	if(dv_loading != null){
		return;
	}
	
	const dv_verses = document.getElementById("id_verses");
	let dv_ver_to_ana = null;
	if(gvar.curr_dv_ver_id != null){
		dv_ver_to_ana = document.getElementById(gvar.curr_dv_ver_id);
	}
	
	const msg_ld = gvar.all_msg.loading;
	const tag_fl_nam = `<div class="file_loading_name"><a class="exam_ref" href=${file_nam}>${msg_ld} ${fl_id}</a> ${msg_in_cache}</div><br>`;
	let tag_img = `<img id="${id_ui_loading}" class="file_loading_img" width="100%" src="${loading_img}">`;
	if(use_pbar){
		tag_img = `<progress id="${id_ui_loading}" class="download_bar" value="0" max="1"></progress>`;
	}
	
	dv_loading = document.createElement("div");
	dv_loading.id = id_dv_loading;
	dv_loading.innerHTML = tag_fl_nam + tag_img;
	
	let dv_to_scroll = dv_verses;
	if(dv_ver_to_ana != null){
		dv_ver_to_ana.insertAdjacentElement('afterend', dv_loading);
		dv_to_scroll = dv_ver_to_ana;
	} else {
		dv_verses.prepend(dv_loading);
	}
	
	if(! use_pbar){
		const img_elem = document.getElementById(id_ui_loading);
		await img_renderized(img_elem);
	} else {
		await download_file(file_nam);
	}
	
	//scroll_to_top(dv_to_scroll);
	
	//await new Promise(resolve => setTImeout(resolve, 0));
}

function end_loading(){
	if(in_nodejs()){	// working from node
		return;
	}
	let dv_loading = document.getElementById(id_dv_loading);
	if(dv_loading != null){
		dv_loading.remove();
	}
	//await new Promise(resolve => setTImeout(resolve, 0));
}


function in_nodejs(){
	return (typeof window === 'undefined');
}

export function calc_next_scode(scode){
	const num = Number(scode.slice(1)) + 1;
	const is_gre = scode.startsWith(GREEK_PREFIX);
	let max = MAX_HEBREW_SCOD + 1;
	if(is_gre){
		max = MAX_GREEK_SCOD + 1;
	}
	if(num > max){
		return null;
	}
	return (scode.slice(0, 1) + num);
}

export function calc_prev_scode(scode){
	const num = Number(scode.slice(1)) - 1;
	if(num < 0){
		return null;
	}
	return (scode.slice(0, 1) + num);
}

export async function get_stra_text(straid, scod, ascid){
	try{
		await import_stra_text(straid);
		
		if(gvar.full_stra_text[straid][scod] == null){ return null; }
		return gvar.full_stra_text[straid][scod][ascid];
	} catch {
		console.error("FAILED get_local_text " + straid + " " + scod + " " + ascid);
		return null;
	}
}

async function import_stra_text(straid){
	if(stra_text_files[straid] == null){
		return;
	}
	if(gvar.full_stra_text == null){
		gvar.full_stra_text = {};
	} 
	if(gvar.full_stra_text[straid] != null){
		return;
	}
	const loc_fl = stra_text_files[straid];
	const md_loc = await import_file(loc_fl, straid);
	
	gvar.full_stra_text[straid] = md_loc.all_stra;
}

export async function get_socu_text(socuid, scod){
	try{
		await import_socu_text(socuid);
		
		if(gvar.full_socu_text[socuid][scod] == null){ return null; }
		return gvar.full_socu_text[socuid][scod];
	} catch {
		console.error("FAILED get_local_text " + socuid + " " + scod);
		return null;
	}
}

async function import_socu_text(socuid){
	if(socu_text_files[socuid] == null){
		return;
	}
	if(gvar.full_socu_text == null){
		gvar.full_socu_text = {};
	} 
	if(gvar.full_socu_text[socuid] != null){
		return;
	}
	const loc_fl = socu_text_files[socuid];
	const md_loc = await import_file(loc_fl, socuid);
	
	gvar.full_socu_text[socuid] = md_loc.all_socu;
}


/*

fetch('nom_arch.js', { cache: 'only-if-cached' }).then((resp) => {
	if(resp.ok){
		console.log("SI ESTA en cache");
	} else {
		console.log("NO esta en cache");		
	}
}).catch(() => {
	console.log("NO esta en cache");
});



//download_file();


<div id="contenedor-progreso">
  <progress id="barra-progreso" value="0" max="1"></progress>
</div>


#contenedor-progreso {
  width: 300px; 
  border: 1px solid #ccc; 
  padding: 5px; 
}

#barra-progreso {
  width: 100%; 
  height: 20px; 
}

*/



