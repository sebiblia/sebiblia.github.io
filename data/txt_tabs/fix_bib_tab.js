
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';

//const fs = require('fs');
//const path = require('path');
//const readline = require('readline');

const DEBUG_FIX = false;
const DEBUG_JUST_COPY = false;
const DEBUG_SHIFT = false;

const ST = {
	FIND: 1,
	READ: 2,
};

const OP = {
	ADD_NXT: "add_next",
	DIV_IDX: "div_idx",
	SHIFT: "shift",
};

const is_op = {
	add_next: true,
	div_idx: true,
	shift: true,
};

function ck_vr(v1){
	if(v1 == null){
		console.error("v1 == null");
		return false;
	}
	if(v1.length != 3){
		console.error("v1.length != 3");
		return false;
	}
	return true;
}

function fill_lims(oper) {
	oper.vbeg = vid2vr(oper.beg);
	if(oper.op == OP.SHIFT){ 
		oper.vend = vid2vr(oper.end); 
		oper.vend[2] += 1;
	} else if(oper.op == OP.DIV_IDX){ 
		oper.vend = vid2vr(oper.beg); 
		oper.vend[2] += 1;
		if(oper.idxs != null){
			oper.didx = oper.idxs.shift();
			//console.log(`oper.didx = ${oper.didx}`);
		}			
	} else if(oper.op == OP.ADD_NXT){  
		oper.vend = vid2vr(oper.beg); 
		oper.vend[2] += 2;
	} else {
		throw new Error(`Invalid oper "${JSON.stringify(oper)}")`);
	}
}

function cmp_num(n1, n2){
	return (n1 - n2);
}

function cmp_vr(v1, v2){
	if(DEBUG_FIX){
		console.log("cmp_vr");
		console.log(v1);
		console.log(v2);
		console.log("____");
	}
	if(! ck_vr(v1)){ return -1; }
	if(! ck_vr(v2)){ return -1; }
	let cc = cmp_num(v1[0], v2[0]);
	if(cc != 0){ return cc; }
	cc = cmp_num(v1[1], v2[1]);
	if(cc != 0){ return cc; }
	cc = cmp_num(v1[2], v2[2]);
	return cc;
}

function vid2vr(vid) {
	return vid.split(':').map(ee => Number(ee));
}

function test_cmp_vr() {
	let v1 = [3, 4, 6,];
	let v2 = [3, 4, 2,];
	console.log(v1);
	console.log(v2);
	console.log(cmp_vr(v1, v2));
}

