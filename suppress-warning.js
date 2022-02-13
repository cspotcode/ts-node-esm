// Not shown here: Additional logic to correctly interact with process's events, either using this direct manipulation, or via the API
const warningEvent = process._events.warning;
// TODO validate that this looks like node's built-in warning handler
// TODO validate that this is not undefined, which might be caused by `--no-warnings`
const messageMatch = /--(?:experimental-)?loader\b/;
process._events.warning = function(warning, ...rest) {
  if(warning.name === 'ExperimentalWarning' && messageMatch.test(warning.message)) return;
  return warningEvent.call(this, warning, ...rest);
}