
import * as filesys from "node:fs";
import * as readline from "node:readline";
import * as sdic_es from '../../data/sdic/strong_defs.es.js';

/*
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
*/


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

function write_file(full_file, fout_nm){
	const all_verses = JSON.stringify(full_file, null, "  ");
	const pth = "./" + fout_nm;

	const file_str = `

export const sdic = ${all_verses};

`;

	filesys.writeFileSync(pth, file_str);
	console.log("WROTE FILE=" + pth);
}

async function read_file_by_lines(file_nm) {
	const f_stm = filesys.createReadStream(file_nm);

	const rl = readline.createInterface({
		input: f_stm,
		crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.

	let full_file = {};
	//for await (const line of rl) {
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		const by_vs = line.split('|');
	}
	write_file(full_file);
}

async function main_cano(){
	/*
	if (process.argv.length < 3) {
		console.log('Usage: node ' + process.argv[1] + ' <command>');
		process.exit(1);
	}
	
	const command = process.argv[2];
	*/
	let dic_es = sdic_es.sdic;
	let ii = 0;
	let keys = Object.keys(dic_es);
	for(ii = 0; ii < 10; ii++){
		const kk = keys[ii];
		console.log("KEY=" + kk);
	}

}

main_cano();

