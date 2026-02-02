
export const all_op = [
	{ op:"add_next", beg:"1:2:7", },	// adds the next verse (calculated just adding 1 to 7) of v1 to v1 from its last available idx on.
	{ op:"div_idx", beg:"1:1:1", idx:3, }, // splits v1 from idx. token in idx gets into next verse.
	{ op:"shift", beg:"1:2:1", end:"1:2:4", new_beg:"1:2:7", },	// all get in same chapter as new_beg. inclusive op. beg and end get shifted.
	{ op:"shift", beg:"1:2:1", end:"1:2:4", new_beg:"1:1:5", },	// all get in same chapter as new_beg. inclusive op. beg and end get shifted.
];


// ops work as units and executed in order.
// If an op refers to verses already read they wont be executed.
// FIRST all verses for an op are read. 
// THEN a new tok id is calculated for each tok in the verses. 
// And THEN the verses are written.
// Have that in mind to not make interfering ops or not executed ops.

