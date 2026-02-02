
const fs = require('fs');
const readline = require('readline');

if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' <file_name> [<version>]');
	process.exit(1);
}

const file_nm = process.argv[2];
let bib_version = "bib";
if(process.argv.length > 3){
    bib_version = process.argv[3];
}

const max_verses = 500;
const js_ext = ".js";

const book_names = {
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

const dir = './tmp/but/then/nested';

async function read_file_by_lines(file_nm) {
	console.log(file_nm);
	const f_stm = fs.createReadStream(file_nm);
	
	const rl = readline.createInterface({
		input: f_stm,
		crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.

	const full_idx = {};
	
	let curr_book = null;
	let curr_chapter = null;
	let full_chapter = {};
	let file_cnt = 0;
	let full_file = {};
	//for await (const line of rl) {
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		const by_vs = line.split('|');
		const vs_book = by_vs[0];
		const vs_chapter = by_vs[1];
		const vs_verse = by_vs[2];
		const vs_content = by_vs[3];
		
		if(curr_book == null){ curr_book = vs_book; }
		if(curr_chapter == null){ curr_chapter = vs_chapter; }

		const set_nw = ((vs_book != curr_book) || (vs_chapter != curr_chapter));
		if(set_nw){
			add__to_file(full_file, curr_book, curr_chapter, full_chapter);
			
			curr_book = vs_book;
			curr_chapter = vs_chapter;
			
			full_chapter = {};
		}
		
		const cnt = vs_content.replace(/"/g, "'")
						.replace(/”/g, "'")  
						.replace(/“/g, "'");
		
		full_chapter[vs_verse] = cnt;
	}
	
	add__to_file(full_file, curr_book, curr_chapter, full_chapter);
	
	write_file(full_file);
}

function add__to_file(full_file, curr_book, curr_chapter, full_chapter){
	const bk_nm = book_names[curr_book];
	if(full_file[bk_nm] == null){ full_file[bk_nm] = {}; };
	const the_book = full_file[bk_nm];
	the_book[curr_chapter] = full_chapter;
}

function write_file(full_file){
	const all_verses = JSON.stringify(full_file, null, "  ");
	const pth = "./" + bib_version + "_BIB.js";
		
	const file_str = `
	
export const bib_verses = ${all_verses};

`;

	fs.writeFileSync(pth, file_str);
	console.log("WROTE FILE=" + pth);
}

read_file_by_lines(file_nm);

