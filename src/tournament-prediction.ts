import {
  ITournament,
  ITournamentPrediction,
  NodeId,
  IFlowGraph,
  TeamId,
  IFlowEdge,
  IMincutMaxflow,
  ITournamentStanding,
  ITeamStanding,
  ITeam
} from './types'
import mincutMaxflow from './mincut-maxflow'

export default function (
  inputTournament: ITournament | ITournamentStanding
): ITournamentPrediction {
  const tournament = isTournamentStanding(inputTournament)
    ? getTournament(inputTournament)
    : inputTournament

  const { teams } = tournament
  const teamsIds: ReadonlyArray<NodeId> = teams.map(({ id }) => id)
  const teamsIdsSet = new Set(teamsIds)

  if (teamsIds.length !== teamsIdsSet.size) {
    throw new Error(`${teamsIds.length - teamsIdsSet.size} duplicate teams.`)
  }

  teams.forEach(({ id, matchesLeft, detailedMatchesLeft }) => {
    const detailedMatchesLeftSum = Array.from(
      detailedMatchesLeft.values()
    ).reduce((acc, matches) => acc + matches, 0)

    if (matchesLeft !== detailedMatchesLeftSum) {
      const pair = `(${matchesLeft}, ${detailedMatchesLeftSum})`
      throw new Error(`Incorrect matches-left for team of ${id} with ${pair}`)
    }
  })

  // FIXME: `detailedMatchesLeft` can be incorrect accross different teams. This
  // can be validated or just sparating the left games between teams into its
  // own data-structure for single-source of truth:smiley:.

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

// TODO: look into how to handle draws appropriately since the undlying
// algorithms doesn't support them:sweat_smile:. One reasonable solution is to
// just pretend they never happened:sweat_smile:. Yeeep, I think this might just
// do it:smiley:!
function getTournament (tournament: ITournamentStanding): ITournament {
  const { previousMatches, teams } = tournament

  const matchesWithEachOtherTeam = 2
  const totalMatchesPerTeam = (teams.length - 1) * matchesWithEachOtherTeam

  const ts = teams.map(team => {
    const { id, played, wins, losses } = team

    const detailedMatchesLeftEntries: ReadonlyArray<
      [TeamId, number]
    > = teams
      .filter(({ id: otherTeamId }) => otherTeamId !== id)
      .map(({ id: otherTeamId }) => [otherTeamId, matchesWithEachOtherTeam])

    const detailedMatchesLeft = new Map(detailedMatchesLeftEntries)

    const t: ITeam = {
      id,

      matchesWon: wins,
      matchesLost: losses,
      matchesLeft: totalMatchesPerTeam - played,

      detailedMatchesLeft
    }

    return t
  })

  previousMatches.forEach(match => {
    const { teams } = match
    const [{ id: firstTeamId }, { id: secondTeamId }] = teams

    const firstTeam = ts.find(({ id }) => id === firstTeamId)
    const secondTeam = ts.find(({ id }) => id === secondTeamId)

    const firstTeamDetailedMatchesLeft = firstTeam!.detailedMatchesLeft as Map<
      TeamId,
      number
    >
    const secondTeamDetailedMatchesLeft = secondTeam!
      .detailedMatchesLeft as Map<TeamId, number>

    const firstLeftMatches = firstTeamDetailedMatchesLeft.get(
      secondTeamId
    ) as number
    const secondLeftMatches = secondTeamDetailedMatchesLeft.get(
      firstTeamId
    ) as number

    firstTeamDetailedMatchesLeft.set(secondTeamId, firstLeftMatches - 1)
    secondTeamDetailedMatchesLeft.set(firstTeamId, secondLeftMatches - 1)
  })

  return {
    teams: ts
  }
}

function isTournamentStanding (
  t: ITournament | ITournamentStanding
): t is ITournamentStanding {
  const { teams } = t

  if (teams.length === 0) {
    throw new Error(`Unexpected empty tournament of length ${teams.length}.`)
  }

  return typeof (t.teams[0] as ITeamStanding).played === 'number'
}
