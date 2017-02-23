getNextStateBySymbol = function(fromLabel, symbol, transitions = [], states = []){
	let frm = states.find(x => x.label == fromLabel);
	let transition = transitions.find(x => x.from == frm.id && x.label == symbol);
	if(transition == undefined)
		return "";
	else{
		return states.find(x => x.id == transition.to).label;
	}
}

union = function(automata1,automata2){
	console.log("Join 2 automatas");
	let new_alphabet = removeDuplicates(automata1.alphabet.concat(automata2.alphabet));
	let ret = new Automaton('dfa', [], [], new_alphabet);

	let rootautomata1 = automata1.states.find(x => x.root == true);
	let rootautomata2 = automata2.states.find(x => x.root == true);

	let current = "a:" + rootautomata1.label + ",b:" + rootautomata2.label;
	let waitingStates = [];

	waitingStates.push(current);
	ret.addState(current, false);

	while(waitingStates.length > 0){
		current = waitingStates[0];
		console.log("current: ", current);
		let currentSplitted = current.split(',');
		let currentId = ret.states.find(x => x.label == current).id;
		let nextStates = [];
		if(currentSplitted.length == 2){
			//console.log("two states to one state");
			let current1 = currentSplitted[0].substr(2);
			let current2 = currentSplitted[1].substr(2);

			for(symbol of new_alphabet){
				let nextStateA = getNextStateBySymbol(current1, symbol, automata1.transitions, automata1.states);
				let nextStateB = getNextStateBySymbol(current2, symbol, automata2.transitions, automata2.states);
				let nextState = "";
				if(nextStateA != "" && nextStateB != "")
					nextState = "a:" + nextStateA + ",b:" + nextStateB;
				else if(nextStateA != "")
					nextState = "a:" + nextStateA;
				else if(nextStateB != "")
					nextState = "b:" + nextStateB;
				else
					continue;
				if(ret.states.find(x => x.label == nextState) == undefined){
					//console.log("\t\tadding state: ", nextState);
					waitingStates.push(nextState);
					let nextStateId = ret.addState(nextState, false);
					ret.addTransition(currentId, nextStateId, symbol);
				}else{
					let to = ret.states.find(x => x.label == nextState).id;
					ret.addTransition(currentId, to, symbol);
				}
			}
		}else if(currentSplitted.length == 1){
			console.log("one states to one state");
			let prefix = currentSplitted[0][0];
			let current1 = currentSplitted[0].substr(2);

			for(symbol of new_alphabet){
				let uniqueAutomata = prefix == "a" ? automata1 : automata2;
				let nextState = getNextStateBySymbol(current1, symbol, uniqueAutomata.transitions, uniqueAutomata.states);
				if(nextState != ""){
					nextState = prefix + ":" + nextState;
					if(ret.states.find(x => x.label == nextState) == undefined){
						console.log("\t\tadding state: ", nextState);
						waitingStates.push(nextState);
						let nextStateId = ret.addState(nextState, false);
						ret.addTransition(currentId, nextStateId, symbol);
					}else{
						let to = ret.states.find(x => x.label == nextState).id;
						ret.addTransition(currentId, to, symbol);
					}
				}
			}
		}
		waitingStates.shift();
		console.log(waitingStates);
	}

	return ret;

}


join = function(automata1, automata2){
	let ret = union(automata1, automata2);
	
	let finalStates = [];
	let a1FS = automata1.states.filter(x => x.final == true).map(x => "a:" + x.label);
	let a2FS = automata2.states.filter(x => x.final == true).map(x => "b:" + x.label);
	finalStates = a1FS.concat(a2FS);

	ret.states.forEach(x => x.final = ret.isFinalState(x.label, finalStates));

	ret.transformStates();

	return ret;
}

intersection = function(automata1,automata2){
	let ret = union(automata1, automata2);
	
	let finalStates = [];
	let a1FS = automata1.states.filter(x => x.final == true).map(x => "a:" + x.label);
	let a2FS = automata2.states.filter(x => x.final == true).map(x => "b:" + x.label);

	a1FS.forEach(function(a1Final){
		a2FS.forEach(function(a2Final){
			finalStates.push(a1Final + "," + a2Final);
			finalStates.push(a2Final + "," + a1Final);
		})
	});

	ret.states.forEach(x => x.final = finalStates.includes(x.label));

	ret.transformStates();

	return ret;
}

complement = function(automata1){
	let ret = automata1;

	let finalStates = ret.states.filter( x => x.final == true).map(x => x.label);

	ret.states.forEach(x => x.final = !finalStates.includes(x.label));
	ret.transformStates();

	let sumideroId = ret.addState('sumidero', true);

	ret.states.forEach(function(state){
		for(let symbol of ret.alphabet){
			if(ret.transitions.find(x => x.from == state.id && x.label == symbol) == undefined){
				ret.addTransition(state.id, sumideroId, symbol);
			}
		}
	});

	if(ret.transitions.filter(x => x.to == sumideroId).length == 2){
		for (var i = ret.states.length - 1; i >= 0; i--) {
			if(ret.states[i].id == sumideroId){
				ret.deleteState(i);
				break;
			}
		}
	}

	return ret;
}