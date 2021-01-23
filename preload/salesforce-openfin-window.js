// This script will set a salesforce window to have no frame and will add drag support to the salesforce
// header
(function (host) {
  if (host !== host.top) {
    return;
  }
  console.log("Loading OpenFin preload Window Support");
  const salesforcefin = host.fin;

  function setupStyles() {
    salesforcefin.Window.getCurrentSync().updateOptions({ frame: false });

    host.addEventListener("DOMContentLoaded", function () {
      let styleOverrides = host.document.createElement("style");

      styleOverrides.innerHTML =
        host.location.pathname === "/"
          ? `
        /* OpenFin - Login Window Style Overrides */

        #content {
          -webkit-app-region: no-drag;
        }

        #left {
          -webkit-app-region: drag;
        }
        `
          : !host.location.search.includes("windowed=true")
          ? `
        /* OpenFin - Main Window Style Overrides */

        .slds-global-header__logo {
          -webkit-app-region: drag;
        }
        `
          : `
        /* OpenFin - Popout Window Style Overrides */

        .slds-col--bump-left {
          -webkit-app-region: no-drag;
        }

        .slds-utility-panel__header {
          -webkit-app-region: drag;
        }
        `;

      host.document.head.appendChild(styleOverrides);
    });
    console.log("Finished loading OpenFin preload Window Support");
  }

  setupStyles();
})(window);
