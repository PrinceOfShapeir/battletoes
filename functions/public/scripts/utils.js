const sum = function (array){
	if(!Array.isArray(array)){
	
	return "Error not an array";
	}
	
	let s = 0;
	for(i in array){
		
		if(valnum(array[i])){

			s += array[i];
		}
	}
	return s;
}
const flip = function (array, upperBound = 1) {
	
	if(!Array.isArray(array)){
	
	return "Error not an array";
	}


	let ray = array.slice();
	

	for(i in ray){

		if(valnum(ray[i])){

			ray[i] = Math.abs(ray[i]-upperBound);

		}
	}
	
	return ray;
	
}

const valnum = function (number) {

	return typeof(number)==='number';

}

const win = function (input){
	
	let side = Math.sqrt(input.length);
	let rows = [];
	let columns = [];
	let newColumns = []


for(let i = 0; i<input.length;){
rows.push(input.slice(i,side+i));
i += side;
}


for(i in rows){
	
	if(sum(rows[i])===side){
		console.log("row win");
		return true;
	}
	
	
}



for(i in rows){
	
	
	for(let z = 0; z<side;z++){
	
		
		columns.push(rows[z][i]);
		
	}
	
}
	
	for(let i = 0; i<columns.length;){
newColumns.push(columns.slice(i,side+i));
i += side;
}

for (i in newColumns){
	if(sum(newColumns[i])===side){
		console.log("column win");
		return true;
	}
	
}

	let diag1 = 0;
	for(i = 0; i<input.length;){
		
	diag1 += input[i];
		
	i += side+1;
	}
	
	let diag2 = 0;
	
	for(let i = side -1; i<input.length-side+1;){

		
		diag2+= input[i];
		
		i += side - 1;
		
	}
	if(diag1===side||diag2===side){
		console.log("diagonal win");
		return true;
	}

	return false;
	
	
	
}
