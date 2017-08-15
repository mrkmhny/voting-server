import {List, Map, fromJS} from 'immutable';

// test function
export function setEntries(state,entries){
  return state.set('entries',List(entries));
}

/* code snippets for later
if (!choices || choices.length < 3){
  throw "Instant runoff vote requires at least 3 choices to work"
}

///////////////

for (var i = 0; i<choices.length;i++){
  choices[i] = {"choice":choices[i],tally:{}};
}
choices = fromJS(choices);
///////////////////


return state.updateIn(["polls"],polls => polls.push(Map({
  id:state.get('polls').size,
  q:q,
  choices:choices,
  votes:List()
})));
*/




// CREATING AND EDITING POLLS
// create a new poll
export function createPoll(state){
  return state.updateIn(['polls'],polls => polls.push(Map({
    pollId:state.get('polls').size,
    choices:List()
  })));
}

// edit the poll question
export function editQuestion(state,pollId,q){
  return state.setIn(['polls',pollId,"q"],q);
}

// add a choice to the poll
export function addChoice(state,pollId,choice){

  return state.updateIn(['polls',pollId,"choices"],
    choices => choices.push(Map({
        choiceId:state.get('polls').get(pollId).get('choices').size,
        choice:choice
      }))
    
  )
}

// edit an old poll -- THIS SHOULD BE BROKEN DOWN
// edit question
// edit choice

// break this down to smaller pieces
export function editPoll(state,id,q,choices){
  if (!choices || choices.length < 3){
    throw "Instant runoff vote requires at least 3 choices to work"
  }

  for (var i = 0; i<choices.length;i++){
    choices[i] = fromJS(choices[i]).update({"choice":choices[i]});
  }
  choices = fromJS(choices);

  return state.setIn(["polls",id],Map({
    id:id,
    q:q,
    choices:choices,
    votes:List()
  }));
}
/*to do
rename id to pollId
*/

// edit a poll

// delete a poll

// add a choice

// edit a choice

// remove a choice

// VOTING

// cast a vote
export function castVote(state,id,voter,vote){
  return state.updateIn(["polls",id,"votes"],votes => votes.push(Map({
    voter:voter,
    vote:vote
  })))
}


// COUNTING

// find the winner and runner up


// add one vote to choice
export function addVote(state, poll, choice){
  return state.setIn(["polls",poll,choice],state.getIn(["polls",poll,choice])+1);
}
