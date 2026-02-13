
const fs = require('fs');
const readline = require('readline');

if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' <file_name> [<out_file_name>]');
	process.exit(1);
}

const file_nm = process.argv[2];
let out_file = "out.js";
if(process.argv.length > 3){
    out_file = process.argv[3];
}

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

	let num2vid = {};
	let vid2num = {};
	let ii = 0;
	//for await (const line of rl) {
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		const vr = line.split('+');
		const vid = `${vr[0]}:${vr[1]}:${vr[2]}`

		num2vid[ii] = vid;
		vid2num[vid] = ii;
		ii++;
	}
	
	write_file(num2vid, vid2num);
}

function write_file(num2vid, vid2num){
	const num2vid_str = JSON.stringify(num2vid, null, "  ");
	const vid2num_str = JSON.stringify(vid2num, null, "  ");
	const pth = "./" + out_file;
		
	const file_str = `
	
export const num2vid = ${num2vid_str};

export const vid2num = ${vid2num_str};

`;

	fs.writeFileSync(pth, file_str);
	console.log("WROTE FILE=" + pth);
}

read_file_by_lines(file_nm);

