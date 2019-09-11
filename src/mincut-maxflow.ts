import { Flow, IFlowGraph, IMincutMaxflow, NodeId } from './types'
import ResidualEdge from './residual-edge'
import ResidualGraph from './residual-graph'

interface State {
  readonly edgeTo: Map<NodeId, ResidualEdge>
  readonly marked: Set<NodeId>
}

export default function mincutMaxflow (
  inputGraph: IFlowGraph,
  s: NodeId,
  t: NodeId
): IMincutMaxflow {
  const graph = new ResidualGraph(inputGraph.nodes, inputGraph.edges)

  if (!(graph.exists(s) && graph.exists(t))) {
    throw new Error(`Invalid source or sink of (${s}, ${t}).`)
  }

  if (s === t) {
    throw new Error(`Source of ${s} can't equal sink of ${t}.`)
  }

  let maxflow = getExcess(graph, t)

  const edgeTo = new Map<NodeId, ResidualEdge>()
  const marked = new Set<NodeId>()

  while (hasAugmentingPath(graph, s, t, { edgeTo, marked })) {
    const bottlenick = getBottlenick(s, t, edgeTo)

    maxflow = augmentFlow(s, t, edgeTo, bottlenick, maxflow)
  }

  return {
    mincut: Array.from(marked),
    maxflow
  }
}

function augmentFlow (
  s: NodeId,
  t: NodeId,
  edgeTo: Map<NodeId, ResidualEdge>,
  bottlenick: Flow,
  maxflow: Flow
): Flow {
  for (let id = t; id !== s; id = getGuaranteedEdge(edgeTo, id).other(id)) {
    getGuaranteedEdge(edgeTo, id).addResidualFlowTo(id, bottlenick)
  }

  return bottlenick + maxflow
}

function getBottlenick (
  s: NodeId,
  t: NodeId,
  edgeTo: Map<NodeId, ResidualEdge>
): Flow {
  let bottlenick = Number.MAX_SAFE_INTEGER

  for (let id = t; id !== s; id = getGuaranteedEdge(edgeTo, id).other(id)) {
    const residual = getGuaranteedEdge(edgeTo, id).residualCapacityTo(id)

    bottlenick = Math.min(bottlenick, residual)
  }

  return bottlenick
}

function getExcess (graph: ResidualGraph, id: NodeId): Flow {
  let excess = 0

  for (const edge of graph.edges(id)) {
    const { from, flow } = edge

    if (id === from) {
      excess -= flow
    } else {
      excess += flow
    }
  }

  return excess
}

function getGuaranteedEdge (
  edgeTo: Map<NodeId, ResidualEdge>,
  id: NodeId
): ResidualEdge {
  return edgeTo.get(id) as ResidualEdge
}

function hasAugmentingPath (
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

    for (const edge of graph.edges(nodeId)) {
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
