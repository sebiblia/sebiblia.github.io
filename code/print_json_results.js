
const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' <file_name>');
	process.exit(1);
}

const file_nm = process.argv[2];
const json_ext = ".json";

const jobj = require(file_nm);

function calc_lines(){
	let all_lines = [];
	if(Array.isArray(jobj) && (jobj.length > 0)){
		if(jobj[0].expr != null){
			all_lines = jobj.map(itm => `"${itm.expr}","${itm.comment}"`);
		} else {
			all_lines = jobj.map(itm => `"${itm.vcit}","${itm.vtxt}"`);
		}
	} 
	return all_lines;
}

function write_file(){
	const lines = calc_lines();
	const f_nam = path.basename(file_nm, json_ext) + ".txt";
	
	const wrt = fs.createWriteStream(f_nam, { flags:'a' });
	
	let ii = 0;
	for(ii = 0; ii < lines.length; ii++){
		const line = lines[ii];
		wrt.write(`${line}\n`);
	}
	
	wrt.end();
	console.log("WROTE FILE=" + f_nam);
}

//read_file(file_nm);

console.log(jobj);
write_file();


