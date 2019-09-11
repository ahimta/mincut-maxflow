import { NodeId, Flow, IMincutMaxflow } from './types'
import ResidualEdge from './residual-edge'
import ResidualGraph from './residual-graph'

interface State {
  readonly edgeTo: Map<NodeId, ResidualEdge>
  readonly marked: Set<NodeId>
}

export default class FordFulkerson implements IMincutMaxflow {
  mincut: ReadonlyArray<NodeId>
  maxflow: Flow

  constructor (graph: ResidualGraph, s: NodeId, t: NodeId) {
    if (!(graph.exists(s) && graph.exists(t))) {
      throw new Error(`Invalid source or sink of (${s}, ${t}).`)
    }

    if (s === t) {
      throw new Error(`Source of ${s} can't equal sink of ${t}.`)
    }

    let maxflow = FordFulkerson.getExcess(graph, t)

    const edgeTo = new Map<NodeId, ResidualEdge>()
    const marked = new Set<NodeId>()
    while (FordFulkerson.hasAugmentingPath(graph, s, t, { edgeTo, marked })) {
      const bottlenick = FordFulkerson.getBottlenick(s, t, edgeTo)

      maxflow = FordFulkerson.augmentFlow(s, t, edgeTo, bottlenick, maxflow)
    }

    this.mincut = Array.from(marked)
    this.maxflow = maxflow
  }

  private static augmentFlow (
    s: NodeId,
    t: NodeId,
    edgeTo: Map<NodeId, ResidualEdge>,
    bottlenick: Flow,
    maxflow: Flow
  ): Flow {
    for (
      let id = t;
      id !== s;
      id = FordFulkerson.getGuaranteedEdge(edgeTo, id).other(id)
    ) {
      FordFulkerson.getGuaranteedEdge(edgeTo, id).addResidualFlowTo(
        id,
        bottlenick
      )
    }

    return bottlenick + maxflow
  }

  private static getBottlenick (
    s: NodeId,
    t: NodeId,
    edgeTo: Map<NodeId, ResidualEdge>
  ): Flow {
    let bottlenick = Number.MAX_SAFE_INTEGER

    for (
      let id = t;
      id !== s;
      id = FordFulkerson.getGuaranteedEdge(edgeTo, id).other(id)
    ) {
      bottlenick = Math.min(
        bottlenick,
        FordFulkerson.getGuaranteedEdge(edgeTo, id).residualCapacityTo(id)
      )
    }

    return bottlenick
  }

  private static getExcess (graph: ResidualGraph, id: NodeId): Flow {
    let excess = 0

    for (const edge of graph.adjacencyList(id)) {
      const { from, flow } = edge

      if (id === from) {
        excess -= flow
      } else {
        excess += flow
      }
    }

    return excess
  }

  private static getGuaranteedEdge (
    edgeTo: Map<NodeId, ResidualEdge>,
    id: NodeId
  ): ResidualEdge {
    return edgeTo.get(id) as ResidualEdge
  }

  private static hasAugmentingPath (
    graph: ResidualGraph,
    s: NodeId,
    t: NodeId,
    state: State
  ) {
    const { edgeTo, marked } = state

    edgeTo.clear()
    marked.clear()

    const queue = new Array()
    queue.push(s)

    while (queue.length !== 0 && !marked.has(t)) {
      const nodeId = queue.shift()

      for (const edge of graph.adjacencyList(nodeId)) {
        const other = edge.other(nodeId)

        if (!marked.has(other) && edge.residualCapacityTo(other) > 0) {
          edgeTo.set(other, edge)
          marked.add(other)
          queue.push(other)
        }
      }
    }

    return marked.has(t)
  }
}
