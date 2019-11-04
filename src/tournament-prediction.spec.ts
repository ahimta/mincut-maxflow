import test from 'ava'

import { readFileSync } from 'fs'
import { resolve } from 'path'

import {
  ITournament,
  ITournamentPrediction,
  ITournamentStanding,
  ITeamStanding,
  IMatch
} from './types'
import tournamentPrediction from './tournament-prediction'

interface IExample {
  readonly tournament: ITournament | ITournamentStanding
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
          matchesLeft: 8
        },
        {
          id: 'philadelphia',

          matchesWon: 80,
          matchesLost: 79,
          matchesLeft: 3
        },
        {
          id: 'new-york',

          matchesWon: 78,
          matchesLost: 78,
          matchesLeft: 6
        },
        {
          id: 'montreal',

          matchesWon: 77,
          matchesLost: 82,
          matchesLeft: 3
        }
      ],
      matchesLeft: [
        ['atlanta', 'philadelphia', 1],
        ['atlanta', 'new-york', 6],
        ['atlanta', 'montreal', 1],
        ['philadelphia', 'montreal', 2]
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
          id: 'montreal',
          isEliminated: true,
          eliminatingTeams: ['atlanta']
        },
        {
          id: 'new-york',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'philadelphia',
          isEliminated: true,
          eliminatingTeams: ['atlanta', 'new-york']
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
          matchesLeft: 21
        },
        {
          id: 'baltimore',

          matchesWon: 71,
          matchesLost: 63,
          matchesLeft: 19
        },
        {
          id: 'boston',

          matchesWon: 69,
          matchesLost: 66,
          matchesLeft: 13
        },
        {
          id: 'toronto',

          matchesWon: 63,
          matchesLost: 72,
          matchesLeft: 17
        },
        {
          id: 'detroit',

          matchesWon: 49,
          matchesLost: 86,
          matchesLeft: 16
        }
      ],
      matchesLeft: [
        ['new-york', 'baltimore', 3],
        ['new-york', 'boston', 8],
        ['new-york', 'toronto', 7],
        ['new-york', 'detroit', 3],

        ['baltimore', 'boston', 2],
        ['baltimore', 'toronto', 7],
        ['baltimore', 'detroit', 7],

        ['boston', 'detroit', 3],

        ['toronto', 'detroit', 3]
      ]
    },
    prediction: {
      teams: [
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
          id: 'detroit',
          isEliminated: true,
          eliminatingTeams: ['baltimore', 'boston', 'new-york']
        },
        {
          id: 'new-york',
          isEliminated: false,
          eliminatingTeams: []
        },
        {
          id: 'toronto',
          isEliminated: false,
          eliminatingTeams: []
        }
      ]
    }
  },
  {
    tournament: {
      teams: readStanding(
        lines('./data/english-premier-league-standing-2019-10-20.csv')
      ),
      previousMatches: readPreviousMatches(
        lines('./data/english-premier-league-previous-matches-2019-10-20.csv')
      )
    },
    prediction: {
      teams: [
        {
          eliminatingTeams: [],
          id: 'ARS',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'AVL',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'BHA',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'BOU',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'BUR',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'CHE',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'CRY',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'EVE',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'LEI',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'LIV',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'MAN',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'MNC',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'NEW',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'NOR',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'SHU',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'SOUT',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'TOT',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'WAT',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'WHU',
          isEliminated: false
        },
        {
          eliminatingTeams: [],
          id: 'WOLV',
          isEliminated: false
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

function readPreviousMatches (lines): ReadonlyArray<IMatch> {
  const matchRegex = /^(\d{4})-(\d{2})-(\d{2}),\s+([A-Z]+),\s+([A-Z]+),\s+(\d+),\s+(\d+)$/

  return lines
    .filter(line => line.match(matchRegex))
    .map(line => line.split(/,\s+/))
    .map(
      ([
        dateString,
        firstTeamId,
        secondTeamId,
        firstTeamScore,
        secondTeamScore
      ]) => ({
        date: new Date(dateString),
        teams: [
          { id: firstTeamId, score: parseInt(firstTeamScore, 10) },
          { id: secondTeamId, score: parseInt(secondTeamScore, 10) }
        ]
      })
    )
}

function readStanding (lines): ReadonlyArray<ITeamStanding> {
  const standingRegex = /^([A-Z]+),\s+(\d+),\s+(\d+),\s+(\d+),\s+(\d+),\s+(\d+),\s+(\d+),\s+(-?\d+),\s+(\d+)$/

  return lines
    .filter(line => line.match(standingRegex))
    .map(line => line.split(/,\s+/))
    .map(
      ([
        id,
        played,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalsDifference,
        points
      ]) => ({
        id,
        played: parseInt(played, 10),
        wins: parseInt(wins, 10),
        draws: parseInt(draws, 10),
        losses: parseInt(losses, 10),
        goalsFor: parseInt(goalsFor, 10),
        goalsAgainst: parseInt(goalsAgainst, 10),
        goalsDifference: parseInt(goalsDifference, 10),
        points: parseInt(points, 10)
      })
    )
}

function lines (filePath) {
  return readFileSync(resolve(filePath), { encoding: 'utf8' }).split(/\n/)
}
