import {List} from 'immutable';
import {Map} from 'immutable';

export function setEntries(state,entries){
  return state.set('entries',List(entries));
}

// adds one vote to choice
export function addVote(state, poll, choice){
  return state.setIn(["polls",poll,choice],state.getIn(["polls",poll,choice])+1);
}

/*
state
- polls
-- [
-- {name:"", if:"" choices:{choice:"#"} }
-- ]
*/
