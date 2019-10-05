import { Flow, NodeId } from './types'

export default class ResidualEdge {
  readonly from: NodeId
  readonly to: NodeId

  readonly capacity: Flow
  flow: Flow

  constructor (from: NodeId, to: NodeId, capacity: Flow) {
    if (from.length === 0) {
      throw Error(`Invalid from of ${from}.`)
    }

    if (to.length === 0) {
      throw Error(`Invalid from of ${from}.`)
    }

    if (capacity < 0 || !ResidualEdge.isFlow(capacity)) {
      throw Error(`Invalid capacity of ${capacity}.`)
    }

    this.from = from
    this.to = to

    this.capacity = capacity
    this.flow = 0
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

  private static isFlow (x: Flow) {
    return x === 0 || (x && x > 0 && x === Math.round(x))
  }

  private ensureValidNodeId (id: NodeId): void {
    const { from, to } = this

    if (!(id === from || id === to)) {
      throw new Error(`Invalid node ID of ${id}.`)
    }
  }
}
