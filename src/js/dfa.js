class DFA{
	constructor(states = [], transitions = [], alphabet = []){
		if(!alphabet)
			return;
		this.states = states;
		this.alphabet = alphabet;

		if(this.checkAlphabet(transitions)){
			this.transitions = transitions;
			this.transformEdges();
		}else{
			alert("Error adding transitions, value not found in alphabet" );
			return;
		}

		this.transformNodes();

		this.nextId = states.length;
		console.log("DFA created:" + JSON.stringify(this.states));
	}

	//states
	addState(stateLabel, isFinal){
		let state = {label: '['+this.nextId+'] '+stateLabel};
		state.color = '#3498db';
		state.id = this.nextId;
		this.nextId++;
		if(this.states.length == 0)
			state.color = '#34495e';
		else if(isFinal)
			state.color = '#2ecc71';

		this.states.push(state);
	}

	deleteState(pos){
		this.deleteTransitionsByState(this.states[pos].id);
		delete this.states[pos];
	}

	//transitions
	deleteTransition(pos){
		delete this.transitions[pos];
	}

	deleteTransitionsByState(stateId){
		let indexToDelete = [];
		for (var i = this.transitions.length - 1; i >= 0; i--) {
			if (this.transitions[i].from == stateId || this.transitions.to == stateId)
				indexToDelete.push(i);
		}

		indexToDelete.forEach(x => delete this.transitions[x]);
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

	transformNodes(){
		for (var i = this.states.length - 1; i >= 0; i--) {
			if(i == 0){
				this.states[i].color = '#34495e';
				this.states[i].font = {color: 'white'};
			}
			this.states[i].label = '['+i+'] ' + this.states[i].label; 
			this.states[i].id = i;
		}
		this.nextId = this.states.length;
	}

	transformEdges(){
		for (var i = this.transitions.length - 1; i >= 0; i--) {
			this.transitions[i].font = {align: 'top'};
			this.transitions[i].arrows = 'to';
			this.transitions[i].color = '#3498db';
		}
	}


}