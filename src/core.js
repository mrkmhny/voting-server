import {List, Map, fromJS, toJS, findIndex} from 'immutable';

// This should be pulled from a database
export const INITIAL_STATE = fromJS({polls:[]});


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
    choices:List(),
    votes:List()
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
      choiceName:choice,
      tally:Map()
    }))
  )
}
// VOTING
// cast a vote
export function castVote(state,pollId,voter,voteOrder){
  // find the index of the voter's first choice
  return state.updateIn(["polls",pollId,"votes"],votes => votes.push(Map({
    voteId:state.get('polls').get(pollId).get('votes').size,
    voter:voter,
    voteOrder:List(voteOrder)
  })))
}

// TALLYING

// Finding the final result
export function tallyFinalResults(state,pollId){
/***********************************************
This is the main tallying logic, and will be heavily commented for clarity
There are some variations of IRV
This implementation assumes:
- Only 1 choice eliminated each round, unless there is a tie
- Eliminates all results tied for last place in a single round
- Continues until there are only 2 choices left (winner & runner up)
- Inherited votes will display only the original 1st choice, not full history
************************************************/

  console.log('tallying has begun');

  // for performance and readability, save this poll's index for future use
  // convert to regular JSON and convert back to immutable object at end
  // make changes to thisPoll, but merged into state before return statement
  var thisPoll = state.get('polls').get(pollId).toJS();

  // set any existing tallies to a blank List []
  for (var h = 0;h<thisPoll.choices.length;h++){
    thisPoll.choices[h].tally = [];
  }
  console.log('tallies have been cleared')

  // initialize current round, which will be incremented each loop
  var currentRound = 1;

  // initialize remaining choices by counting all choices
  // we will decrement this each time we eliminate a choice
  var remainingChoices = thisPoll.choices.length;

  // repeat this loop, eliminating choices each time until only 2 are left
  while(remainingChoices>1){

    // set any non-eliminated tallies to a blank List []
    for (var h = 0;h<thisPoll.choices.length;h++){
      if (thisPoll.choices[h].eliminated ===0){
        thisPoll.choices[h].tally = [];
      }
    }

    /* PHASE 1: count all the votes and attach to each choice */

    // iterate over all the votes stored in the votes array
    for (var i=0;i<thisPoll.votes.length;i++){
      console.log('\x1b[36m%s\x1b[0m','Checking voteId: ' + i);

      // for each item in votes, iterate over the voteOrder array
      for (var j=0;j<thisPoll.votes[i].voteOrder.length;j++){
        console.log("\x1b[31m%s\x1b[0m",'checking voteOrder: ' + j);
        // for readability, create temporary variables for...
        // ... the current item in the voteOrder array and...
        var voteOrderItem = thisPoll.votes[i].voteOrder[j];

        // ... the index of that item in the choices array
        var voteOrderItemChoiceIndex;
        for (var m = 0; m<thisPoll.choices.length;m++){
          if (thisPoll.choices[m].choiceName == voteOrderItem){
            voteOrderItemChoiceIndex = m;
            break;
          }
        }

        console.log('voteOrderItemChoiceIndex: ' + voteOrderItemChoiceIndex)
        console.log('voteOrderItem: '+ voteOrderItem);

        // check if this choice has not already been eliminated
        if (!thisPoll.choices[voteOrderItemChoiceIndex].eliminated){

          console.log(voteOrderItem + " has not yet been eliminated");
          console.log('we are adding voteOrder: ' +j)

          // if not, add this vote to the tally and name it by the vote's first choice
          thisPoll.choices[voteOrderItemChoiceIndex].tally.push(thisPoll.votes[i].voteOrder[0]);

          console.log("Total for " + voteOrderItem +": "+thisPoll.choices[voteOrderItemChoiceIndex].tally)



          // after we're done applying this vote, we need to stop iterating on voteOrder
          break;
        }
      }
      /*Now we move on to the next vote*/
    }

    /* PHASE 2: Find the losers and eliminate them */

    // initialize losing tally.  we will compare and reassign later
    var lowestTallyCount = Infinity;

    // iterate through all of the choices
    for (var k=0;k<thisPoll.choices.length;k++){

      // find lowest tally count out of all of the choices that are not eliminated...
      if (thisPoll.choices[k].tally.length<lowestTallyCount
        && thisPoll.choices[k].eliminated === 0){
        // ... and save that number
        lowestTallyCount = thisPoll.choices[k].tally.length;
      }
    }

    // iterate through all choices again
    for (var k=0;k<thisPoll.choices.length;k++){

      console.log(thisPoll.choices[k].choiceName + "'s tally count is " + thisPoll.choices[k].tally.length);
      console.log("the current worst tally is " +lowestTallyCount);

      // check if tally is equal to the lowest that we previously saw...
      // ... and it wasn't already eliminated ...
      if (thisPoll.choices[k].tally.length<=lowestTallyCount
        && thisPoll.choices[k].eliminated === 0){
        // ... eliminate item by setting .eliminated to the current round...
        thisPoll.choices[k].eliminated =currentRound;
        // ... and decrement the total number of remaining choices
        remainingChoices--;
        console.log(thisPoll.choices[k].choiceName +' has been eliminated :: ' + remainingChoices + ' remaining')
      }
    }
    // we've completed one full round, so increment currentRound by 1
    console.log('Round '+ currentRound + " has ended")
    currentRound++;

    /*This should continue looping as long as remainingChoices > 2*/
  }
  thisPoll = fromJS(thisPoll);
  return state.setIn(["polls",pollId],thisPoll)
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


// COUNTING

// find the winner and runner up


// add one vote to choice
export function addVote(state, poll, choice){
  return state.setIn(["polls",poll,choice],state.getIn(["polls",poll,choice])+1);
}
