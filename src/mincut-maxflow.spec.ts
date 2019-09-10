import test from 'ava'

test('*_^', t => {
  require('./mincut-maxflow')
  t.pass()
})
