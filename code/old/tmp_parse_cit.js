

import { gvar, } from './sf_search_mgr.js';
import { distance, closest,  } from './sf_word_dist.js';
import { bib_chapter_sizes, } from './sf_bib_chapter_sizes.js';
import { fill_range, } from './sf_biblang_mgr.js';

function is_number(val){
	if((typeof val === 'number') && ! isNaN(val)){
		return true;
	}
	return false;
}

function arr_union(aa, bb){
	if((aa == null) && (bb == null)){ return null; }
	if(aa == null){ return bb; }
	if(bb == null){ return aa; }
	return [...new Set([...aa, ...bb])];
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

// ================================================

/*
const regex_cit_end = /^-(\d+)$/;

function is_bib_end_cit(tm, citobj){
	const cha_sz = bib_chapter_sizes;
	const matches = tm.match(regex_cit_end);
	if(matches){
		citobj.verse_end = Number(matches[1]);
		if(cha_sz[citobj.book][citobj.chapter] == null){
			return false;
		}
		if(citobj.verse_end > cha_sz[citobj.book][citobj.chapter]){
			return false;
		}
		return citobj;
	}
	return false;
}

const regex_cit_vers = /^:(\d+)(.*)/;

function is_bib_verse_cit(tm, citobj){
	const cha_sz = bib_chapter_sizes;
	const matches = tm.match(regex_cit_vers);
	if(matches){
		citobj.verse = Number(matches[1]);
		if(cha_sz[citobj.book][citobj.chapter] == null){
			return false;
		}
		if(citobj.verse > cha_sz[citobj.book][citobj.chapter]){
			return false;
		}
		let rest = matches[2];
		if(rest.length > 0){
			return is_bib_end_cit(rest, citobj);
		} else {
			citobj.verse_end = citobj.verse;
		}
		return citobj;
	}		
	return false;	
}
*/

const regex_citation = /^([^.-]+)[.-](\d+)(.*)/;

export function is_bib_citation(tm){
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



