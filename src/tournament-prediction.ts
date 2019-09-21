/* eslint no-unused-vars: "off" */
/* eslint @typescript-eslint/no-unused-vars: "error" */

import {
  ITournament,
  ITournamentPrediction,
  NodeId,
  IFlowGraph,
  TeamId,
  IFlowEdge,
  IMincutMaxflow
} from './types'
import mincutMaxflow from './mincut-maxflow'

export default function (tournament: ITournament): ITournamentPrediction {
  const { teams } = tournament

  const teamsIds: ReadonlyArray<NodeId> = teams.map(({ id }) => id)
  const _teamsMatchesLeft: Map<TeamId, ReadonlyMap<TeamId, number>> = new Map()

  teams.forEach(team => {
    _teamsMatchesLeft.set(team.id, team.detailedMatchesLeft)
  })

  const teamsMatchesLeft: ReadonlyMap<
    TeamId,
    ReadonlyMap<TeamId, number>
  > = _teamsMatchesLeft
  const teamsWins: ReadonlyMap<TeamId, number> = teams.reduce(
    (_teamsWins, team) => {
      _teamsWins.set(team.id, team.matchesWon)

      return _teamsWins
    },
    new Map()
  )

  const sourceId = 's'
  const sinkId = 't'

  const ps = teams.map(team => {
    const possibleEliminatingTeams = teams
      .filter(({ id, matchesWon }) => {
        const maxWins = team.matchesWon + team.matchesLeft
        return id !== team.id && matchesWon > maxWins
      })
      .map(({ id }) => id)

    if (possibleEliminatingTeams.length) {
      const mm: IMincutMaxflow = {
        mincut: new Set([sourceId].concat(possibleEliminatingTeams)),
        maxflow: 0,
        isSourceFull: false
      }

      return {
        mincutMaxflow: mm,
        team
      }
    }

    const otherTeamsIds = teamsIds.filter(id => id !== team.id)
    const otherTeamsIdsCombinations = flatMap(
      otherTeamsIds.map((id, i) => {
        const ids: [NodeId, NodeId][] = []

        for (let j = i + 1; j < otherTeamsIds.length; j++) {
          const otherTeamId = otherTeamsIds[j]
          ids.push([id, otherTeamId])
        }

        return ids
      })
    )

    const nodes: ReadonlyArray<NodeId> = [
      sourceId,
      ...otherTeamsIdsCombinations.map(([id1, id2]) => `${id1}-${id2}`),
      ...otherTeamsIds,
      sinkId
    ]

    const gamesLeftEdges: ReadonlyArray<
      IFlowEdge
    > = otherTeamsIdsCombinations.map(([id1, id2]) => ({
      from: sourceId,
      to: `${id1}-${id2}`,

      // @ts-ignore
      capacity: teamsMatchesLeft.get(id1).get(id2) || 0
    }))

    const intermediateEdges: ReadonlyArray<IFlowEdge> = flatMap(
      otherTeamsIdsCombinations.map(([id1, id2]) => {
        const from = `${id1}-${id2}`
        const capacity = Number.MAX_SAFE_INTEGER

        return [{ from, capacity, to: id1 }, { from, capacity, to: id2 }]
      })
    )

    const gamesToWinEdges: ReadonlyArray<IFlowEdge> = otherTeamsIds.map(
      otherTeamId => {
        const from = otherTeamId
        const to = sinkId
        // @ts-ignore
        const capacity =
          team.matchesWon +
          team.matchesLeft -
          (teamsWins.get(otherTeamId) as number)

        return { from, to, capacity }
      }
    )

    const edges: ReadonlyArray<IFlowEdge> = [
      ...gamesLeftEdges,
      ...intermediateEdges,
      ...gamesToWinEdges
    ]

    const graph: IFlowGraph = {
      nodes,
      edges
    }

    return {
      mincutMaxflow: mincutMaxflow(graph, sourceId, sinkId),
      team
    }
  })

  const predictions = ps.map(({ mincutMaxflow, team }) => {
    const { mincut, isSourceFull } = mincutMaxflow
    const { id } = team
    const isEliminated = !isSourceFull
    const eliminatingTeams = !isEliminated
      ? []
      : Array.from(mincut)
        .slice(1)
        .filter(id => teams.find(({ id: _id }) => id === _id))

    return { id, isEliminated, eliminatingTeams }
  })

  return { teams: predictions }
}

function flatMap<T> (xss: ReadonlyArray<ReadonlyArray<T>>): ReadonlyArray<T> {
  return Array.prototype.concat.apply([], xss)
}
