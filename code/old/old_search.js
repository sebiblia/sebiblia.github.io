
	gvar.fields_stg_def		get_scode_full_def(scode, lang)

	orig: `Original:`,
	tran: `Transliteration:`,
	phon: `Phonetic:`,
	bdbd: `BDB Definition:`,
	thad: `Thayer Definition:`,
	orin: `Origin:`,
	twot: `TWOT entry:`,
	tdnt: `TDNT entry:`,
	posp: `Part(s) of speech:`,
	sdef: `Strong's Definition:`,


	const nw_style = document.createElement('style');
	const fml_def = `
		@font-fase {
			font-family: '${fmly}';
			src: url('https://fonts.googleapis.com/css?family=${fnam}');
		}
	`;
	if(DEBUG_FORMAT){ console.log(`add_google_font def= ${fml_def}`); }
	nw_style.innerHTML = fml_def;
	document.head.appendChild(nw_style);



