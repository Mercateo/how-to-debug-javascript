var logElementButton = document.getElementById('log-element');
logElementButton.addEventListener('click', function onClick(event) {
  console.log(event, logElementButton);
  console.dir(logElementButton);
});

var logTimeButton = document.getElementById('log-time');
logTimeButton.addEventListener('click', function onClick(event) {
  var msg = 'getBoundingClientRect().height';
  console.time(msg);
  logTimeButton.getBoundingClientRect().height;
  console.timeEnd(msg)
});
