
const fs = require('fs');
const readline = require('readline');

if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' <file_name>');
	process.exit(1);
}

const file_nm = process.argv[2];

const max_verses = 500;
const js_ext = ".js";

const dir = './tmp/but/then/nested';

async function read_file_by_lines(file_nm) {
	const f_stm = fs.createReadStream(file_nm);
	
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
		const by_cid = line.split('|');
		const cid = by_cid[0];
		const tra = by_cid[1];
		const cnt = Number(by_cid[2]);

		if(full_file[cid] == null){ full_file[cid] = {}; }
		full_file[cid][tra] = cnt;
	}
	
	write_file(full_file);
}

function write_file(full_file){
	const all_verses = JSON.stringify(full_file, null, "  ");
	const fnm = file_nm.split('/').pop().split('.').shift();
	const pth = './' + fnm + ".js";
		
	const file_str = `
	
export const all_socu = ${all_verses};

`;

	fs.writeFileSync(pth, file_str);
	console.log("WROTE FILE=" + pth);
}

read_file_by_lines(file_nm);

