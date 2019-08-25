debugger;
document.addEventListener("DOMContentLoaded", () => {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(
    {
      newTab: true
    },
    function(items) {
      document.querySelector("input").checked = items.newTab;
    }
  );
});

let cb = document.querySelector("input");
let stat = document.querySelector("p");
cb.addEventListener("change", () => {
  chrome.storage.sync.set(
    {
      newTab: cb.checked
    },
    function() {
      // Update status to let user know options were saved.
      stat.innerText = "Saved!";
      setTimeout(() => {
        stat.innerText = "";
      }, 500);
    }
  );
});
