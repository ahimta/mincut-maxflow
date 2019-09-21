/* eslint no-unused-vars: "off" */
/* eslint @typescript-eslint/no-unused-vars: "error" */

import test from 'ava'

import { ITournament, ITournamentPrediction } from './types'
import tournamentPrediction from './tournament-prediction'

interface IExample {
  readonly tournament: ITournament
  readonly prediction: ITournamentPrediction
}

const examples: ReadonlyArray<IExample> = [
  {
    tournament: {
      teams: [
        {
          id: 'atlanta',

          matchesWon: 83,
          matchesLost: 71,
          matchesLeft: 8,

          detailedMatchesLeft: new Map([
            ['philadelphia', 1],
            ['new-york', 6],
            ['montreal', 1]
          ])
        },
        {
          id: 'philadelphia',

          matchesWon: 80,
          matchesLost: 79,
          matchesLeft: 3,

          detailedMatchesLeft: new Map([['atlanta', 1], ['montreal', 2]])
        },
        {
          id: 'new-york',

          matchesWon: 78,
          matchesLost: 78,
          matchesLeft: 6,

          detailedMatchesLeft: new Map([['atlanta', 6]])
        },
        {
          id: 'montreal',

          matchesWon: 77,
          matchesLost: 82,
          matchesLeft: 3,

          detailedMatchesLeft: new Map([['atlanta', 1], ['philadelphia', 2]])
        }
      ]
    },
    prediction: {
      teams: [
        {
          id: 'atlanta',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'philadelphia',
          isEliminated: true,
          eliminatingTeams: ['atlanta', 'new-york']
        },
        {
          id: 'new-york',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'montreal',
          isEliminated: true,
          eliminatingTeams: ['atlanta']
        }
      ]
    }
  },
  {
    tournament: {
      teams: [
        {
          id: 'new-york',

          matchesWon: 75,
          matchesLost: 59,
          matchesLeft: 28,

          detailedMatchesLeft: new Map([
            ['baltimore', 3],
            ['boston', 8],
            ['toronto', 7],
            ['detroit', 3]
          ])
        },
        {
          id: 'baltimore',

          matchesWon: 71,
          matchesLost: 63,
          matchesLeft: 28,

          detailedMatchesLeft: new Map([
            ['new-york', 3],
            ['boston', 2],
            ['toronto', 7],
            ['detroit', 7]
          ])
        },
        {
          id: 'boston',

          matchesWon: 69,
          matchesLost: 66,
          matchesLeft: 27,

          detailedMatchesLeft: new Map([
            ['new-york', 8],
            ['baltimore', 2],
            ['detroit', 3]
          ])
        },
        {
          id: 'toronto',

          matchesWon: 63,
          matchesLost: 72,
          matchesLeft: 27,

          detailedMatchesLeft: new Map([
            ['new-york', 7],
            ['baltimore', 7],
            ['detroit', 3]
          ])
        },
        {
          id: 'detroit',

          matchesWon: 49,
          matchesLost: 86,
          matchesLeft: 27,

          detailedMatchesLeft: new Map([
            ['new-york', 3],
            ['baltimore', 7],
            ['boston', 3],
            ['toronto', 3]
          ])
        }
      ]
    },
    prediction: {
      teams: [
        {
          id: 'new-york',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'baltimore',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'boston',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'toronto',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'detroit',
          isEliminated: true,
          eliminatingTeams: ['new-york', 'boston', 'baltimore', 'toronto']
        }
      ]
    }
  }
]

examples.forEach(({ tournament, prediction }, i) => {
  test(`${i}`, t => {
    t.deepEqual(tournamentPrediction(tournament), prediction)
  })
})
