const logElementButton = document.getElementById('log-element');
logElementButton.addEventListener('click', (event) => {
  console.log(event, logElementButton);
  console.dir(logElementButton);
});

const logTimeButton = document.getElementById('log-time');
logTimeButton.addEventListener('click', (event) => {
  const msg = 'getBoundingClientRect().height';
  console.time(msg);
  logTimeButton.getBoundingClientRect().height;
  console.timeEnd(msg)
});
