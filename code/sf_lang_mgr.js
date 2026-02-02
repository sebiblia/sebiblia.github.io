
import * as MOD_EX_ES from '../data/js_examples/examples_es.js';
import * as MOD_EX_EN from '../data/js_examples/examples_en.js';

import { gvar, } from './sf_search_mgr.js';

const DEFAULT_BOOK_NAME = "INVALID_BOOK_NAME";
const INVALID_BOOK_ABBR = "INVALID_BOOK_ABBR";

const shortcuts = {
	history: ' (CTRL+A+H)',
	books: ' (CTRL+A+B)',
	copy_link: ' (CTRL+A+L)',
	examples: ' (CTRL+A+E)',
	variables: ' (CTRL+A+V)',
	debug: ' (CTRL+A+D)',
	show_link: ' (CTRL+A+K)',
	save_result: ' (CTRL+A+U)',
	save_history: ' (CTRL+A+S)',
	load_history: ' (CTRL+A+R)',
	reset_history: ' (CTRL+A+I)',
	formula: ' (CTRL+A+F)',
	clear: ' (CTRL+A+C)',
	menu: ' (CTRL+A+M)',
};

const msg_es = {
	loading: "BAJANDO ",
	in_cache: "(EN CACHE)",
	finding: "Encontrando",
	scod_search: "Codigos Strong en:",
	text_search: "Texto:",
	intervals_search: "En los intervalos:",
	no_verses: "No hay vertsiculos con la configuracion dada",
	evaluating: "Calculando expresion ",
	adding_verses: "Adicionando versiculos ",
	history: `HISTORIA DE COMANDOS`,
	books: `LIBROS`,
	copy_link: `COPIAR ENLACE WEB`,
	examples: `EJEMPLOS`,
	manual: `MANUAL`,
	variables: `VARIABLES`,
	debug: `DEPURAR`,
	show_link: `MOSTRAR ENLACE WEB`,
	save_result: `SALVAR RESULTADO`,
	save_history: `SALVAR HISTORIA`,
	load_history: `RECUPERAR HISTORIA`,
	reset_history: `INICIAR HISTORIA`,
	history_name: "NOMBRE:",
	save_button: "GUARDAR",
	load_button: "RECUPERAR",
	tot_versees: "# vers",
	no_refs: "No tiene refs",
	results_fnam: "SeBiblia_resultados.json",
	history_fnam: "SeBiblia_historia.json",
	go_to_num_verse: "ir",
	show_num_verses: `<i class="has_icons icon-side-menu"></i>`,
	next_chapter: `<i class="has_icons icon-next-chap"></i>`,
	prev_chapter: `<i class="has_icons icon-prev-chap"></i>`,
	history_inited: "Historia reiniciada",
};

const msg_en = {
	loading: "LOADING ",
	in_cache: "(IN CACHE)",
	finding: "Finding",
	scod_search: "Strong Codes in:",
	text_search: "Text:",
	intervals_search: "In the intervals:",
	no_verses: "There are no verses with the configuration given",
	evaluating: "Calculating expression ",
	adding_verses: "Adding verses ",
	history: `COMMAND HISTORY (CTRL+A+H)`,
	books: `BOOKS (CTRL+A+B)`,
	copy_link: `COPY WEB LINK`,
	examples: `EXAMPLES`,
	manual: `MANUAL`,
	variables: `VARIABLES`,
	debug: `DEBUG`,
	show_link: `SHOW WEB LINK`,
	save_result: `SAVE RESULT`,
	save_history: `SAVE HISTORY`,
	load_history: `RECOVER HISTORY`,
	reset_history: `INIT HISTORY`,
	history_name: "NAME:",
	save_button: "SAVE",
	load_button: "LOAD",
	tot_versees: "# vers",
	no_refs: "It has no refs",
	results_fnam: "SeBiblia_results.json",
	history_fnam: "SeBiblia_history.json",
	go_to_num_verse: "go",
	show_num_verses: `<i class="has_icons icon-side-menu"></i>`,
	next_chapter: `<i class="has_icons icon-next-chap"></i>`,
	prev_chapter: `<i class="has_icons icon-prev-chap"></i>`,
	history_inited: "History re-inited",
};

const biblehub_abbr = "bh";
const add_abbr_en = "add";
const add_abbr_es = "adi";

const history_ops_es = ["adicionar", "eliminar", "comentar"];
const history_ops_en = ["add", "delete", "comment"];

const tok_ops_asc_id_es = ["exacto", "parcial", "adicionar"];
const tok_ops_asc_id_en = ["exact", "partial", "add"];
const tok_ops_scod_es = ["encuentra", "adi", biblehub_abbr, "rai", "mut", "ocu"];
const tok_ops_scod_en = ["find", "add", biblehub_abbr, "roo", "mut", "ocu"];

