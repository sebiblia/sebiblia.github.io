
const fs = require('fs');
const readline = require('readline');

const DEBUG_FILL_SPARTS = false;

if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' <file_name>');
	process.exit(1);
}

const file_nm = process.argv[2];

async function read_file_by_lines(file_nm) {
	//console.log(file_nm);
	const f_stm = fs.createReadStream(file_nm);
	
	const rl = readline.createInterface({
		input: f_stm,
		crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.

	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		const by_vs = line.split('|');
		//const vid = by_vs[0].split(":");
		const vs_book = by_vs[0];
		const vs_chapter = by_vs[1];
		const vs_verse = by_vs[2];
		const vtxt = by_vs[3];

		//const aux = "" + vs_book + '|' + vs_chapter + '|' + vs_verse + '|' + vtxt;
		//console.log(vtxt);
		
		const parts = get_verse_parts(vtxt);
		
		const vscods = Object.keys(parts);
		let ii = 0;
		for(; ii < vscods.length; ii++){
			const sco = vscods[ii];
			const vocus = parts[sco];
			let kk = 0;
			for(; kk < vocus.length; kk++){
				const ocu = vocus[kk];
				let tra = ocu.stx;
				tra = tra.toLowerCase().split(/\s+/).join(' ').trim();
				
				const idx = kk + 1;
				const row = "" + vs_book + '|' + vs_chapter + '|' + vs_verse + '|' + sco + '|' + idx + '|' + tra;
				console.log(row);
			}
		}
	}
	
}

read_file_by_lines(file_nm);

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

