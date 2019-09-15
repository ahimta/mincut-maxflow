/* eslint no-unused-vars: "off" */
/* eslint @typescript-eslint/no-unused-vars: "error" */

import { IFlowEdge, NodeId } from './types'
import ResidualEdge from './residual-edge'

export default class ResidualGraph {
  private readonly _adjacencyMatrix: Map<NodeId, Array<ResidualEdge>>
  private readonly _nodes: Set<NodeId>

  constructor (nodes: ReadonlyArray<NodeId>, edges: ReadonlyArray<IFlowEdge>) {
    this._adjacencyMatrix = new Map<NodeId, Array<ResidualEdge>>()
    this._nodes = new Set<NodeId>(nodes)

    nodes.forEach(id => {
      this._adjacencyMatrix.set(id, [])
    })

    edges.forEach(({ from, to, capacity }) => {
      const edge = new ResidualEdge(from, to, capacity)

      this.getGuaranteedAdjacencyList(from).push(edge)
      this.getGuaranteedAdjacencyList(to).push(edge)
    })
  }

  edges (id: NodeId): ReadonlyArray<ResidualEdge> {
    const { _adjacencyMatrix: adjacencyMatrix } = this

    if (!adjacencyMatrix.get(id)) {
      throw new Error(`Adjacency list for node of ID ${id} not found.`)
    }

    return adjacencyMatrix.get(id) as Array<ResidualEdge>
  }

  exists (id: NodeId): boolean {
    const { _adjacencyMatrix: adjacencyMatrix } = this
    return adjacencyMatrix.has(id)
  }

  nodes (): Set<NodeId> {
    return this._nodes
  }

  private getGuaranteedAdjacencyList (id: NodeId): Array<ResidualEdge> {
    const { _adjacencyMatrix: adjacencyMatrix } = this
    return adjacencyMatrix.get(id) as Array<ResidualEdge>
  }
}
