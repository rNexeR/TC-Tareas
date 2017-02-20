var edit = '';
var posi = '';

renderAlphabetSection = function(){
    let target = document.getElementById('alphabet-list');
    let html = '';
    for(l in automata.alphabet){
        html += `<li class="list-group-item col-md-6"><button onclick="deleteAlphabet(`+l+`)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>`+automata.alphabet[l]+'</li>';
    }
    target.innerHTML = html;
}

renderStatesSection = function(){
    let target = document.getElementById('states-list');
    let html = '';
    for(l in automata.states){
        html += `<li class="list-group-item col-md-6"><button onclick="deleteState(`+l+`)" type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fui-cross" aria-hidden="true"></span></button><button onclick="renderStateEdit(`+l+`)" type="button" class="close" aria-label="Edit"><span class="fui-new" aria-hidden="true"></span></button>`+automata.states[l].label+'</li>';
    }
    target.innerHTML = html;

    target = document.getElementById('fromOptions');
    html = '';

    for(l in automata.states){
        html += `<option value="`+automata.states[l].id+`">`+automata.states[l].label+`</option>`;
    }
    target.innerHTML = html;

    target = document.getElementById('toOptions');
    target.innerHTML = html;
}

renderStateEdit = function(pos){
    edit = 'state';
    posi = pos;

    let target = document.getElementById('modalContent');
    let state = automata.states[pos];

    let html = `Id<input type="text" class="form-control form-group" id="stateId" placeholder="Id" value="`+ state.id +`" disabled>`;
    html += `Label<input type="text" class="form-control form-group" id="stateLabel" placeholder="Label" value="`+ state.label +`" required>`;

    target.innerHTML = html;
    $('#edit').modal('show');
}

renderTransitionsSection = function(){
    let target = document.getElementById('transitions-list');
    let html = '';
    for(l in automata.transitions){
        html += `<li class="list-group-item col-md-6"><button onclick="deleteTransition(`+l+`)" type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fui-cross" aria-hidden="true"></span></button><button onclick="renderTransitionEdit(`+l+`)" type="button" class="close" aria-label="Edit"><span class="fui-new" aria-hidden="true"></span></button>From: `+automata.states.find(x => x.id == automata.transitions[l].from).label+`   To: `+automata.states.find(x => x.id == automata.transitions[l].to).label+`   Label: `+automata.transitions[l].label+'</li>';
    }
    target.innerHTML = html;
}

renderTransitionEdit = function(pos){
    edit = 'transition';
    posi = pos;

    let target = document.getElementById('modalContent');
    let transition = automata.transitions[pos];

    let html = `Id<input type="text" class="form-control form-group" id="transitionId" placeholder="Id" value="`+ transition.id +`" disabled>`;
    html += `From<input type="text" class="form-control form-group" id="transitionFrom" placeholder="From" value="`+ transition.from +`" required>`;
    html += `To<input type="text" class="form-control form-group" id="transitionTo" placeholder="To" value="`+ transition.to +`" required>`;
    html += `Label<input type="text" maxlength="1" class="form-control form-group" id="transitionLabel" placeholder="Symbol" value="`+ transition.label +`" required>`;

    target.innerHTML = html;
    $('#edit').modal('show');
}

renderAutomataType = function(){
    let target = document.getElementById('title');
    target.innerHTML = automata.type.toUpperCase();
    this.renderConversionOptions();
}

renderConversionOptions = function(){
    let target = document.getElementById('conversionOptions');
    let html = "";
    if(automata.type == "nfa" || automata.type == "nfa-e" ){
        html += `<button onclick="convertNFAToDFA()" class="btn btn-inverse">to DFA</button>`;
    }else if(automata.type == "dfa"){
        html += `<button onclick="convertDFAToRegExp()" class="btn btn-inverse">to RegExp</button>`;
    }

    target.innerHTML = html;
}

renderConversionRegexp = function(regexp){
    let target = document.getElementById('conversionModalContent');
    let container = document.getElementById('conversionDiv');
    container.style.height = 0;
    container.style.border = 0;

    let html = '<h5>RegExp: <h6>'+regexp+'</h6></h5>';

    target.innerHTML = html;
    $('#newConversion').modal('show');
}

renderConversion = function(){
    let target = document.getElementById('conversionModalContent');
    let container = document.getElementById('conversionDiv');
    container.style.height = "70%";
    container.style.border = 1;


    // provide the data in the vis format
    let statesDS = new vis.DataSet(converted.states);
    let transitionsDS = new vis.DataSet(converted.transitions);

    let data = {
        nodes: statesDS,
        edges: transitionsDS
    };
    //let options = {};
    let options = {
            "nodes": {
              "shapeProperties": {
                  "interpolation": false
              }
          }
      };

    // initialize your network!
    let conversion = new vis.Network(container, data, options);
    $('#newConversion').modal('show');

    target.innerHTML = `<button class="btn btn-success" onclick="setConvertedToDefault()">Set as default</button>`;
}

renderHTML = function(){
    this.renderAlphabetSection();
    this.renderStatesSection();
    this.renderTransitionsSection();
    this.renderAutomataType();
    this.renderConversionOptions();
}