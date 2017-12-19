var breakDebuggerButton = document.getElementById('break-debugger');
breakDebuggerButton.addEventListener('click', function onClick(event) {
  debugger;
});

var breakManuallyButton = document.getElementById('break-manually');
breakManuallyButton.addEventListener('click', function onClick(event) {
  console.log('Place a breakpoint here.');
});

var breakOnErrorButton = document.getElementById('break-on-error');
breakOnErrorButton.addEventListener('click', function onClick(event) {
  throw 'You are not allowed to click this.';
});
