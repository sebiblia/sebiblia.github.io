

fetch('nom_arch.js', { cache: 'only-if-cached' }).then((resp) => {
	if(resp.ok){
		console.log("SI ESTA en cache");
	} else {
		console.log("NO esta en cache");
	}
}).catch(() => {
	console.log("NO esta en cache");
});



//download_file();


<div id="contenedor-progreso">
  <progress id="barra-progreso" value="0" max="1"></progress>
</div>


#contenedor-progreso {
  width: 300px;
  border: 1px solid #ccc;
  padding: 5px;
}

#barra-progreso {
  width: 100%;
  height: 20px;
}



async function import_sdefs(lang){
	if(local_sdefs_files[lang] == null){
		return;
	}
	if(gvar.full_sdefs == null){
		gvar.full_sdefs = {};
	}
	if(gvar.full_sdefs[lang] != null){
		return;
	}
	const scod_fl = local_sdefs_files[lang];
	const md_scod = await import_file(scod_fl, lang);

	let defs = md_scod.loc_txt;
	if(lang == "SDEFS"){
		defs = md_scod.scod_defs;
	}
	gvar.full_sdefs[lang] = defs;
}

async function get_sdefs(){
	try{
		await import_sdefs("SDEFS");
		return gvar.full_sdefs.SDEFS;
	} catch {
		console.error("cannot get_sdefs");
		return null;
	}
}

export async function get_scode_def(scode, lang){
	const bad = { asc:"", def:"", };
	const all_sdefs = await get_sdefs();
	if(all_sdefs == null){
		return bad;
	}
	try{
		let arr_def = all_sdefs[scode];
		if(arr_def == null){
			return bad;
		}
		await import_sdefs(lang);
		if(arr_def.length != 2){
			return bad;
		}
		const scod_asc = arr_def[0];
		const scod_id = arr_def[1];
		let scod_def = gvar.full_sdefs[lang][scod_id];
		if(scod_def == null){
			return bad;
		}
		return { asc: scod_asc, def: scod_def, };
	} catch {
		console.error("FAILED get_scode_def(" + scode + ", " + lang + ")");
		return bad;
	}
}


export async function get_scode_def(scode, lang){
	const resp = await get_sword_scode_def(scode, lang);
	return resp;
}

