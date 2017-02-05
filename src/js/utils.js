removeDuplicates = function(arr = []){
	let nuevo = [];
	arr.forEach( x => nuevo.indexOf(x) < 0 ? nuevo.push(x) : null);
	return nuevo;
}