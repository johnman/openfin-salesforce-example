(function (host) {
  if (host !== host.top) {
    return;
  }
  console.log("Loading OpenFin preload api");
  const salesforcefin = host.fin;

  function sendApi(e) {
    let wrappedApi = new CustomEvent("openfin-api-response", {
      bubbles: true,
      detail: {
        fin: [salesforcefin]
      }
    });
    host.dispatchEvent(wrappedApi);
  }

  function setupApi() {
    console.log("Listening for api requests.");
    host.addEventListener("openfin-api-request", sendApi.bind(this));
  }

  function setupUnsubscribe() {
    host.addEventListener("beforeunload", function (event) {
      console.log("Unsubscribing from API request listener");
      host.removeEventListener("openfin-api-request", sendApi);
    });
  }

  function init() {
    salesforcefin.desktop.main(() => {
      setupApi();
      setupUnsubscribe();
      console.log("Finished loading OpenFin preload api");
    });
  }

  init();
})(window);
