import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setEntries, addVote, createPoll,
        editPoll, castVote, editQuestion,
        addChoice, tallyFinalResults} from '../src/core';

var establishedState = fromJS({
  polls: [
    {
      id:0,
      q:"What's the best color?",
      choices:[
        {
          choiceName:"blue",
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
          {pollId:2,choices:List(),votes:List()}
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
          {pollId:1, q:"Best city?"}
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
            {choiceId: 0, choiceName:"NY"},
            {choiceId: 1, choiceName:"LA"}
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
              {choiceId:0,choiceName:"New choice!", tally:{}}
            ]
          },
          {
            pollId:1,
            q:"Best city?",
            choices:[
              {choiceId: 0, choiceName:"NY"},
              {choiceId: 1, choiceName:"LA"}
            ]
          }
        ]

      }))
    })
    it('Adds a choice to an existing list of choices', () => {
      expect(addChoice(state,1,"DC")).to.equal(fromJS({
        polls:[
          {
            pollId:0,
            choices:[]
          },
          {
            pollId:1,
            q:"Best city?",
            choices:[
              {choiceId: 0, choiceName:"NY"},
              {choiceId: 1, choiceName:"LA"},
              {choiceId: 2, choiceName:"DC", tally:{}}
            ]
          }
        ]

      }))
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
    it ("adds a new vote in the votes List",()=>{
      const state = fromJS({
        polls: [
          {pollId:0},
          {pollId:1},
          {
            pollId:2,
            q:"Best city?",
            choices:[
              {choiceId: 0, choiceName:"NY", tally:{}},
              {choiceId: 1, choiceName:"LA", tally:{}},
              {choiceId: 2, choiceName:"DC", tally:{}}
            ],
            votes:[]
          }
        ]
      })
      const vote = ["LA","DC"];
      const id = 2;
      const voter = 'mrkmhny';
      const nextState = castVote(state, id, voter, vote);
      expect(nextState).to.equal(fromJS({
        polls: [
          {pollId:0},
          {pollId:1},
          {
            pollId:2,
            q:"Best city?",
            choices:[
              {choiceId: 0, choiceName:"NY", tally:{}},
              {choiceId: 1, choiceName:"LA", tally:{}},
              {choiceId: 2, choiceName:"DC", tally:{}}
            ],
            votes: [
              {voteId:0, voter:'mrkmhny', voteOrder:["LA","DC"]}
            ]
          }
        ]
      }))
    })
  })
})

describe("TALLYING",()=>{
  describe("tallyFinalResults()",()=>{

    var state = fromJS({
      polls:[
        {pollId:0},
        {pollId:1,
        q:"Best city?",
        choices:[
          {choiceId: 0, choiceName:"NY", tally:[], eliminated:0},
          {choiceId: 1, choiceName:"LA", tally:[], eliminated:0},
          {choiceId: 2, choiceName:"DC", tally:[], eliminated:0},
          {choiceId: 3, choiceName:"SF", tally:[], eliminated:0},
          {choiceId: 4, choiceName:"BO", tally:[], eliminated:0}
        ],
        votes: [
          // expected results
          /*
            NY: 40% -> +0
            LA: 20% -> +10% from SF +10% from DC + 10% from BO
            SF: 20% -> +10% from DC, eliminated 2nd round
            DC: 10% -> eliminated 1st round
            BO: 10% -> eliminated 1st round
          */
          {voteId:0, voteOrder:["SF","NY","LA"]}, // losing vote that won't reach end
          {voteId:1, voteOrder:["NY","DC"]}, // winning vote that won't reach end
          {voteId:2, voteOrder:["NY","SF"]},
          {voteId:3, voteOrder:["NY","DC","LA"]},
          {voteId:4, voteOrder:["NY"]}, // winning vote with no alts
          {voteId:5, voteOrder:["BO"]}, // losing vote with no alts
          {voteId:6, voteOrder:["LA","DC"]}, // winning vote with losing alts
          {voteId:7, voteOrder:["DC","SF","LA"]}, // makes it third choice
          {voteId:8, voteOrder:["LA","SF"]},
          {voteId:9, voteOrder:["SF","LA","NY"]}

        ]}
      ]})
      var pollId=1;

    it("Should calculate the total for winner and runner up with 4 choices", () =>{
      expect(tallyFinalResults(state,pollId)).to.equal(fromJS(
        {
          polls:[
            {pollId:0},
            {pollId:1,
            q:"Best city?",
            choices:[
              {choiceId: 0, choiceName:"NY", tally:["NY","NY","NY","NY"], eliminated:3},
              {choiceId: 1, choiceName:"LA", tally:["LA","LA"], eliminated:2},
              {choiceId: 2, choiceName:"DC", tally:["DC"], eliminated:1},
              {choiceId: 3, choiceName:"SF", tally:["SF","DC","LA","SF"], eliminated:3},
              {choiceId: 4, choiceName:"BO", tally:["BO"], eliminated:1}
            ],
            votes: [
              {voteId:0, voteOrder:["SF","NY","LA"]}, // losing vote that won't reach end
              {voteId:1, voteOrder:["NY","DC"]}, // winning vote that won't reach end
              {voteId:2, voteOrder:["NY","SF"]},
              {voteId:3, voteOrder:["NY","DC","LA"]},
              {voteId:4, voteOrder:["NY"]}, // winning vote with no alts
              {voteId:5, voteOrder:["BO"]}, // losing vote with no alts
              {voteId:6, voteOrder:["LA","DC"]}, // winning vote with losing alts
              {voteId:7, voteOrder:["DC","SF","LA"]}, // makes it third choice
              {voteId:8, voteOrder:["LA","SF"]},
              {voteId:9, voteOrder:["SF","LA","NY"]}

            ]}
          ]}
      ))
    })
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
