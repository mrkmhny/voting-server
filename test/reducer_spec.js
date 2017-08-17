import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import {createPoll,editQuestion,addChoice,castVote} from '../src/core';

import reducer from '../src/reducer';

describe('reducer', () => {
  it ('handles POLL_CREATE', () => {
    const state = fromJS({polls:[]})
    const action = {type: 'POLL_CREATE'};
    expect(reducer(state,action)).to.equal(createPoll(state));
  })

  it ('handles QUESTION_EDIT', () => {
    const state = fromJS({polls:[{pollId:0}]})
    const action = {type: 'QUESTION_EDIT', pollId:0, q:"Testing?"};
    expect(reducer(state,action)).to.equal(editQuestion(state,action.pollId,action.q));
  })

  it ('handles CHOICE_ADD', () => {
    const state = fromJS({polls:[{pollId:0, choices:[]}]})
    const action = {type: 'CHOICE_ADD', pollId:0, 'choice':"Test choice"};
    expect(reducer(state,action)).to.equal(addChoice(state,action.pollId,action.choice));
  })

  it ('handles VOTE_CAST', () => {
    const state = fromJS({polls:[{pollId:0, votes:[]}]})
    const action = {type: 'VOTE_CAST', pollId:0, voter:'username','voteOrder':[1,2,3]};
    expect(reducer(state,action)).to.equal(castVote(state,action.pollId,action.voter,action.voteOrder));
  })

  it ('returns initial state for unknown action type', () => {
    const state = fromJS({polls:[]})
    const action = {type: 'UNKNOWN_ACTION'};
    expect(reducer(state,action)).to.equal(state);
  })

  it ('initializes state when none is provided', () => {
    const initialState = fromJS({polls:[]})
    const state = undefined;
    const action = {type: 'CREATE_POLL'};
    expect(reducer(state,action)).to.equal(initialState);
  })
})
