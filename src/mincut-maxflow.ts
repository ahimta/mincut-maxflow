type Flow = number
type NodeId = string

interface IFlowEdge {
  readonly from: NodeId
  readonly to: NodeId

  readonly capacity: Flow
  flow: Flow
}

interface IResidualEdge extends IFlowEdge {
  addResidualFlowTo(id: NodeId, delta: Flow): void
  other(id: NodeId): NodeId
  residualCapacityTo(id: NodeId): Flow
}

interface IFlowGraph {
  readonly nodes: ReadonlyArray<NodeId>
  readonly edges: ReadonlyArray<IFlowEdge>
}

interface IResidualGraph {
  readonly nodes: ReadonlyArray<NodeId>
  readonly edges: ReadonlyArray<IResidualEdge>
  readonly adjacencyMatrix: Map<NodeId, Array<IResidualEdge>>
}

interface IMincutMaxflow {
  readonly mincut: IFlowGraph
  readonly maxflow: Flow
}

export default function (graph: IFlowGraph): IMincutMaxflow {
  const residualGraph = flowGraphToResidualGraph(graph)
  return residualGraphToMincutMaxFlow(residualGraph)
}

class ResidualEdge implements IResidualEdge {
  public readonly from: NodeId
  public readonly to: NodeId

  public readonly capacity: Flow
  public flow: Flow

  constructor (from: NodeId, to: NodeId, capacity: Flow, flow: Flow) {
    if (from.length === 0) {
      throw Error(`Invalid from of ${from}.`)
    }

    if (to.length === 0) {
      throw Error(`Invalid from of ${from}.`)
    }

    if (capacity < 0 || !ResidualEdge.isFlow(capacity)) {
      throw Error(`Invalid capacity of ${capacity}.`)
    }

    if (flow < 0 || !ResidualEdge.isFlow(flow)) {
      throw Error(`Invalid flow of ${flow}.`)
    }

    this.from = from
    this.to = to

    this.capacity = capacity
    this.flow = flow
  }

  addResidualFlowTo (id: NodeId, delta: Flow): void {
    const { from, flow, capacity } = this

    this.ensureValidNodeId(id)

    if (!(delta >= 0 && ResidualEdge.isFlow(delta))) {
      throw new Error(`Invalid delta of ${delta}.`)
    }

    const newFlow = id === from ? flow - delta : flow + delta

    if (newFlow < 0) {
      throw Error(`Invalid negative flow of ${newFlow}.`)
    }

    if (newFlow > capacity) {
      throw Error(`Invalid flow of ${newFlow} when capacity is ${capacity}.`)
    }

    this.flow = newFlow
  }

  other (id: NodeId): NodeId {
    const { from, to } = this

    this.ensureValidNodeId(id)

    if (id === from) {
      return to
    } else {
      return from
    }
  }

  residualCapacityTo (id: NodeId): Flow {
    const { from, capacity, flow } = this

    this.ensureValidNodeId(id)

    if (id === from) {
      return flow
    } else {
      return capacity - flow
    }
  }

  private ensureValidNodeId (id: NodeId): void {
    const { from, to } = this

    if (!(id === from || id === to)) {
      throw new Error(`Invalid node ID of ${id}.`)
    }
  }

  private static isFlow (x: Flow) {
    return x === 0 || (x && x > 0 && x === Math.round(x))
  }
}

// @todo
function flowGraphToResidualGraph (_graph: IFlowGraph): IResidualGraph {
  return {
    nodes: [],
    edges: [],
    adjacencyMatrix: new Map([['x', [new ResidualEdge('x', 'y', 10, 9)]]])
  }
}

// @todo
function residualGraphToMincutMaxFlow (_graph: IResidualGraph): IMincutMaxflow {
  return {
    mincut: { nodes: [], edges: [] },
    maxflow: 0
  }
}
