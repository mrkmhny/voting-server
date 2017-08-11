import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, addVote} from '../src/core';

describe('application logic', ()=> {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map();
      const entries = ['Item 1', 'Item 2'];
      const nextState = setEntries(state,entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Item 1', 'Item 2')
      }));
    });
  });

  describe('addVote', () => {
    it ('increments choice by one', () =>{



        const state = fromJS({
          polls:{
            poll123:{question:"favorite color",choice1:0,choice2:1},
            poll456:{question:"home town",decision1:3,decision2:5},
          }
        });
        const nextState = addVote(state,"poll123","choice1");
        expect(nextState).to.equal(
          fromJS({
            polls:{
              poll123:{question:"favorite color",choice1:1,choice2:1},
              poll456:{question:"home town",decision1:3,decision2:5},
            }
          })
        )
    });
  });


});
const state = fromJS({
  'polls':{
    'poll123':{'question':"favorite color",'choice1':0,'choice2':1},
    'poll456':{'question':"home town",'decision1':3,'decision2':5},
  }
});
console.log(addVote(state,"poll123","choice1"));
