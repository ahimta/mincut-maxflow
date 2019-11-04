export type Flow = number
export type NodeId = string
export type TeamId = string

export interface IFlowEdge {
  readonly from: NodeId
  readonly to: NodeId

  readonly capacity: Flow
}

export interface IFlowGraph {
  readonly nodes: ReadonlyArray<NodeId>
  readonly edges: ReadonlyArray<IFlowEdge>
}

export interface IMatch {
  readonly date: Date
  readonly teams: [{ id: TeamId; score: number }, { id: TeamId; score: number }]
}

export interface IMincutMaxflow {
  // NOTE: `mincut` is sorted for determenistic results.
  readonly mincut: ReadonlyArray<NodeId>
  readonly maxflow: Flow
  readonly isSourceFull: boolean
}

export interface ITeam {
  readonly id: TeamId

  readonly matchesWon: number
  readonly matchesLost: number
  readonly matchesLeft: number
}

export interface ITeamPrediction {
  readonly id: TeamId

  readonly isEliminated: boolean
  // NOTE: `eliminatingTeams` is sorted for determenistic results.
  readonly eliminatingTeams: ReadonlyArray<TeamId>
}

export interface ITeamStanding {
  readonly id: TeamId

  readonly played: number
  readonly wins: number
  readonly draws: number
  readonly losses: number
}

export interface ITournament {
  readonly teams: ReadonlyArray<ITeam>
  readonly matchesLeft: ReadonlyArray<[TeamId, TeamId, number]>
}

export interface ITournamentPrediction {
  // NOTE: `eliminatingTeams` is sorted for determenistic results.
  readonly teams: ReadonlyArray<ITeamPrediction>
}

export interface ITournamentStanding {
  readonly teams: ReadonlyArray<ITeamStanding>
  readonly previousMatches: ReadonlyArray<IMatch>
}
