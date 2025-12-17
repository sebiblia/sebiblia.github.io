
import { get_txt_matches, 
} from '../sf_biblang_mgr.js'


export function hola(){
	console.log("HOLA MUNDO");
}

export class MiClase {
	constructor(nm){
		this.nom = nm;
	}
	
	saludar(){
		return "HOLA " + this.nom + " !!";
	}
};

/*
module.exports = {
	hola: hola, 
	MiClase: MiClase,
};
*/

//Object.defineProperty(exports, "hola", { value: hola });
//Object.defineProperty(exports, "MiClase", { value: MiClase });
/*
exports.hola = hola;
exports.MiClase = MiClase;
exports.default = MiClase;

*/

function fix_stg_ocu(scod, vstxt){
	const tg_scod_str = `<${scod}>`;
	const rxstr = `<(G|H)[0-9]*>`;
	const rxo = new RegExp(rxstr, "g");
	let prv_beg = 0;
	const all_mocu = [];
	const all_stg = get_txt_matches(vstxt, rxo, (ocu, all_ocu) => {
		ocu.is_stg = true; 
		let prv_end = 0;
		let prv_ocu = null;
		if(all_ocu.length > 0){
			const lst = all_ocu.length - 1;
			prv_ocu = all_ocu[lst];
		}
		if(prv_ocu != null){
			prv_end = prv_ocu.idx + prv_ocu.lng;
		}
		const sub_vstxt = vstxt.substring(prv_end, ocu.idx);
		const is_empty = sub_vstxt.match(/^\s*$/);
		if(! is_empty){
			prv_beg = prv_end;
			ocu.beg = prv_beg;
		} else {
			if(prv_ocu != null){
				ocu.beg = prv_ocu.beg;
			} else {
				ocu.beg = prv_beg;
			}
		}
		const tok = vstxt.substring(ocu.beg, (ocu.idx + ocu.lng));
		const scod_str = vstxt.substring(ocu.idx, ocu.idx + ocu.lng);
		//console.log(`scod_str=${scod_str}`);
		if(tg_scod_str == scod_str){
			all_mocu.push(ocu);
		}
		//console.log(`tok='${tok}'`);
	});
	console.log(all_stg);
	console.log(all_mocu);
}

function test1(){
	fix_stg_ocu("G123", "kjahsd <G123> lakjserfalkgj alkdjg lkj alskgj <G432> <G165> <G123> lahksdfg oiqurt <G123> <G124> ");
}

test1();