const ops_def_scod_es = ["ant", "sig", "raices", "mutuos", "ocurrencias", "encuentra", "adicionar", biblehub_abbr];
const ops_def_scod_en = ["prv", "nxt", "roots", "mutual", "occurrences", "find", "add", biblehub_abbr];

const num2book_en = {
	"-1":DEFAULT_BOOK_NAME,
	"1":"genesis",
	"2":"exodus",
	"3":"leviticus",
	"4":"numbers",
	"5":"deuteronomy",
	"6":"joshua",
	"7":"judges",
	"8":"ruth",
	"9":"1_samuel",
	"10":"2_samuel",
	"11":"1_kings",
	"12":"2_kings",
	"13":"1_chronicles",
	"14":"2_chronicles",
	"15":"ezra",
	"16":"nehemiah",
	"17":"esther",
	"18":"job",
	"19":"psalms",
	"20":"proverbs",
	"21":"ecclesiastes",
	"22":"songs",
	"23":"isaiah",
	"24":"jeremiah",
	"25":"lamentations",
	"26":"ezekiel",
	"27":"daniel",
	"28":"hosea",
	"29":"joel",
	"30":"amos",
	"31":"obadiah",
	"32":"jonah",
	"33":"micah",
	"34":"nahum",
	"35":"habakkuk",
	"36":"zephaniah",
	"37":"haggai",
	"38":"zechariah",
	"39":"malachi",
	"40":"matthew",
	"41":"mark",
	"42":"luke",
	"43":"john",
	"44":"acts",
	"45":"romans",
	"46":"1_corinthians",
	"47":"2_corinthians",
	"48":"galatians",
	"49":"ephesians",
	"50":"philippians",
	"51":"colossians",
	"52":"1_thessalonians",
	"53":"2_thessalonians",
	"54":"1_timothy",
	"55":"2_timothy",
	"56":"titus",
	"57":"philemon",
	"58":"hebrews",
	"59":"james",
	"60":"1_peter",
	"61":"2_peter",
	"62":"1_john",
	"63":"2_john",
	"64":"3_john",
	"65":"jude",
	"66":"revelation",
};

const num2book_es = {
	"-1":DEFAULT_BOOK_NAME,
	"1":"génesis",
	"2":"éxodo",
	"3":"levítico",
	"4":"números",
	"5":"deuteronomio",
	"6":"josué",
	"7":"jueces",
	"8":"rut",
	"9":"1_samuel",
	"10":"2_samuel",
	"11":"1_reyes",
	"12":"2_reyes",
	"13":"1_crónicas",
	"14":"2_crónicas",
	"15":"esdras",
	"16":"nehemías",
	"17":"ester",
	"18":"job",
	"19":"salmos",
	"20":"proverbios",
	"21":"eclesiastés",
	"22":"cantares",
	"23":"isaías",
	"24":"jeremías",
	"25":"lamentaciones",
	"26":"ezequiel",
	"27":"daniel",
	"28":"oseas",
	"29":"joel",
	"30":"amós",
	"31":"abdías",
	"32":"jonás",
	"33":"miqueas",
	"34":"nahúm",
	"35":"habacuc",
	"36":"sofonías",
	"37":"hageo",
	"38":"zacarías",
	"39":"malaquías",
	"40":"mateo",
	"41":"marcos",
	"42":"lucas",
	"43":"juan",
	"44":"hechos",
	"45":"romanos",
	"46":"1_corintios",
	"47":"2_corintios",
	"48":"gálatas",
	"49":"efesios",
	"50":"filipenses",
	"51":"colosenses",
	"52":"1_tesalonicenses",
	"53":"2_tesalonicenses",
	"54":"1_timoteo",
	"55":"2_timoteo",
	"56":"tito",
	"57":"filemón",
	"58":"hebreos",
	"59":"santiago",
	"60":"1_pedro",
	"61":"2_pedro",
	"62":"1_juan",
	"63":"2_juan",
	"64":"3_juan",
	"65":"judas",
	"66":"apocalipsis",
};

