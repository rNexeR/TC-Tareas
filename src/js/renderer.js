var edit = '';
var posi = '';

renderAlphabetSection = function(){
    let target = document.getElementById('alphabet-list');
    let html = '';
    for(l in dfa.alphabet){
        html += `<li class="list-group-item"><button onclick="deleteAlphabet(`+l+`)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>`+dfa.alphabet[l]+'</li>';
    }
    target.innerHTML = html;
}

renderStatesSection = function(){
    let target = document.getElementById('states-list');
    let html = '';
    for(l in dfa.states){
        html += `<li class="list-group-item"><button onclick="deleteState(`+l+`)" type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fui-cross" aria-hidden="true"></span></button><button onclick="renderStateEdit(`+l+`)" type="button" class="close" aria-label="Edit"><span class="fui-new" aria-hidden="true"></span></button>`+dfa.states[l].label+'</li>';
    }
    target.innerHTML = html;

    target = document.getElementById('fromOptions');
    html = '';

    for(l in dfa.states){
        html += `<option value="`+dfa.states[l].id+`">`+dfa.states[l].label+`</option>`;
    }
    target.innerHTML = html;

    target = document.getElementById('toOptions');
    target.innerHTML = html;
}

renderStateEdit = function(pos){
    edit = 'state';
    posi = pos;

    let target = document.getElementById('modalContent');
    let state = dfa.states[pos];

    let html = `Id<input type="text" class="form-control form-group" id="stateId" placeholder="Id" value="`+ state.id +`" disabled>`;
    html += `Label<input type="text" class="form-control form-group" id="stateLabel" placeholder="Label" value="`+ state.label +`" required>`;

    target.innerHTML = html;
    $('#edit').modal('show');
}

renderTransitionsSection = function(){
    let target = document.getElementById('transitions-list');
    let html = '';
    for(l in dfa.transitions){
        html += `<li class="list-group-item"><button onclick="deleteTransition(`+l+`)" type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="fui-cross" aria-hidden="true"></span></button><button onclick="renderTransitionEdit(`+l+`)" type="button" class="close" aria-label="Edit"><span class="fui-new" aria-hidden="true"></span></button>From: `+dfa.transitions[l].from+`   To: `+dfa.transitions[l].to+`   Label: `+dfa.transitions[l].label+'</li>';
    }
    target.innerHTML = html;
}

renderTransitionEdit = function(pos){
    edit = 'transition';
    posi = pos;

    let target = document.getElementById('modalContent');
    let transition = dfa.transitions[pos];

    let html = `Id<input type="text" class="form-control form-group" id="transitionId" placeholder="Id" value="`+ transition.id +`" disabled>`;
    html += `From<input type="text" class="form-control form-group" id="transitionFrom" placeholder="From" value="`+ transition.from +`" required>`;
    html += `To<input type="text" class="form-control form-group" id="transitionTo" placeholder="To" value="`+ transition.to +`" required>`;
    html += `Label<input type="text" maxlength="1" class="form-control form-group" id="transitionLabel" placeholder="Symbol" value="`+ transition.label +`" required>`;

    target.innerHTML = html;
    $('#edit').modal('show');
}

renderHTML = function(){
    this.renderAlphabetSection();
    this.renderStatesSection();
    this.renderTransitionsSection();
}