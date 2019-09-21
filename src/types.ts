export type Flow = number
export type NodeId = string

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
