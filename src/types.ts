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

export interface IMincutMaxflow {
  readonly mincut: ReadonlySet<NodeId>
  readonly maxflow: Flow
  readonly isSourceFull: boolean
}

export interface ITeam {
  readonly id: TeamId

  readonly matchesWon: number
  readonly matchesLost: number
  readonly matchesLeft: number

  readonly detailedMatchesLeft: ReadonlyMap<TeamId, number>
}

export interface ITeamPrediction {
  readonly id: TeamId

  readonly isEliminated: boolean
  readonly eliminatingTeams: ReadonlyArray<TeamId>
}

export interface ITournament {
  readonly teams: ReadonlyArray<ITeam>
}

export interface ITournamentPrediction {
  readonly teams: ReadonlyArray<ITeamPrediction>
}
