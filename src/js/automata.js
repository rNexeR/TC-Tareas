class Automaton{
	constructor(type, states = [], transitions = [], alphabet = []){
		if(!alphabet)
			return;
		this.type = type;
		this.states = states;
		if(states.length-1 > 0)
			this.states[states.length-1].final = true;
		this.alphabet = alphabet;

		if(this.checkAlphabet(transitions)){
			this.transitions = transitions;
			this.transformTransitions();
		}else{
			alert("Error adding transitions, symbol not found in alphabet" );
			return;
		}

		this.transformStates();

		this.nextStateId = states.length;

		this.nextTransitionId = transitions.length;
		console.log("DFA created: \nNodes: ", JSON.stringify(this.states), "\nTransitions: ", JSON.stringify(this.transitions));
	}

	//states
	addState(stateLabel, isFinal){
		let state = {label: stateLabel};
		state.color = '#bdc3c7';
		state.id = this.nextStateId;
		this.nextStateId++;
		if(this.states.length == 0){
			state.root = true;
			state.color = '#34495e';
			state.font = {color: 'white'};
		}
		if(isFinal){
			state.final = true;
			state.color = '#2ecc71';
		}

		this.states.push(state);
	}

	deleteState(pos){
		this.deleteTransitionsByState(this.states[pos].id);
		this.states.splice(pos, 1);
	}

	//transitions
	addTransition(frm, to, label){
		if(!this.alphabet.includes(label))
			return false;
		let t = {id: this.nextTransitionId, from: frm, to: to, label: label};
		this.transitions.push(t);
		this.transformTransition(this.transitions.length -1);
		this.nextTransitionId++;
		return true;
	}

	deleteTransition(pos){
		this.transitions.splice(pos, 1);
	}

	deleteTransitionsByState(stateId){
		this.transitions = this.transitions.filter(x=> x.from != stateId && x.to != stateId);
	}

	//alphabet

	//utils
	checkAlphabet(transitions){
		for (var i = transitions.length - 1; i >= 0; i--) {
			if (!this.alphabet.includes(transitions[i].label))
				return false;
		}
		return true;
	}

	transformStates(){
		for (var i = this.states.length - 1; i >= 0; i--) {
			this.states[i].color = '#bdc3c7';
			if(i == 0){
				this.states[i].color = '#34495e';
				this.states[i].font = {color: 'white'};
				this.states[i].root = true;
			}
			if(this.states[i].final){
				this.states[i].final = true;
				this.states[i].color = '#2ecc71';
			}
			this.states[i].label = this.states[i].label; 
			this.states[i].id = i;
		}
		this.nextStateId = this.states.length;
	}

	transformTransitions(){
		for (var i = this.transitions.length - 1; i >= 0; i--) {
			this.transitions[i].id = i;
			this.transitions[i].font = {align: 'top'};
			this.transitions[i].arrows = 'to';
			this.transitions[i].color = '#f1c40f';
		}
	}

	transformTransition(pos){
		this.transitions[pos].font = {align: 'top'};
		this.transitions[pos].arrows = 'to';
		this.transitions[pos].color = '#f1c40f';
	}

	evalDFA(str){
		console.log("Evaluando DFA: ", str);
		let root = this.states.filter(x=> x.root == true)[0];
		for (var i = 0; i < str.length; i++) {
			let letra = str[i];
			
			if(!this.alphabet.includes(letra)){
				return false;
			}

			let stateTransitions = this.transitions.filter(x => x.from == root.id);
			if(stateTransitions.length == 0)
				return false;
			//console.log("state transitions: " + JSON.stringify(stateTransitions));
			
			let nextState = stateTransitions.filter(x => x.label == letra);
			if(nextState.length == 0)
				return false;
			//console.log("next state: " + JSON.stringify(nextState));

			root = this.states.filter(x => x.id == nextState[0].to);
			if(root.length == 0)
				return false;
			root = root[0];
			console.log("width " + letra + " > " + root.label);
		}
		return root.final == true;
	}

	evalNFA(str, root){
		console.log("Evaluando NFA: ", str, " root: ", root.label);
		for (var i = 0; i < str.length; i++) {
			let letra = str[i];
			
			if(!this.alphabet.includes(letra)){
				return false;
			}

			let stateTransitions = this.transitions.filter(x => x.from == root.id);
			if(stateTransitions.length == 0)
				return false;
			//console.log("state transitions: " + JSON.stringify(stateTransitions));

			let nextState = stateTransitions.filter(x => x.label == letra);
			if(nextState.length == 0)
				return false;
			//console.log("next state: " + JSON.stringify(nextState));

			if(nextState.length > 1){
				console.log("More than 1 next state found");
				for (var j = nextState.length - 1; j >= 0; j--) {
					
					let nroot = this.states.filter(x => x.id == nextState[j].to)[0];
					let nstr = str.slice(i+1, str.length);

					let result = this.evalNFA(nstr,nroot) == true;
					console.log("next state["+j+"] returns: "+ result);
					if(result){
						return true;
					}
					
				}
			}else{
				root = this.states.filter(x => x.id == nextState[0].to);
				if(root.length == 0)
					return false;
				root = root[0];
				console.log("width " + letra + " > " + root.label);
			}

		}
		return root.final == true;
	}

	eval(str){
		if(this.type == "dfa"){
			return this.evalDFA(str);
		}else if(this.type == "nfa"){
			let root = this.states.filter(x=> x.root == true)[0];
			return this.evalNFA(str, root);
		}
	}

	isFinalState(str, finalStates){
		let tokens = str.split(",");
		for (var i = tokens.length - 1; i >= 0; i--) {
			if (finalStates.includes(tokens[i]))
				return true;
		}
		return false;
	}

	nfaToDfa(){
		console.log("Converting NFA to DFA");
		let table = new Array();
		let cantSymbols = this.alphabet.length;
		let root = this.states.filter(x=> x.root == true)[0];
		let waitingState = new Array();

		waitingState.push(root.label);

		while(waitingState.length > 0){
			let actual = waitingState[0];
			//console.log(actual);
			let rootsLabels = actual.split(",");

			let rootsIds = new Array();
			rootsLabels.forEach( x => rootsIds.push(this.states.filter( y => y.label == x)[0].id));

			let nrow = new Array(cantSymbols);
			nrow[0] = actual;

			for (var i = 0; i < cantSymbols; i++) {
				let transitions = this.transitions.filter(x => rootsIds.includes(x.from) && x.label == this.alphabet[i]);
				let state = [];
				transitions.forEach(x => state.push(this.states.filter( y => y.id == x.to)[0].label));
				//state += "}";
				state = removeDuplicates(state)
				let stateLabel = "";
				state.forEach(x => stateLabel += x.toString() + ",");
				stateLabel = stateLabel.slice(0, stateLabel.length-1);

				nrow[i+1] = stateLabel;
				if(state != "" && (table.filter(x => x[0] == stateLabel).length == 0 && !waitingState.includes(stateLabel))){
					//alert("pushing " + stateLabel + " to waiting list");
					waitingState.push(stateLabel);
				}
			}
			table.push(nrow);

			waitingState.splice(0, 1);
		}

		
		//console.log(table);

		let finalStates = this.states.filter(x => x.final == true).map(x => x.label);

		let dfa_states = [];
		table.forEach( x => dfa_states.push({id: table.indexOf(x), label: x[0], root: table.indexOf(x) ==0, final: this.isFinalState(x[0], finalStates)}));

		let dfa_transitions = [];
		let nid = 0;
		for (var i = 0; i < table.length; i++) {
			let frm = i;
			this.alphabet.forEach( x => dfa_transitions.push({id: nid++, from: frm, to: table.map(y => y[0]).indexOf(table[i][this.alphabet.indexOf(x)+1]), label: x}));
		}
		//console.log("dfa_states: \n", dfa_states);
		//console.log("dfa_transitions: \n", dfa_transitions);

		return new Automaton("dfa", dfa_states, dfa_transitions, this.alphabet);
		//table.forEach(x => dfa_transitions.push({id: id++, from: table.indexOf(x), to: dfa.states.map(x => x.label).indexOf(x[])}))
	}
}