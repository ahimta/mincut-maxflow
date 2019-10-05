import { IFlowEdge, NodeId } from './types'
import ResidualEdge from './residual-edge'

export default class ResidualGraph {
  private readonly _adjacencyMatrix: ReadonlyMap<
    NodeId,
    ReadonlyArray<ResidualEdge>
  >

  private readonly _nodes: ReadonlySet<NodeId>

  constructor (nodes: ReadonlyArray<NodeId>, edges: ReadonlyArray<IFlowEdge>) {
    const adjacencyMatrix = new Map<NodeId, Array<ResidualEdge>>()
    this._nodes = new Set<NodeId>(nodes)

    if (nodes.length !== this._nodes.size) {
      throw new Error(`${nodes.length - this._nodes.size} duplicate nodes.`)
    }

    const edgesSet = new Set(edges.map(({ from, to }) => `${from}->${to}`))

    if (edges.length !== edgesSet.size) {
      throw new Error(`${edges.length - edgesSet.size} duplicate edges.`)
    }

    nodes.forEach(id => {
      adjacencyMatrix.set(id, [])
    })

    edges.forEach(({ from, to, capacity }) => {
      const edge = new ResidualEdge(from, to, capacity)

      // @ts-ignore
      adjacencyMatrix.get(from).push(edge)
      // @ts-ignore
      adjacencyMatrix.get(to).push(edge)
    })

    this._adjacencyMatrix = adjacencyMatrix
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

  nodes (): ReadonlySet<NodeId> {
    return this._nodes
  }
}
