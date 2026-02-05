
//const cheerio = require('cheerio');

// BEFORE RUNNING THIS. Create a link to global cheerio using:
// npm link cheerio

import * as cheerio from "cheerio";
import * as filesys from "node:fs";
import { gvar, get_last_href, fill_verses, verse_cod2obj, fill_strong_parts, } from './sf_search_mgr.js';
import { init_biblang, eval_biblang_command, parse_citation, 
} from './sf_biblang_mgr.js'
import { init_lang, } from './sf_lang_mgr.js';


async function proc_file(){
	if (process.argv.length < 4) {
		console.log('Usage: node ' + process.argv[1] + ' <ifile_name> <ofilename>');
		process.exit(1);
	}

	const rx_bref = /\?search=([^&]*)\&/;

	const file_nm = process.argv[2];
	const f_out_nm = process.argv[3];

	init_lang('es');
	init_biblang('es');
	
	gvar.biblang.curr_OT = "WLC";
	gvar.biblang.curr_NT = "BYZ";	
	
	const html = filesys.readFileSync(file_nm, 'utf8');
	//const wrt = filesys.createWriteStream(f_out_nm);
	//	wrt.write(line + '\n');

	const ph = cheerio.load(html, null, false);

	//const REF = ph('a[href]').map((ii, el) => ph(el).attr('href')).get();

	//const ref2 = REF.map((rf) => decodeURIComponent(rf));

	let all_hrf = [];
	ph('a[href]').each((ii, el) => {
		all_hrf.push(el);
	});
	//console.log(all_hrf);
	
	let ii = 0;
	for(ii = 0; ii < all_hrf.length; ii++){	
		const el = all_hrf[ii];
		const oo = decodeURIComponent(ph(el).attr('href'));
		if(! oo.startsWith("#")){			
			//console.log(oo);
			const matches = oo.match(rx_bref);
			if(matches){
				let brf = matches[1];
				brf = brf.replaceAll("+", " ");
				brf = brf.trim();
				brf = brf.replaceAll(" ", ".");
				if(brf.charAt(1) === '.'){
					brf = brf.substring(0, 1) + brf.substring(2);
				}
				//console.log("FOUND_BIREF=" + brf);
				const is_cit = parse_citation(brf);
				if(! is_cit){
					console.error(oo);
					console.error("############################################################################ ERROR CON cit=" + brf);
				} else {
					//console.log(is_cit);
					const bl_obj = await eval_biblang_command(brf);
					const hrf = get_last_href("https://SeBiblia.github.io/es/tool.html");
					//console.log(hrf);
					if(hrf != null){
						const nn = ` <a href="${hrf}">SeBiblia</a> `;
						const pp = decodeURIComponent(hrf);
						console.log(pp);
						ph(el).before(nn);
					}
					//console.log(is_cit);
				}
			}
		}
	}

	filesys.writeFileSync(f_out_nm, ph.html(), 'utf8');
	//console.log(ph.html());
}

await proc_file();

