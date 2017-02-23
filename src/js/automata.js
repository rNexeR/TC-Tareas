class Automaton{
	constructor(type, states = [], transitions = [], alphabet = []){
		this.epsilon = "#";
		if(!alphabet)
			return;
		this.type = type;
		this.states = states;
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
		return state.id;
	}

	deleteState(pos){
		this.deleteTransitionsByState(this.states[pos].id);
		this.states.splice(pos, 1);
	}

	//transitions
	addTransition(frm, to, label){
		if(this.type == "nfa-e" && label != this.epsilon && !this.alphabet.includes(label)){
			console.log("aqio");
			return false;
		}
		else if(this.type != "nfa-e" && !this.alphabet.includes(label)){
			return false;
		}
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
			if(this.type == "nfa-e" && transitions[i].label != this.epsilon && !this.alphabet.includes(transitions[i].label)){
				console.log("aqio");
				return false;
			}
			else if(this.type != "nfa-e" && !this.alphabet.includes(transitions[i].label)){
				return false;
			}
		}
		return true;
	}

	transformStates(){
		for (var i = this.states.length - 1; i >= 0; i--) {
			this.states[i].color = '#bdc3c7';
			delete this.states[i].font;
			if(this.states[i].root){
				this.states[i].color = '#34495e';
				this.states[i].font = {color: 'white'};
			}
			if(this.states[i].final){
				this.states[i].final = true;
				this.states[i].color = '#2ecc71';
			}
			this.states[i].label = this.states[i].label; 
			//this.states[i].id = i;
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
		let root = this.states.find(x=> x.root == true);
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
		console.log("Evaluando "+this.type.toUpperCase()+": ", str, " root: ", root.label);
		for (let i = 0; i < str.length; i++) {
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
				for (let j = nextState.length - 1; j >= 0; j--) {
					
					let nroot = this.states.filter(x => x.id == nextState[j].to);
					let nstr = str.slice(i+1, str.length);

					

					if(this.type == "nfa-e"){
						this.getClosure(nroot[0].id).forEach(x => nroot.push(x))
					}
					for (let k = nroot.length - 1; k >= 0; k--) {
						let result = this.evalNFA(nstr,nroot[k]) == true;
						console.log("next state["+j+"] returns: "+ result);
						if(result){
							return true;
						}
					}
					
				}
			}else{
				
				root = this.states.filter(x => x.id == nextState[0].to);

				if(this.type == "nfa-e"){
					this.getClosure(root[0].id).forEach(x => root.push(x));
				}

				if(root.length == 0)
					return false;
				else if(root.length == 1){
					root = root[0];
					console.log("width " + letra + " > " + root.label);
				}else{
					let nstr = str.slice(i+1, str.length);
					for (let k = root.length - 1; k >= 0; k--) {
						let result = this.evalNFA(nstr,root[k]) == true;
						console.log("root state["+k+"] returns: "+ result);
						if(result){
							return true;
						}
					}
				}
			}

		}
		let finalStates = [root];
		finalStates.push(this.getClosure(root.id));
		return finalStates.filter( x=> x.final == true).length > 0;
	}

	getClosure(stateId){
		let checked = [];
		let waiting = [stateId];
		while(waiting.length > 0){
			let currentId = waiting[0];
			checked.push(currentId);
			let epsilonTransitions = this.transitions.filter( x => x.from == currentId && x.label == this.epsilon);
			epsilonTransitions.map(x => x. to).forEach( x => waiting.includes(x) || checked.includes(x) ? null: waiting.push(x));
			waiting.shift();
		}
		let states = [];
		states.push(this.states.find(x => x.id == stateId));
		checked.forEach(x => x != stateId ? states.push(this.states.find( y => y.id == x)) : null);
		console.log("Closure of ", stateId, ": ", JSON.stringify(states));
		return states;
	}

	eval(str){
		if(this.type == "dfa"){
			return this.evalDFA(str);
		}else if(this.type == "nfa"){
			let root = this.states.find(x=> x.root == true);
			return this.evalNFA(str, root);
		}else if(this.type == "nfa-e"){
			let root = this.states.filter(x => x.root == true);
			this.getClosure(root[0].id).forEach(x => root.push(x));
			for (var i = root.length - 1; i >= 0; i--) {
				if(this.evalNFA(str, root[i]) == true){
					return true;
				}
			}
		}
	}

	isFinalState(str, finalStates){

		let tokens = str.split(",");
		for (var i = tokens.length - 1; i >= 0; i--) {
			if (finalStates.includes(tokens[i])){
				console.log("IFS: ", str, true);
				return true;
			}
		}
		return false;
	}

	getNfaTable(){
		let table = new Array();
		let cantSymbols = this.alphabet.length;
		let root = this.states.filter(x=> x.root == true)[0];
		let waitingState = new Array();

		if(this.type == "nfa"){
			waitingState.push(root.label);
		}else if(this.type == "nfa-e"){
			let epsilonStatesIds = this.getClosure(root.id).map(x => x.label);
			epsilonStatesIds.sort();
			let rootLabel = "";
			epsilonStatesIds.forEach(x => rootLabel += x + ",");
			rootLabel = rootLabel.slice(0, rootLabel.length-1);
			waitingState.push(rootLabel);
		}

		console.log({root: waitingState[0]});

		while(waitingState.length > 0){
			let actual = waitingState[0];
			//console.log(actual);
			let rootsLabels = actual.split(",");

			let rootsIds = new Array();
			rootsLabels.forEach( x => rootsIds.push(this.states.find( y => y.label == x).id));

			let nrow = new Array(cantSymbols);
			nrow[0] = actual;

			for (let i = 0; i < cantSymbols; i++) {
				let transitions = this.transitions.filter(x => rootsIds.includes(x.from) && x.label == this.alphabet[i]);
				let state = [];
				transitions.forEach(x => state.push(this.states.find( y => y.id == x.to).label));
				if(this.type== "nfa-e"){
					let epsilonStates = [];
					transitions.forEach( x => epsilonStates = epsilonStates.concat(this.getClosure(x.to)));
					epsilonStates.forEach(x => state.push(x.label));
				}
				//state += "}";
				state.sort();
				state = removeDuplicates(state);
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
		return table;
	}

	nfaToDfa(){
		console.log("Converting NFA to DFA");
		let table = this.getNfaTable();

		console.log(JSON.stringify(table));
		
		//console.log(table);

		let finalStates = this.states.filter(x => x.final == true).map(x => x.label);
		console.log("FS: ", finalStates, this.isFinalState("c", finalStates));


		let dfa_states = [];
		table.forEach( x => dfa_states.push({id: table.indexOf(x), label: x[0], root: table.indexOf(x) ==0, final: this.isFinalState(x[0], finalStates)}));

		let dfa_transitions = [];
		let nid = 0;
		for (var i = 0; i < table.length; i++) {
			let frm = i;
			this.alphabet.forEach( x => dfa_transitions.push({id: nid++, from: frm, to: table.map(y => y[0]).indexOf(table[i][this.alphabet.indexOf(x)+1]), label: x}));
		}
		
		dfa_transitions = dfa_transitions.filter(x => x.from >=0 && x.to >= 0);
		//console.log("dfa_states: \n", dfa_states);
		//console.log("dfa_transitions: \n", dfa_transitions);

		dfa_states.forEach( x=> x.label = x.label.replace(",", "-"));

		return new Automaton("dfa", dfa_states, dfa_transitions, this.alphabet);
		//table.forEach(x => dfa_transitions.push({id: id++, from: table.indexOf(x), to: dfa.states.map(x => x.label).indexOf(x[])}))
	}

	clone(){
		let states = JSON.parse(JSON.stringify(this.states));
		let transitions = JSON.parse(JSON.stringify(this.transitions));
		let alphabet = JSON.parse(JSON.stringify(this.alphabet));
		return new Automaton(this.type, states, transitions, alphabet);
	}

	removeFinalStatesDistinct(finalStateId){
		let copy = this.clone();
		let finalStates = copy.states.filter( x => x.final == true);
		finalStates.forEach(function(state){
			if(state.id != finalStateId)
				delete state.final
		});
		return copy;
	}

	transitionsLabelToRegExp(){
		let states = this.states;
		let oldTransitions = JSON.parse(JSON.stringify(this.transitions));
		this.transitions = [];
		let transitions = this.transitions;

		states.forEach(function(state){
			let from = state.id;
			states.forEach(function(st){
				let to = st.id;
				let currentTransitions = oldTransitions.filter( x => x.from == from && x.to == to).map(x => x.label).join("+");
				if (currentTransitions != ""){
					transitions.push({id: transitions.length, from: from, to: to, label: currentTransitions})
					//console.log(currentTransitions);
				}
			});
		});
		//console.log(this.transitions);
	}

	toRegExp(){
		let fn = this.states.find(x => x.final == true);
		console.log("Final state: ", JSON.stringify(fn));
		console.log("\n\ntoRegExp states: ",JSON.stringify(this.states));
		console.log("\n\ntoRegExp transitions: ",JSON.stringify(this.transitions));
		let root = this.states.find( x => x.root == true);
		this.transitionsLabelToRegExp();
		let states = this.states;
		let transitions = this.transitions;
		let nextId = Math.max(...this.transitions.map(x => x.id))+1;
		states.forEach(function(state, index){
			if(state.final != true && state.root != true){
				console.log("deleting state: ", state.id, state.label);
				let transitionsToMe = transitions.filter( x => x.to == state.id && x.from != state.id);
				let transitionsFromMe = transitions.filter( x => x.from == state.id && x.to != state.id);
				let transitionsFromMeToMe = transitions.find(x => x.from == state.id && x.to == state.id);
				if(transitionsFromMeToMe == undefined){
					transitionsFromMeToMe = {label: ""};
				}else{
					transitionsFromMeToMe.label = ".(" + transitionsFromMeToMe.label + ")*";
				}
				transitionsToMe.forEach(function(tt){
					transitionsFromMe.forEach( function(tf){
						let t = {id: nextId++, from: tt.from, label: tt.label + transitionsFromMeToMe.label};
						t.to = tf.to;
						t.label += "." + tf.label;
						if(t.to == t.from){
							t.label = "(" + t.label + ")*";
						}
						transitions.push(t);
						console.log("Adding transition: ", t.from, t.to, t.label);
						console.log("Deleting transition: ", tf.to, tf.from, tf.label);
						let pos = transitions.indexOf(tf);
						if(pos >= 0)
							transitions.splice(pos, 1);
					})
					console.log("deleting transition: ", tt.from, tt.to, tt.label);
					let pos = transitions.indexOf(tt);
					if(pos >= 0)
						transitions.splice(pos, 1);
					if(transitionsFromMeToMe.label != ""){
						console.log("deleting recursive transition from to state: ", state.id, state.label);
						let pos = transitions.indexOf(transitions.find(x => x.from == state.id && x.to == state.id));
						if(pos >= 0)
							transitions.splice(pos, 1);
					}
				})
				states = states.filter( x => x != state);
			}
		});

		this.states = this.states.filter(x => x.root == true || x.final == true);
		let regexp = "";
		if(this.states.length == 2){
			let rootCycle = this.transitions.find(x => x.from == root.id && x.to == root.id);
			if(rootCycle == undefined){
				rootCycle = {label: ""}
			}else{
				rootCycle.label = "("+rootCycle.label + ")*";
			}

			regexp += rootCycle.label;
			
			let rootTransitions = this.transitions.filter(x => x.from == root.id && x.to != root.id).map(x => x.label).join('+');
			regexp += rootTransitions;
			
			let final = this.states.find(x => x.final == true);
			let finalCycle = this.transitions.find(x => x.from == final.id && x.to == final.id);
			if(finalCycle == undefined){
				finalCycle = {label: ""};
			}else{
				finalCycle.label = 	"." + finalCycle.label;
			}
			regexp += finalCycle.label;

			let recursive = this.transitions.find(x => x.from == final.id && x.to == root.id);
			if(recursive != undefined){
				regexp = "(" + regexp + "." + recursive.label + ")*." + rootTransitions + finalCycle.label;

			}
		}else if(this.states.length == 1){
			let rootCycle = this.transitions.find(x => x.from == root.id && x.to == root.id);
			if(rootCycle == undefined){
				rootCycle = {label: ""}
			}else{
				rootCycle.label = rootCycle.label + "+";
			}

			regexp += rootCycle.label;
		}
		console.log(this.states.length, " RE: ", regexp);
		return regexp;
	}

	dfaToRegExp(){
		let finalStates = this.states.filter( x => x.final == true);
		let automataParts = [];
		let regexp = "";

		finalStates.forEach(x => automataParts.push(this.removeFinalStatesDistinct(x.id)));
		console.log(automataParts);
		automataParts.forEach(x => regexp += "(" + x.toRegExp() + ")" + " + ");
		regexp = regexp.slice(0, regexp.length-2);
		console.log(regexp);
		return regexp;
	}

	fromRegExp(regexp = ""){
		let stateId = 0;
		let transitionId = 0;
		let tree = peg$parse(regexp);
		alert(JSON.stringify(tree));

		let automata = this.fromRegExpAux(tree, stateId, transitionId);
		alert("Conversion: " + JSON.stringify(automata));
		automata.transformStates();
		return automata;
	}

	fromRegExpAux(tree, nextStateId, nextTransitionId){
		if(tree.name == "kleene"){

			let ret = this.fromRegExpAux(tree.expression, nextStateId, nextTransitionId);
			nextStateId = ret.nextStateId;
			nextTransitionId = ret.nextTransitionId;

			let retFinal = ret.states.find(x => x.final == true);
			let retRoot = ret.states.find(x => x.root == true);

			ret.states.forEach( x => {x.root = false; x.final = false});

			ret.nextStateId = nextStateId+2;
			ret.nextTransitionId = nextTransitionId+4;

			ret.states.push({id: nextStateId++, label: "q"+(nextStateId-1), root: true});
			ret.states.push({id: nextStateId++, label: "q"+(nextStateId-1), final: true});

			ret.addTransition(retFinal.id, retRoot.id, this.epsilon);
			ret.addTransition(nextStateId-2, retRoot.id, this.epsilon);
			ret.addTransition(retFinal.id, nextStateId-1, this.epsilon);
			ret.addTransition(nextStateId-2, nextStateId-1, this.epsilon);

			return ret;

		}else if(tree.name == "pipe"){
			let a1 = this.fromRegExpAux(tree.left, nextStateId, nextTransitionId);
			nextStateId = a1.nextStateId;
			nextTransitionId = a1.nextTransitionId;
			let a2 = this.fromRegExpAux(tree.right, nextStateId, nextTransitionId);
			nextStateId = a2.nextStateId;
			nextTransitionId = a2.nextTransitionId;

			let a1Final = a1.states.find(x => x.final == true);
			let a1Root = a1.states.find(x => x.root == true);
			let a2Root = a2.states.find(x => x.root == true);
			let a2Final = a2.states.find(x => x.final == true);
			
			let states = removeDuplicates(a1.states.concat(a2.states));
			let transitions = removeDuplicates(a1.transitions.concat(a2.transitions));
			let alphabet = removeDuplicates(a1.alphabet.concat(a2.alphabet));
			
			let ret = new Automaton("nfa-e", states, transitions, alphabet);
			ret.states.forEach( x => {x.root = false; x.final = false});
			console.log(ret.states);
			ret.nextStateId = nextStateId+2;
			ret.nextTransitionId = nextTransitionId+4;

			ret.states.push({id: nextStateId++, label: "q"+(nextStateId-1), root: true});
			ret.states.push({id: nextStateId++, label: "q"+(nextStateId-1), final: true});


			ret.addTransition(nextStateId-2, a1Root.id, this.epsilon);
			ret.addTransition(nextStateId-2, a2Root.id, this.epsilon);

			ret.addTransition(a1Final.id, nextStateId-1, this.epsilon);
			ret.addTransition(a2Final.id, nextStateId-1, this.epsilon);

			return ret;

		}else if(tree.name == "concat"){
			let a1 = this.fromRegExpAux(tree.left, nextStateId, nextTransitionId);
			nextStateId = a1.nextStateId;
			nextTransitionId = a1.nextTransitionId;
			let a2 = this.fromRegExpAux(tree.right, nextStateId, nextTransitionId);
			nextStateId = a2.nextStateId;
			nextTransitionId = a2.nextTransitionId;

			let a1Final = a1.states.find(x => x.final == true);
			let a2Root = a2.states.find(x => x.root == true);

			a1.states.forEach( x => x.final = false);
			a2.states.forEach( x => x.root = false);
			
			let states = removeDuplicates(a1.states.concat(a2.states));
			let transitions = removeDuplicates(a1.transitions.concat(a2.transitions));
			let alphabet = removeDuplicates(a1.alphabet.concat(a2.alphabet));
			
			let ret = new Automaton("nfa-e", states, transitions, alphabet);
			ret.nextStateId = nextStateId;
			ret.nextTransitionId = nextTransitionId;

			ret.addTransition(a1Final.id, a2Root.id, this.epsilon);

			return ret;
		}else if(tree.name == "character"){
			alert("creating new automata, character: " + tree.value);
			
			let states = [];
			states.push({id: nextStateId++, label: "q"+(nextStateId-1), root: true});
			states.push({id: nextStateId++, label: "q"+(nextStateId-1), final: true});

			let transitions = [];
			transitions.push({id: nextTransitionId++, from: nextStateId-2, to: nextStateId-1, label: tree.value});

			let ret = new Automaton("nfa-e", states, transitions, [tree.value])
			ret.nextStateId = nextStateId;
			ret.nextTransitionId = nextTransitionId;
			return ret;
		}
	}
}