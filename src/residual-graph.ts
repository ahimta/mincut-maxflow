import { IResidualGraph, NodeId, IResidualEdge, IFlowEdge } from './types'
import ResidualEdge from './residual-edge'

export default class ResidualGraph implements IResidualGraph {
  readonly nodes: ReadonlyArray<NodeId>
  readonly adjacencyMatrix: Map<NodeId, Array<IResidualEdge>>

  constructor (nodes: ReadonlyArray<NodeId>, edges: ReadonlyArray<IFlowEdge>) {
    this.adjacencyMatrix = new Map<NodeId, Array<ResidualEdge>>()
    this.nodes = nodes

    nodes.forEach(id => {
      this.adjacencyMatrix.set(id, [])
    })

    edges.forEach(({ from, to, capacity, flow }) => {
      const edge = new ResidualEdge(from, to, capacity, flow)

      this.getGuaranteedAdjacencyList(from).push(edge)
      this.getGuaranteedAdjacencyList(to).push(edge)
    })
  }

  adjacencyList (id: NodeId): ReadonlyArray<ResidualEdge> {
    const { adjacencyMatrix } = this

    if (!adjacencyMatrix.get(id)) {
      throw new Error(`Adjacency list for node of ID ${id} not found.`)
    }

    return adjacencyMatrix.get(id) as Array<ResidualEdge>
  }

  exists (id: NodeId): boolean {
    const { adjacencyMatrix } = this
    return adjacencyMatrix.has(id)
  }

  private getGuaranteedAdjacencyList (id: NodeId): Array<ResidualEdge> {
    const { adjacencyMatrix } = this
    return adjacencyMatrix.get(id) as Array<ResidualEdge>
  }
}