const num2abbr_en = {
	"-1":INVALID_BOOK_ABBR,
	"1":"gen",
	"2":"exo",
	"3":"lev",
	"4":"num",
	"5":"deu",
	"6":"jos",
	"7":"jdg",
	"8":"rth",
	"9":"1sa",
	"10":"2sa",
	"11":"1ki",
	"12":"2ki",
	"13":"1ch",
	"14":"2ch",
	"15":"ezr",
	"16":"neh",
	"17":"est",
	"18":"job",
	"19":"psa",
	"20":"pro",
	"21":"ecc",
	"22":"sng",
	"23":"isa",
	"24":"jer",
	"25":"lam",
	"26":"eze",
	"27":"dan",
	"28":"hos",
	"29":"joe",
	"30":"amo",
	"31":"oba",
	"32":"jon",
	"33":"mic",
	"34":"nah",
	"35":"hab",
	"36":"zep",
	"37":"hag",
	"38":"zec",
	"39":"mal",
	"40":"mat",
	"41":"mar",
	"42":"luk",
	"43":"jhn",
	"44":"act",
	"45":"rom",
	"46":"1co",
	"47":"2co",
	"48":"gal",
	"49":"eph",
	"50":"phl",
	"51":"col",
	"52":"1th",
	"53":"2th",
	"54":"1ti",
	"55":"2ti",
	"56":"tit",
	"57":"phm",
	"58":"heb",
	"59":"jas",
	"60":"1pe",
	"61":"2pe",
	"62":"1jo",
	"63":"2jo",
	"64":"3jo",
	"65":"jde",
	"66":"rev",
};

const num2abbr_es = {
	"-1":INVALID_BOOK_ABBR,
	"1":"gen",
	"2":"exo",
	"3":"lev",
	"4":"num",
	"5":"deu",
	"6":"jos",
	"7":"jue",
	"8":"rut",
	"9":"1sa",
	"10":"2sa",
	"11":"1re",
	"12":"2re",
	"13":"1cr",
	"14":"2cr",
	"15":"esd",
	"16":"neh",
	"17":"est",
	"18":"job",
	"19":"sal",
	"20":"pro",
	"21":"ecl",
	"22":"can",
	"23":"isa",
	"24":"jer",
	"25":"lam",
	"26":"eze",
	"27":"dan",
	"28":"ose",
	"29":"joe",
	"30":"amo",
	"31":"abd",
	"32":"jon",
	"33":"miq",
	"34":"nah",
	"35":"hab",
	"36":"sof",
	"37":"hag",
	"38":"zac",
	"39":"mal",
	"40":"mat",
	"41":"mar",
	"42":"luc",
	"43":"jua",
	"44":"hch",
	"45":"rom",
	"46":"1co",
	"47":"2co",
	"48":"gal",
	"49":"efe",
	"50":"fil",
	"51":"col",
	"52":"1te",
	"53":"2te",
	"54":"1ti",
	"55":"2ti",
	"56":"tit",
	"57":"flm",
	"58":"heb",
	"59":"stg",
	"60":"1pe",
	"61":"2pe",
	"62":"1ju",
	"63":"2ju",
	"64":"3ju",
	"65":"jud",
	"66":"apo",
};

const old_crit_txt_en = {
	WLC: "W. Leningrad Codex (WLC)",
	ALE: "Aleppo (ALE)",
	TKH: "Tanakh (TKH)",
	LXX: "Septuagint (LXX)",
};

const old_crit_txt_es = {
	WLC: "Codex Leningrado W. (WLC)",
	ALE: "Aleppo (ALE)",
	TKH: "Tanakh (TKH)",
	LXX: "Septuaginta (LXX)",
};

const new_crit_txt_en = {
	BYZ: "Byzantine Text (BYZ)",
	TR: "Textus Receptus (TR)",
	WH: "Wescott and Hort Text (WH)",
	NES: "Nestle 1904 Text (NES)",
};

const new_crit_txt_es = {
	BYZ: "Texto Bisantino (BYZ)",
	TR: "Textus Receptus (TR)",
	WH: "Texto Wescott and Hort (WH)",
	NES: "Texto Nestle 1904 (NES)",
};

const loc_bible_nams = {
	RVA: "Reina-Valera 1909 (RVA)",
	RVAs: "RVA con codigos Strong (RVAs)",
	KJV: "King James Bible (KJV)",
	KJVs: "KJV with Strong Codes (KJVs)",
	SBLM: "Sagrada Biblia Libre para el Mundo (SBLM)",
	WEB: "World Estandard Bible (WEB)",
};

const is_strong_bib = {
	RVAs: true,
	RVAsi: true,
	KJVs: true,
};

const tgt_rx_en = {
	"1": "Use Old Tes. (OT) = ",
	"2": "Use New Tes. (NT) = ",
	"3": "Use Local bible (LOC) = ",
};

const tgt_rx_es = {
	"1": "Use Antiguo Tes. (OT) = ",
	"2": "Use Nuevo Tes. (NT) = ",
	"3": "Use Biblia Local (LOC) = ",
};

const out_txt_en = {
	"1": "Show in minuscule (MIN)",
	"2": "Show in mayuscule (MAY)",
	"3": "Show in ASCII (ASC)",
};

