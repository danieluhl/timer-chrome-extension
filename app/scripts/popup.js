document.querySelector('.timerButton').addEventListener('click', addTimer);
function addTimer() {
  browser.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .then(tabs => {
      browser.tabs
        .sendMessage(tabs[0].id, {
          timerMessage: `create`,
        })
        .then(response => {
          console.log({response});
        })
        .catch(({message}) => console.error('error', message));
    });
}
