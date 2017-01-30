class Node{
	constructor(label = "state", isRoot = false, isFinal = false, transitions = []){
		this.label = label;
		this.isRoot = isRoot;
		this.isFinal = isFinal;
		this.transitions = transitions;
	}
}