class PDA {
	constructor(states = [], transitions = [], alphabet = []) {
		this.epsilon = "#";
		this.type = "Final State";
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
	addTransition(frm, to, symbol, head, push = []) {
		let label = symbol + "," + head + "/" + push.toString()
		if (!this.alphabet.includes(symbol) && symbol != this.epsilon) {
			return false;
		}
		let t = { id: this.nextTransitionId, from: frm, to: to, label: label, symbol: symbol, head: head, push: push };
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

	getStateTransitions(stateId, symbols, head) {
		if (symbols != null)
			return this.transitions.filter(x => x.from == stateId && symbols.includes(x.symbol) && x.head == head);
		return this.transitions.filter(x => x.from == stateId);
	}

	findStateById(id) {
		return this.states.find(x => x.id == id);
	}

	printTransition(before, tran) {
		console.log(before, "from", tran.from, "to", tran.to, "symbol", tran.symbol, "head", tran.head, "push", tran.push)
	}

	findNextStates(stateId, symbol, head) {
		let nextStates = this.getClosure(stateId, head);
		let nextTransitions = this.getStateTransitions(stateId, symbol, head);
		let nextIds = nextStates.map(x => x.id);
		nextIds = nextIds.concat(nextTransitions.map(x => x.to));
		nextIds = removeDuplicates(nextIds);
		return this.states.filter(x => nextIds.includes(x.id));
	}

	evaluate(str, root, stack, print) {
		console.log(print, "Evaluando " + ": ", str, " root: ", root.label);
		for (let i = 0; i < str.length; i++) {
			let head = stack[stack.length - 1]
			let letra = str[i];

			console.log(print, "str", str, "pos", i, "root ", root.label, "head ", head, "stack", JSON.stringify(stack));

			if (!this.alphabet.includes(letra)) {
				console.log(print, "No alphabet");
				return false;
			}

			// let nextStates = this.findNextStates(root.id, letra, head);
			let nextState = this.getStateTransitions(root.id, [this.epsilon, letra], head);
			if (nextState.length == 0) {
				console.log(print, "No transitions");
				return false;
			}

			stack.pop()
			head = stack[stack.length - 1]

			console.log(print, nextState.length)

			if (nextState.length > 1) {
				//console.log("More than 1 next state found");
				for (let j = nextState.length - 1; j >= 0; j--) {

					let nstr = str.slice(i + 1, str.length);
					let nstack = JSON.parse(JSON.stringify(stack))
					if (nextState[j].symbol == this.epsilon)
						nstr = str;

					console.log(print, "push", nextState[j].push);
					nstack = nstack.concat(this.reverse(nextState[j].push))

					if (this.evaluate(nstr, this.findStateById(nextState[j].to), nstack, print + "\t"))
						return true;

				}
			} else {
				console.log(print, "push", nextState[0].push);
				stack = stack.concat(this.reverse(nextState[0].push))
				root = this.findStateById(nextState[0].to)
			}
			console.log(print, "--|stack", JSON.stringify(stack));
		}
		console.log(print, "root: ", root, "head", stack[stack.length - 1], "\n");
		let lastTransitions = this.getStateTransitions(root.id, [this.epsilon], stack[stack.length - 1])
		console.log(print, "Last option", "epsilonTransitions", JSON.stringify(lastTransitions));
		if (this.type == "Final State") {
			let lastStates = []
			lastTransitions.forEach(x => lastStates.push(this.findStateById(x.to)))
			return root.final || lastStates.filter(x => x.final == true).length > 0
		} else {
			for (let tran of lastTransitions) {
				let nstack = copy(stack)
				nstack.pop()
				nstack = nstack.concat(this.reverse(tran.push))
				return nstack.length == 0;
			}
		}
	}

	evalNFA(str, root, stack) {
		console.log("Evaluando " + ": ", str, " root: ", root.label);
		for (let i = 0; i < str.length; i++) {
			let head = stack[stack.length - 1]
			let letra = str[i];

			console.log("root ", root.label, "head ", head, "stack", JSON.stringify(stack));

			if (!this.alphabet.includes(letra)) {
				return false;
			}

			let stateTransitions = this.transitions.filter(x => x.from == root.id);
			if (stateTransitions.length == 0)
				return false;
			//console.log("state transitions: " + JSON.stringify(stateTransitions));

			let nextState = stateTransitions.filter(x => x.symbol == letra && x.head == head);
			if (nextState.length == 0)
				return false;
			//console.log("next state: " + JSON.stringify(nextState));

			stack.pop()
			head = stack[stack.length - 1]

			if (nextState.length > 1) {
				//console.log("More than 1 next state found");
				for (let j = nextState.length - 1; j >= 0; j--) {

					let nroot = this.getClosure(nextState[j].to, head)
					let nstr = str.slice(i + 1, str.length);

					for (let k = nroot.length - 1; k >= 0; k--) {
						let nstack = JSON.parse(JSON.stringify(stack))
						if (nroot[k].id != nextState[j].to) {
							console.log("------> stack b: ", nstack);
							nstack.pop();
							let epsilonT = this.transitions.find(x => x.from == nextState[i].from && x.symbol == this.epsilon && x.head == head && x.to == nroot[k].id);
							nstack.push(this.reverse(epsilonT.push))
							console.log("------> stack a: ", nstack);
						} else {
							nstack = nstack.concat(this.reverse(nextState[j].push))
						}
						let result = this.evalNFA(nstr, nroot[k], nstack) == true;
						//console.log("next state["+j+"] returns: "+ result);
						if (result) {
							return true;
						}
					}

				}
			} else {

				root = this.getClosure(nextState[0].to, head)

				if (root.length == 0)
					return false;
				else if (root.length == 1) {
					root = root[0];
					//console.log("width " + letra + " > " + root.label);
					stack = stack.concat(this.reverse(nextState[0].push))
				} else {
					let nstr = str.slice(i + 1, str.length);
					for (let k = root.length - 1; k >= 0; k--) {
						let nstack = JSON.parse(JSON.stringify(stack))
						if (root[k].id != nextState[0].to) {
							console.log("------> stack b: ", nstack);
							nstack.pop();
							let epsilonT = this.transitions.find(x => x.from == nextState[0].from && x.head == head && x.symbol == this.epsilon && x.to == root[k].id);
							nstack = nstack.concat(this.reverse(epsilonT.push))
							console.log("------> stack a: ", nstack);
						} else {
							nstack = nstack.concat(this.reverse(nextState[0].push))
						}
						let result = this.evalNFA(nstr, root[k], nstack) == true;
						//console.log("root state["+k+"] returns: "+ result);
						if (result) {
							return true;
						}
					}
				}
			}
			//console.log("stack", JSON.stringify(stack));
		}
		//console.log("root: ", root, "\n");
		if (this.type == "Final State") {
			let finalStates = this.getClosure(root.id, stack[stack.length - 1]);
			if (root.constructor == Array) {
				finalStates = []
				root.forEach(x => finalStates = finalStates.concat(this.getClosure(x.id, stack[stack.length - 1])))
			}
			return finalStates.filter(x => x.final == true).length > 0;
		} else {
			alert(JSON.stringify(stack));
			return stack.length == 0;
		}
	}

	reverse(array) {
		let narray = JSON.parse(JSON.stringify(array))
		return narray.reverse();
	}

	getClosure(stateId, head) {
		let checked = [];
		let waiting = [stateId];
		while (waiting.length > 0) {
			let currentId = waiting[0];
			checked.push(currentId);
			let epsilonTransitions = this.transitions.filter(x => x.from == currentId && x.symbol == this.epsilon && x.head == head);
			epsilonTransitions.map(x => x.to).forEach(x => waiting.includes(x) || checked.includes(x) ? null : waiting.push(x));
			waiting.shift();
		}
		let states = [];
		states.push(this.states.find(x => x.id == stateId));
		checked.forEach(x => x != stateId ? states.push(this.states.find(y => y.id == x)) : null);
		console.log("Closure of ", stateId, "head ", head, ": ", JSON.stringify(states));
		return states;
	}

	eval1(str) {
		let originalRoot = this.states.find(x => x.root == true);
		let root = this.getClosure(originalRoot.id, "Zo")

		for (let i = root.length - 1; i >= 0; i--) {
			if (root[i].root) {
				if (this.evalNFA(str, root[i], JSON.parse('["Zo"]')) == true) {
					return true;
				}
			} else {
				let nrootId = root[i].id;
				let epsilonT = this.transitions.find(x => x.from == originalRoot.id && x.symbol == this.epsilon && x.to == nrootId && x.head == "Zo");
				let stack = [];
				stack = stack.concat(this.reverse(epsilonT.push));
				console.log(stack);
				if (this.evalNFA(str, root[i], stack) == true) {
					return true;
				}
			}
		}
		return false;
	}

	eval(str) {
		let originalRoot = this.states.find(x => x.root == true);
		return this.evaluate(str, originalRoot, ["Zo"], "");
	}

	parseProductions(productions, terminals) {
		let productors = [];
		let productionsSplitted = productions.split("\n");
		for (let prod of productionsSplitted) {
			if (prod.includes("->")) {
				let temp = prod.split("->");
				if(!productors.map(x => x.name).includes(temp[0].trim(" "))){
					console.log(productors);
					productors.push({ name: temp[0].trim(" ") , returns: []});
				}
				for (let i = 1; i < temp.length; i++) {
					let productorIndex = productors.map(x  => x.name).indexOf(temp[0]);
					if (temp[i].length == 1) {
						productors[productorIndex].returns.push([temp[i]]);
					} else {
						let values = [];

						for (let j = 0; j < temp[i].length; j++) {
							values.push(temp[i][j])
						}
						productors[productorIndex].returns.push(values);
					}
				}
			} else {

				let produced = prod.replace("|", "").split("\n");
				for (let produ of produced) {
					for (let i = 0; i < produ.length; i++) {
						if (produ[i] != " ") {
							if (produ[i].length == 1) {
								productors[productors.length - 1].returns.push([produ[i]]);
							} else {
								let values = [];

								for (let j = 0; j < produ[i].length; j++) {
									values.push(produ[i][j])
								}
								productors[productors.length - 1].returns.push(values);
							}
						}
					}
				}
			}
		}
		return productors;
	}

	fromCFG(productions, terminals, principals) {
		let ret = new PDA([], [], terminals);
		console.log(productions, terminals, principals);

		let productors = this.parseProductions(productions, terminals);
		console.log("productos", productors);

		ret.addState("q0", false);

		for(let prod of productors)
			for(let value of prod.returns)
				ret.addTransition(0,0,this.epsilon, prod.name, value)

		return ret;
	}
}