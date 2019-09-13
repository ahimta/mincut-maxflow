import test from 'ava'
import { IFlowGraph, IMincutMaxflow, NodeId } from './types'
import mincutMaxflow from './mincut-maxflow'

interface IExample {
  readonly graph: IFlowGraph
  readonly source: NodeId
  readonly sink: NodeId

  readonly mincutMaxflow: IMincutMaxflow
}

// const INFINITY = Number.MAX_SAFE_INTEGER

const examples: ReadonlyArray<IExample> = [
  {
    graph: {
      nodes: ['s', '1', '2', '3', '4', '5', '6', 't'],
      edges: [
        { from: 's', to: '1', capacity: 10, flow: 10 },
        { from: 's', to: '2', capacity: 5, flow: 5 },
        { from: 's', to: '3', capacity: 15, flow: 10 },

        { from: '1', to: '2', capacity: 4, flow: 0 },
        { from: '1', to: '4', capacity: 9, flow: 5 },
        { from: '1', to: '5', capacity: 15, flow: 5 },

        { from: '2', to: '3', capacity: 4, flow: 0 },
        { from: '2', to: '5', capacity: 8, flow: 5 },

        { from: '3', to: '6', capacity: 16, flow: 10 },

        { from: '4', to: '5', capacity: 15, flow: 0 },
        { from: '4', to: 't', capacity: 10, flow: 5 },

        { from: '5', to: '6', capacity: 15, flow: 0 },
        { from: '5', to: 't', capacity: 10, flow: 10 },

        { from: '6', to: '2', capacity: 6, flow: 0 },
        { from: '6', to: 't', capacity: 10, flow: 10 }
      ]
    },
    source: 's',
    sink: 't',

    mincutMaxflow: {
      // @hack: set elements are order in a way that makes tests pass.
      mincut: new Set(['3', 's', '6', '2']),
      maxflow: 28
    }
  },
  // @note: possibly non-solvable
  // {
  //   graph: {
  //     nodes: ['s', '1', '2', '3', '4', 't'],
  //     edges: [
  //       { from: 's', to: '1', capacity: 10, flow: 9 },
  //       { from: 's', to: '2', capacity: 5, flow: 4 },

  //       { from: '1', to: '3', capacity: 9, flow: 9 },
  //       { from: '1', to: '4', capacity: 4, flow: 4 },

  //       { from: '2', to: '1', capacity: 4, flow: 4 },
  //       { from: '2', to: '4', capacity: 8, flow: 0 },

  //       { from: '3', to: '4', capacity: 15, flow: 0 },
  //       { from: '3', to: 't', capacity: 10, flow: 9 },

  //       { from: '4', to: 't', capacity: 10, flow: 4 }
  //     ]
  //   },
  //   source: 's',
  //   sink: 't',

  //   mincutMaxflow: {
  //     mincut: new Set(),
  //     maxflow: 9999
  //   }
  // },
  // @note: possibly non-solvable
  // {
  //   graph: {
  //     nodes: [
  //       's',

  //       'alice',
  //       'bob',
  //       'carol',
  //       'dave',
  //       'eliza',
  //       'adobe',
  //       'amazon',
  //       'facebook',
  //       'google',
  //       'yahoo',

  //       't'
  //     ],
  //     edges: [
  //       { from: 's', to: 'alice', capacity: 1, flow: 0 },
  //       { from: 's', to: 'bob', capacity: 1, flow: 0 },
  //       { from: 's', to: 'carol', capacity: 1, flow: 0 },
  //       { from: 's', to: 'dave', capacity: 1, flow: 0 },
  //       { from: 's', to: 'eliza', capacity: 1, flow: 0 },

  //       { from: 'alice', to: 'adobe', capacity: INFINITY, flow: 0 },
  //       { from: 'alice', to: 'amazon', capacity: INFINITY, flow: 0 },
  //       { from: 'alice', to: 'google', capacity: INFINITY, flow: 0 },

  //       { from: 'bob', to: 'adobe', capacity: INFINITY, flow: 0 },
  //       { from: 'bob', to: 'amazon', capacity: INFINITY, flow: 0 },

  //       { from: 'carol', to: 'adobe', capacity: INFINITY, flow: 0 },
  //       { from: 'carol', to: 'facebook', capacity: INFINITY, flow: 0 },
  //       { from: 'carol', to: 'google', capacity: INFINITY, flow: 0 },

  //       { from: 'dave', to: 'amazon', capacity: INFINITY, flow: 0 },
  //       { from: 'dave', to: 'yahoo', capacity: INFINITY, flow: 0 },

  //       { from: 'eliza', to: 'amazon', capacity: INFINITY, flow: 0 },
  //       { from: 'eliza', to: 'yahoo', capacity: INFINITY, flow: 0 },

  //       { from: 'adobe', to: 't', capacity: 1, flow: 0 },
  //       { from: 'amazon', to: 't', capacity: 1, flow: 0 },
  //       { from: 'facebook', to: 't', capacity: 1, flow: 0 },
  //       { from: 'google', to: 't', capacity: 1, flow: 0 },
  //       { from: 'yahoo', to: 't', capacity: 1, flow: 0 },
  //     ]
  //   },
  //   source: 's',
  //   sink: 't',

  //   mincutMaxflow: {
  //     mincut: new Set(),
  //     maxflow: 9999
  //   }
  // }
]

const derivedExamples = flatMap(examples, ({ graph, source, sink, mincutMaxflow: mm }) => {
  return [
    { graph, source, sink, mincutMaxflow: mm },
    {
      mincutMaxflow: mm,

      source,
      sink,
      graph: {
        nodes: graph.nodes,
        edges: graph.edges.map(({ from, to, capacity }) => ({
          from,
          to,

          capacity,
          flow: 0
        }))
      }
    }
  ]
})

derivedExamples.forEach(({ graph, source, sink, mincutMaxflow: mm }, i) => {
  test(`${i}`, t => {
    t.deepEqual(mincutMaxflow(graph, source, sink), mm)
  })
})

function flatMap (xs, mapper) {
  return Array.prototype.concat.apply([], xs.map(mapper))
}
