class DFA{
	constructor(states = [], transitions = [], alphabet = []){
		if(!alphabet)
			return;
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
		let state = {label: '['+this.nextStateId+'] '+stateLabel};
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
			this.states[i].label = '['+i+'] ' + this.states[i].label; 
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

	eval(str){
		console.log("Evaluando: ", str);
		let root = this.states.filter(x=> x.root == true)[0];
		for (var i = 0; i < str.length; i++) {
			let letra = str[i];
			
			if(!this.alphabet.includes(letra)){
				return false;
			}

			let stateTransitions = this.transitions.filter(x => x.from == root.id);
			if(stateTransitions.length == 0)
				return false;
			console.log("state transitions: " + JSON.stringify(stateTransitions));
			
			let nextState = stateTransitions.filter(x => x.label == letra);
			if(nextState.length == 0)
				return false;
			console.log("next state: " + JSON.stringify(nextState));

			root = this.states.filter(x => x.id == nextState[0].to);
			if(root.length == 0)
				return false;
			root = root[0];
			console.log("width " + letra + " > " + root.label);
		}
		return root.final == true;
	}

}