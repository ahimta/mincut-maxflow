import { IFlowGraph, IMincutMaxflow, IResidualGraph } from './types'

import ResidualGraph from './residual-graph'

export default function (graph: IFlowGraph): IMincutMaxflow {
  const residualGraph = flowGraphToResidualGraph(graph)
  return residualGraphToMincutMaxFlow(residualGraph)
}

// @todo
function flowGraphToResidualGraph (_graph: IFlowGraph): IResidualGraph {
  return new ResidualGraph([], [])
}

// @todo
function residualGraphToMincutMaxFlow (_graph: IResidualGraph): IMincutMaxflow {
  return {
    mincut: [],
    maxflow: 0
  }
}
