import test from 'ava'
import { IFlowGraph, IMincutMaxflow, NodeId } from './types'
import mincutMaxflow from './mincut-maxflow'

interface IExample {
  readonly graph: IFlowGraph
  readonly source: NodeId
  readonly sink: NodeId

  readonly mincutMaxflow: IMincutMaxflow
}

const examples: ReadonlyArray<IExample> = [
  {
    graph: {
      nodes: ['s', '1', '2', '3', '4', '5', '6', 't'],
      edges: [
        { from: 's', to: '1', capacity: 10 },
        { from: 's', to: '2', capacity: 5 },
        { from: 's', to: '3', capacity: 15 },

        { from: '1', to: '2', capacity: 4 },
        { from: '1', to: '4', capacity: 9 },
        { from: '1', to: '5', capacity: 15 },

        { from: '2', to: '3', capacity: 4 },
        { from: '2', to: '5', capacity: 8 },

        { from: '3', to: '6', capacity: 16 },

        { from: '4', to: '5', capacity: 15 },
        { from: '4', to: 't', capacity: 10 },

        { from: '5', to: '6', capacity: 15 },
        { from: '5', to: 't', capacity: 10 },

        { from: '6', to: '2', capacity: 6 },
        { from: '6', to: 't', capacity: 10 }
      ]
    },
    source: 's',
    sink: 't',

    mincutMaxflow: {
      mincut: ['2', '3', '6', 's'],
      maxflow: 28,
      isSourceFull: false
    }
  },
  {
    graph: {
      nodes: ['s', '1', '2', '3', '4', 't'],
      edges: [
        { from: 's', to: '1', capacity: 10 },
        { from: 's', to: '2', capacity: 5 },

        { from: '1', to: '3', capacity: 9 },
        { from: '1', to: '4', capacity: 4 },

        { from: '2', to: '1', capacity: 4 },
        { from: '2', to: '4', capacity: 8 },

        { from: '3', to: '4', capacity: 15 },
        { from: '3', to: 't', capacity: 10 },

        { from: '4', to: 't', capacity: 10 }
      ]
    },
    source: 's',
    sink: 't',

    mincutMaxflow: {
      mincut: ['s'],
      maxflow: 15,
      isSourceFull: true
    }
  },
  {
    graph: {
      nodes: [
        's',

        'alice',
        'bob',
        'carol',
        'dave',
        'eliza',

        'adobe',
        'amazon',
        'facebook',
        'google',
        'yahoo',

        't'
      ],
      edges: [
        { from: 's', to: 'alice', capacity: 1 },
        { from: 's', to: 'bob', capacity: 1 },
        { from: 's', to: 'carol', capacity: 1 },
        { from: 's', to: 'dave', capacity: 1 },
        { from: 's', to: 'eliza', capacity: 1 },

        { from: 'alice', to: 'adobe', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'alice', to: 'amazon', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'alice', to: 'google', capacity: Number.MAX_SAFE_INTEGER },

        { from: 'bob', to: 'adobe', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'bob', to: 'amazon', capacity: Number.MAX_SAFE_INTEGER },

        { from: 'carol', to: 'adobe', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'carol', to: 'facebook', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'carol', to: 'google', capacity: Number.MAX_SAFE_INTEGER },

        { from: 'dave', to: 'amazon', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'dave', to: 'yahoo', capacity: Number.MAX_SAFE_INTEGER },

        { from: 'eliza', to: 'amazon', capacity: Number.MAX_SAFE_INTEGER },
        { from: 'eliza', to: 'yahoo', capacity: Number.MAX_SAFE_INTEGER },

        { from: 'adobe', to: 't', capacity: 1 },
        { from: 'amazon', to: 't', capacity: 1 },
        { from: 'facebook', to: 't', capacity: 1 },
        { from: 'google', to: 't', capacity: 1 },
        { from: 'yahoo', to: 't', capacity: 1 }
      ]
    },
    source: 's',
    sink: 't',

    mincutMaxflow: {
      mincut: ['s'],
      maxflow: 5,
      isSourceFull: true
    }
  },
  {
    graph: {
      nodes: ['s', '1', '2', 't'],
      edges: [
        { from: 's', to: '1', capacity: 100 },
        { from: 's', to: '2', capacity: 100 },

        { from: '1', to: '2', capacity: 1 },
        { from: '1', to: 't', capacity: 100 },

        { from: '2', to: 't', capacity: 100 }
      ]
    },
    source: 's',
    sink: 't',

    mincutMaxflow: {
      mincut: ['s'],
      maxflow: 200,
      isSourceFull: true
    }
  }
]

examples.forEach(({ graph, source, sink, mincutMaxflow: mm }, i) => {
  test(`${i}`, t => {
    t.deepEqual(mincutMaxflow(graph, source, sink), mm)
  })
})
