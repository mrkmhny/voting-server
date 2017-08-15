import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, addVote, createPoll, editPoll, castVote, editQuestion, addChoice} from '../src/core';

var establishedState = fromJS({
  polls: [
    {
      id:0,
      q:"What's the best color?",
      choices:[
        {
          choice:"blue",
          votes:[
            {
              voter:'markrmahoney',
              alternatives:["red","yellow"]
            },
            {
              voter:'mrsmith123',
              alternatives:["blue"]
            }
          ],
          tally:{
            self:5,
            red:2,
            yellow:1
          }},
        "red",
        "yellow"],
      votes:[
        {
          voter:'markrmahoney',
          preference:["red","yellow"]
        },
        {
          voter:'mrsmith123',
          preference:["blue"]
        }
      ]
    },
    {
      id:1,
      q:"What's the best number?",
      choices:["1","13","pi"],
      votes:[
        {
          voter:'markrmahoney',
          preference:["1","pi","13"]
        },
        {
          voter:'mrsmith123',
          preference:["pi"]
        }
      ]

    }
  ],
})

describe('POLLS:', ()=> {

  describe('createPoll()', () => {
    it ('Adds a new poll to the state', () => {
      const state = fromJS({
        polls:[
          {pollId:0},
          {pollId:1}
        ]
      });
      const nextState = createPoll(state);
      expect(nextState).to.equal(fromJS({
        polls: [
          {pollId:0},
          {pollId:1},
          {pollId:2,choices:List()}
        ]
      }));
    })
  })

  describe('editQuestion()', () => {
    const state = fromJS({
      polls:[
        {pollId:0},
        {pollId:1,q:"Best city?"}
      ]
    });
    it ('Updates existing question', () => {
      expect(editQuestion(state,1,"Favorite color?")).to.equal(fromJS({
        polls: [
          {pollId:0},
          {pollId:1,q:"Favorite color?"}
        ]
      }));
    })
    it ("Adds a new question if one doesn't already exist", () => {
      expect(editQuestion(state,0,"Favorite color?")).to.equal(fromJS({
        polls: [
          {pollId:0, q:"Favorite color?"},
          {pollId:1,q:"Best city?"}
        ]
      }));
    })
  })

  describe('addChoice()', () => {
    const state = fromJS({
      polls:[
        {pollId:0,choices:List()},
        {
          pollId:1,
          q:"Best city?",
          choices:[
            {choiceId: 0, choice:"NY"},
            {chocieId: 1, choice:"LA"}
          ]
        }
      ]
    })
    it('Adds a choice when none exist', () => {
      expect(addChoice(state,0,"New choice!")).to.equal(fromJS({
        polls:[
          {
            pollId:0,
            choices:[
              {choiceId:0,choice:"New choice!"}
            ]
          },
          {
            pollId:1,
            q:"Best city?",
            choices:[
              {choiceId: 0, choice:"NY"},
              {chocieId: 1, choice:"LA"}
            ]
          }
        ]

      }))
    })
    it('Adds a choice to an existing list of choices', () => {

    })
  })
/*
  describe('editPoll()', () => {
    it ('Edits the question and choices for the poll', () => {
      const state = fromJS({
        polls: [
          {id:0},
          {id:1},
          {
            id:2,
            q:"Who should be president?",
            choices:[
              {choice:"Mario",tally:{}},
              {choice:"Luigi",tally:{}},
              {choice:"Bowser",tally:{}}
            ],
            votes:List()
          }
        ]
      });
      const q = "Who should be vice president?";
      const choices = ['Mario','Luigi','Bowser'];
      const id = 2;
      const nextState = editPoll(state,id,q,choices);
      expect(nextState).to.equal(fromJS({
        polls: [
          {id:0},
          {id:1},
          {
            id:id,
            q:q,
            choices:["Mario","Luigi","Bowse"],
            votes:List()
          }
        ]
      }));
    })
  })*/
})


describe("VOTING",() => {
  describe("castVote()", () => {
    it ("adds a new vote object to array of votes in poll",()=>{
      const state = fromJS({
        polls: [
          {id:0},
          {id:1},
          {
            id:2,
            q:"Who should be president?",
            choices:["Mario","Luigi","Peach"],
            votes:List()
          }
        ]
      })
      const vote = List(["Mario","Peach"]);
      const id = 2;
      const voter = 'mrkmhny';
      const nextState = castVote(state, id, voter, vote);
      expect(nextState).to.equal(fromJS({
        polls: [
          {id:0},
          {id:1},
          {
            id:2,
            q:"Who should be president?",
            choices:["Mario","Luigi","Peach"],
            votes:[{
              voter:voter,
              vote:vote
            }]
          }
        ]
      }))
    })
  })
})

describe("TALLYING",()=>{
  describe("tallyResults()",()=>{

  })
})



/*
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
*/
