import {
  prepend,
  sortBy,
  compose,
  toLower,
  prop,
  map,
  merge,
  pipe,
  pick,
  path,
  isNil
} from 'ramda'

function mapAttributes (dataIn, obj) {
  var mapAttrs = pipe(map(x => merge(x.attributes, pick(['id'], x))))
  return mapAttrs(isNil(obj) ? dataIn.data : dataIn)
}

function getAttributes (dataIn) {
  var mapAttrs = pipe(
    map(x => merge(x.attributes, pick(['id'], x))),
    path(['data'])
  )
  return mapAttrs(dataIn)
}

function updateMulti (singleIn, multiIn) {
  // If the key matches, return whats in Single Object,
  // Otherwise, return whats in multi
  return map(x => (x.id === singleIn.id ? singleIn : x), multiIn)
}

function insertMulti (singleIn, multiIn) {
  var newList = pipe(prepend(singleIn), sortBy(compose(toLower, prop('name'))))
  return newList(multiIn)
}

export { getAttributes, mapAttributes, updateMulti, insertMulti }
