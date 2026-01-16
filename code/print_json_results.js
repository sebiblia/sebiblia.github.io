
const fs = require('fs');
const readline = require('readline');

if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' <file_name>');
	process.exit(1);
}

const file_nm = process.argv[2];
const json_ext = ".json";

async function read_file(f_nm){
	try {
		const data = await fs.readFile(f_nm, 'utf8');
		const obj = JSON.parse(data);
		console.log(obj);
	} catch (err) {
		console.error("Error leyendo archivo", err.message);
	}
}

function create_path(the_path) {
	if (!fs.existsSync(the_path)){
		fs.mkdirSync(the_path, { recursive: true });
	}	
}

async function read_file_by_lines(file_nm) {
	write_file(file_cnt, full_file);
}

function write_file(file_cnt, full_file){
	const all_verses = JSON.stringify(full_file, null, "  ");
	const pth = "./" + bib_version;
	
	create_path(pth);

	const f_nam = pth + "/" + get_bibfile_name(file_cnt);
	
	const file_str = `
	
export const bib_verses = ${all_verses};

`;

	fs.writeFileSync(f_nam, file_str);
	console.log("WROTE FILE=" + f_nam);
}

read_file(file_nm);

