import {createPoll, editQuestion, addChoice, castVote, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE,action){
  switch (action.type){
    case 'POLL_CREATE':
      return createPoll(state);
    case 'QUESTION_EDIT':
      return editQuestion(state,action.pollId,action.q);
    case 'CHOICE_ADD':
      return addChoice(state,action.pollId,action.choice);
    case 'VOTE_CAST':
      return castVote(state,action.pollId,action.voter,action.voteOrder);
  }
  return state;
}
