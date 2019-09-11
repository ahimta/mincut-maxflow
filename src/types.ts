export type Flow = number
export type NodeId = string

export interface IFlowEdge {
  readonly from: NodeId
  readonly to: NodeId

  readonly capacity: Flow
  flow: Flow
}

export interface IResidualEdge extends IFlowEdge {
  addResidualFlowTo(id: NodeId, delta: Flow): void
  other(id: NodeId): NodeId
  residualCapacityTo(id: NodeId): Flow
}

export interface IFlowGraph {
  readonly nodes: ReadonlyArray<NodeId>
  readonly edges: ReadonlyArray<IFlowEdge>
}

export interface IResidualGraph {
  readonly nodes: ReadonlyArray<NodeId>
  readonly adjacencyMatrix: Map<NodeId, Array<IResidualEdge>>

  adjacencyList(id: NodeId): ReadonlyArray<IResidualEdge>
}

export interface IMincutMaxflow {
  readonly mincut: ReadonlyArray<NodeId>
  readonly maxflow: Flow
}