async function read_file_by_lines() {
	if(process.argv.length < 4) {
		console.log('Usage: node ' + process.argv[1] + ' <file_name> <json_opers_file>');
		process.exit(1);
	}

	const fnam = process.argv[2];
	const opers_nm = process.argv[3];

	const conf = await import(opers_nm);
	if(conf == null){
		console.error("conf == null");
		return;
	}
	
	const all_op = conf.all_op;
	//const opers = require(opers_nm);

	const tab_ext = ".tab";
	const json_ext = ".json";
	
	const f_stm = fs.createReadStream(fnam);
	const f_out_nm = path.basename(fnam, tab_ext) + "_fix.tab";
	//const wrt = fs.createWriteStream(f_out_nm, { flags:'a' });
	const wrt = fs.createWriteStream(f_out_nm);
	
	const rl = readline.createInterface({
		input: f_stm,
		crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.
	console.log(all_op);
	
	if(all_op == null){
		console.error("all_op == null");
	}
	if(all_op.length == 0){
		console.log("all_op.length == 0");
		return;
	}
	
	let oper = all_op.shift();
	fill_lims(oper);
	
	let reading = false;
	
	let all_read = [];

	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		if(DEBUG_FIX){
			console.log("reading=" + reading);
		}
		
		const rvr = line.split('|');
		const vrid = rvr[0];
		const vr = vid2vr(vrid);
		
		if(oper == null){
			wrt.write(line + '\n');
			continue;
		}
		
		const was_reading = reading;

		let nxt_op = false;
		let tgt = oper.vbeg;
		if(reading){ tgt = oper.vend; }
		const rcc = cmp_vr(vr, tgt);
		
		if(DEBUG_FIX){ console.log(rcc);	}		
		if(rcc > 0){
			if(DEBUG_FIX){ console.log("rcc > 0"); }
			if(reading){ 
				throw new Error(`${vr.join(":")} > ${tgt.join(":")} during oper "${JSON.stringify(oper)}")`); 				
			} else {
				nxt_op = true;
			}
		} else if(rcc < 0){
			if(DEBUG_FIX){ console.log("rcc < 0"); }
			if(reading){ 
				all_read.push(line); 
			} else {			
				wrt.write(line + '\n');
			}
		} else {
			if(DEBUG_FIX){ console.log("rcc == 0"); }
			if(rcc != 0){ throw new Error(`${vr.join(":")} != ${tgt.join(":")} during oper "${JSON.stringify(oper)}")`);  }
			if(reading){ 
				process_all_read(oper, all_read, wrt);
				all_read = [];
				reading = false;
				nxt_op = true;
			} else {			
				all_read.push(line);
				reading = true;
			}
		}
			
		if(nxt_op){
			nxt_op = false;
			let is_beg = false
			if(all_op.length == 0){
				oper = null;
			} else {
				oper = all_op.shift();	
				fill_lims(oper);
				const rcc2 = cmp_vr(vr, oper.vbeg);
				is_beg = (rcc2 == 0);
			}
			if(is_beg){
				all_read.push(line);
				reading = true;
			} else {
				wrt.write(line + '\n');
			}
		}
	}	
	if((all_read.length > 0) && (oper != null)){
		process_all_read(oper, all_read, wrt);
	}

	wrt.end();
	console.log("WROTE FILE=" + f_out_nm);
}

function process_all_read(oper, all_read, wrt){
	console.log("oper=");
	console.log(oper);
	console.log("all_read=");
	console.log(all_read);

	let iverse = null;
	let pidx = null;
	
	let obook = null;
	let ochapter = null;
	let overse = null;
	let oidx = null;
	
	let opid = oper.op;

	if(opid == OP.SHIFT){
		const ovr = vid2vr(oper.new_beg);
		obook = ovr[0];
		ochapter = ovr[1];
		overse = ovr[2];
	}
	
	let adding = false;
	let dividing = false;

	let ii = 0;
	for(ii = 0; ii < all_read.length; ii++){
		const line = all_read[ii];
		const rvr = line.split('|');
		const vrid = rvr[0];
		//const vr = vrid.split(':').map(rcc => Number(rcc));
		const vr = vid2vr(vrid);
		const book = vr[0];
		const chapter = vr[1];
		const verse = vr[2];
		const idx = rvr[1];
		const tok = rvr[2];
		const sco = rvr[3];
		
		if(DEBUG_JUST_COPY){
			const out = `${book}:${chapter}:${verse}|${idx}|${tok}|${sco}\n`;
			wrt.write(out);
			continue;
		}
		
		if(iverse == null){ iverse = verse; }
		if(pidx == null){ pidx = idx; }
		
		if(obook == null){
			const bvr = oper.vbeg;
			obook = bvr[0];
			ochapter = bvr[1];
			overse = bvr[2];
			if(obook != book){ throw new Error(`${oper.beg} != ${vrid} during oper "${JSON.stringify(oper)}")`); }
			if(ochapter != chapter){ throw new Error(`${oper.beg} != ${vrid} during oper "${JSON.stringify(oper)}")`); }
			if(overse != verse){ throw new Error(`${oper.beg} != ${vrid} during oper "${JSON.stringify(oper)}")`); }
		}

		if(DEBUG_SHIFT){
			console.log(`(vrid == oper.end) (${vrid} == ${oper.end})`);
		}
		const div_last = ((opid == OP.SHIFT) && (vrid == oper.end) && (oper.idxs != null) && (oper.idxs.length > 0) && (oper.didx == null));
		if(div_last){
			oper.didx = oper.idxs.shift();
			if(DEBUG_SHIFT){
				console.log(`IS EQUAL oper.didx=${oper.didx}`);
			}
		}
		
		if((oper.didx != null) && (idx == oper.didx)){
			dividing = true;
			overse++;
			oidx = 0;
			oper.didx = oper.idxs.shift();
		}
		/*
		if(! dividing && (opid == OP.DIV_IDX) && (idx == oper.didx)){
			dividing = true;
			overse++;
			oidx = 0;
			oper.didx = oper.idxs.shift();
		}*/
		if(verse > iverse){
			if(adding || dividing){ console.error("adding || dividing"); throw new Error(`Error 3 during oper "${JSON.stringify(oper)}")`); }
			iverse = verse;
			if(opid != OP.ADD_NXT){
				overse++;
			} else {
				adding = true;
			}
		}
		if(! adding && ! dividing){
			oidx = idx;
		} else {
			oidx++;
		}
		
		const out = `${obook}:${ochapter}:${overse}|${oidx}|${tok}|${sco}\n`;
		wrt.write(out);
	}
	
	return true;
}

read_file_by_lines();

