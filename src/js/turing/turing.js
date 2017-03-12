class Turing {
	constructor(states = [], transitions = [], alphabet = []) {

		if (!alphabet)
			return;
		this.states = states;
		this.alphabet = alphabet;

		// console.log("states", states);
		// console.log("transitions", transitions);
		// console.log("alphabet", alphabet);

		if (this.checkAlphabet(transitions)) {
			this.transitions = transitions;
			this.transformTransitions();
		} else {
			alert("Error adding transitions, symbol not found in alphabet");
			return;
		}

		this.transformStates();

		this.nextStateId = states.length;

		this.nextTransitionId = transitions.length;
		//console.log("DFA created: \nNodes: ", JSON.stringify(this.states), "\nTransitions: ", JSON.stringify(this.transitions));
	}

	//states
	addState(stateLabel, isFinal) {
		let state = { label: stateLabel };
		state.color = '#bdc3c7';
		state.id = this.nextStateId;
		this.nextStateId++;
		if (this.states.length == 0) {
			state.root = true;
			state.color = '#34495e';
			state.font = { color: 'white' };
		}
		if (isFinal) {
			state.final = true;
			state.color = '#2ecc71';
		}

		this.states.push(state);
		return state.id;
	}

	deleteState(pos) {
		this.deleteTransitionsByState(this.states[pos].id);
		this.states.splice(pos, 1);
	}

	//transitions
	addTransition(frm, to, symbol, write, direction) {
		let label = symbol + "/" + write + "," + direction
		if (!this.alphabet.includes(symbol) && symbol != this.epsilon) {
			return false;
		}
		let t = { id: this.nextTransitionId, from: frm, to: to, label: label, symbol: symbol, direction: direction, write: write };
		this.transitions.push(t);
		this.transformTransition(this.transitions.length - 1);
		this.nextTransitionId++;
		return true;
	}

	deleteTransition(pos) {
		this.transitions.splice(pos, 1);
	}

	deleteTransitionsByState(stateId) {
		this.transitions = this.transitions.filter(x => x.from != stateId && x.to != stateId);
	}

	//alphabet

	//utils
	checkAlphabet(transitions) {
		for (let i = transitions.length - 1; i >= 0; i--) {
			// console.log("-->", transitions[i]);
			// console.log("-->", this.alphabet);
			if (!this.alphabet.includes(transitions[i].symbol) && transitions[i].symbol != this.epsilon) {
				return false;
			}
		}
		return true;
	}

	transformStates() {
		for (let i = this.states.length - 1; i >= 0; i--) {
			this.states[i].label = this.states[i].label.split(',').join('-');
			this.states[i].color = '#bdc3c7';
			this.states[i].root = this.states[i].root == undefined ? false : this.states[i].root;
			this.states[i].final = this.states[i].final == undefined ? false : this.states[i].final;

			delete this.states[i].font;
			if (this.states[i].root) {
				this.states[i].color = '#34495e';
				this.states[i].font = { color: 'white' };
			} else {
				this.states[i].root = false;
			}
			if (this.states[i].final) {
				this.states[i].final = true;
				this.states[i].color = '#2ecc71';
			} else {
				this.states[i].final = false;
			}
			this.states[i].label = this.states[i].label;
			//this.states[i].id = i;
		}
		this.nextStateId = this.states.length;
	}

	transformTransitions() {
		for (let i = this.transitions.length - 1; i >= 0; i--) {
			this.transitions[i].id = i;
			this.transitions[i].font = { align: 'top' };
			this.transitions[i].arrows = 'to';
			this.transitions[i].color = '#f1c40f';
		}
	}

	transformTransition(pos) {
		this.transitions[pos].font = { align: 'top' };
		this.transitions[pos].arrows = 'to';
		this.transitions[pos].color = '#f1c40f';
	}

	getStateTransitions(stateId, symbol) {
		return this.transitions.filter(x => x.from == stateId && x.symbol == symbol);
	}

	findStateById(id) {
		return this.states.find(x => x.id == id);
	}

	printTransition(before, tran) {
		console.log(before, "from", tran.from, "to", tran.to, "symbol", tran.symbol, "head", tran.head, "push", tran.push)
	}

	findNextStates(stateId, symbol) {
		let nextTransitions = this.getStateTransitions(stateId, symbol, head);
		let nextIds = nextStates.map(x => x.id);
		nextIds = nextIds.concat(nextTransitions.map(x => x.to));
		nextIds = removeDuplicates(nextIds);
		return this.states.filter(x => nextIds.includes(x.id));
	}

	evaluate(str, root, stack, print) {
		console.log(print, "Evaluando " + ": ", str, " root: ", root.label);
		let tape = [];
		for (let i = 0; i < 50; i++)
			tape.push("B")
		for (let char of str)
			tape.push(char);
		for (let i = 0; i < 50; i++)
			tape.push("B")
			
		tape.push("B");
		let current_pos = 50;
		console.log(tape[current_pos])

		while (true) {
			let current_tape = tape[current_pos];
			let transitions = this.getStateTransitions(root.id, current_tape);
			if (transitions.length == 0 || transitions.length > 1)
				break;
			console.log(current_pos, current_tape);
			console.log(JSON.stringify(transitions[0]));

			tape[current_pos] = transitions[0].write;
			if (transitions[0].direction == "->")
				current_pos++
			else
				current_pos--
			root = this.findStateById(transitions[0].to)
		}
		return root.final;
	}

	reverse(array) {
		let narray = JSON.parse(JSON.stringify(array))
		return narray.reverse();
	}

	eval(str) {
		let originalRoot = this.states.find(x => x.root == true);
		return this.evaluate(str, originalRoot, [this.stack_head], "");
	}
}