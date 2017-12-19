var breakDebuggerButton = document.getElementById('log-element');
breakDebuggerButton.addEventListener('click', function onClick(event) {
  console.log(event, breakDebuggerButton);
  console.dir(breakDebuggerButton);
});

var breakManuallyButton = document.getElementById('log-time');
breakManuallyButton.addEventListener('click', function onClick(event) {
  var msg = 'getBoundingClientRect().height';
  console.time(msg);
  breakManuallyButton.getBoundingClientRect().height;
  console.timeEnd(msg)
});