const out_txt_es = {
	"1": "Muestre en minusculas (MIN)",
	"2": "Muestre en mayusculas (MAY)",
	"3": "Muestre en ASCII (ASC)",
};

const tra_txt = {
	"1": "Unified from KJVs (uKJV)",
	"2": "Unificada de la RVAs (uRVA)",
	"3": "BH English (Ben)",
	"4": "BH Inglés -> Español (B2es)",
	"5": "English Strong code def (Sen)",
	"6": "Def. Español del Código Strong (Ses)",
	"7": "Bib tra. only for KJVs and RVAs (SBIB)",
};

const bib_lang = {
	RVA: "es",
	RVAs: "es",
	KJV: "en",
	KJVs: "en",
	SBLM: "es",
	WEB: "en",
};

const tra_class = {
	"uKJV": "is_uKJV_tra",
	"uRVA": "is_uRVA_tra",
	"B2es": "is_bh_en2es_tra",
	"Ben": "is_bh_en_tra",
	"B2es": "is_bh_en2es_tra",
	"Sen": "is_stg_en_tra",
	"Ses": "is_stg_es_tra",
	"SBIB": "is_stg_loc_tra",
};

const lang_occus = {
	en: "oKJV",
	es: "oRVA",
};

const lang_utra = {
	en: "uKJV",
	es: "uRVA",
};

export function init_lang(nm_lang){
	if(nm_lang == "es"){
		init_es();
		return;
	} 
	init_en();
}

function fill_reversed_object(orig, reverse){
	for (const [key, value] of Object.entries(orig)) {
		reverse[value] = key;
		//console.log(`${key} = ${value}`);
	}  
}

function fill_insensitive(orig, bk2num){
	for (const [num, book] of Object.entries(orig)) {
		const inbook = book2inbook(book);
		bk2num[inbook] = num;
		//console.log(`${key} = ${value}`);
	}  
}

function book2inbook(bb){
	let s1 = bb.replace(/_/g, "").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");
	return s1;
}

const book2num = {};
const abbr2num = {};

function init_common(){
	fill_reversed_object(num2abbr_es, abbr2num);
	fill_reversed_object(num2abbr_en, abbr2num);
	
	fill_reversed_object(num2book_es, book2num);
	fill_insensitive(num2book_es, book2num);
	fill_reversed_object(num2book_en, book2num);
	
	gvar.num2abbr_es = num2abbr_es;
	gvar.num2abbr_en = num2abbr_en;
	gvar.abbr2num = abbr2num;
	gvar.book2num = book2num;
	gvar.num2book_es = num2book_es;
	gvar.num2book_en = num2book_en;
	gvar.biblehub_abbr = biblehub_abbr;
	gvar.bib_lang = bib_lang;
	gvar.tra_class = tra_class;
	gvar.tra_txt = tra_txt;
	gvar.lang_occus = lang_occus;
	gvar.lang_utra = lang_utra;
	gvar.loc_bible = loc_bible_nams;
	gvar.is_strong_bib = is_strong_bib;
}

function init_es(){
	init_common();
	gvar.num2abbr = num2abbr_es;
	
	gvar.lang = 'es';
	gvar.book_names = num2book_es;
	gvar.glb_all_books = num2book_es;
	gvar.num2book = num2book_es;
	gvar.all_msg = msg_es;
	
	gvar.old_crit_txt = old_crit_txt_es;
	gvar.new_crit_txt = new_crit_txt_es;
	gvar.tgt_rx = tgt_rx_es;
	gvar.out_txt = out_txt_es;
	
	gvar.history_ops = history_ops_es;
	
	gvar.tok_ops_asc_id = tok_ops_asc_id_es;
	gvar.tok_ops_scod = tok_ops_scod_es;
	gvar.ops_def_scod = ops_def_scod_es;

	gvar.add_abbr = add_abbr_es;
	gvar.examples = MOD_EX_ES.biblang_examples_es;
}

function init_en(){
	init_common();
	gvar.num2abbr = num2abbr_en;
	
	gvar.lang = 'en';
	gvar.book_names = num2book_en;
	gvar.glb_all_books = num2book_en;
	gvar.num2book = num2book_en;
	gvar.all_msg = msg_en;

	gvar.old_crit_txt = old_crit_txt_en;
	gvar.new_crit_txt = new_crit_txt_en;
	gvar.tgt_rx = tgt_rx_en;
	gvar.out_txt = out_txt_en;

	gvar.history_ops = history_ops_en;
	
	gvar.tok_ops_asc_id = tok_ops_asc_id_en;
	gvar.tok_ops_scod = tok_ops_scod_en;
	gvar.ops_def_scod = ops_def_scod_en;

	gvar.add_abbr = add_abbr_en;
	gvar.examples = MOD_EX_EN.biblang_examples_en;
}

