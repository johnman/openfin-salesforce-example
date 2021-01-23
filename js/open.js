import { getRoot } from "./host.js";

export async function init() {
  const launchAppButton = document.getElementById("openSalesForceApp");
  const launchWindowButton = document.getElementById("openSalesForceWindow");
  const launchViewButton = document.getElementById("openSalesForceView");
  const root = getRoot();
  const salesForceAppManifestUrl = root + "/config/salesforce.openfin.json";
  const url = "https://johnm-dev-ed.lightning.force.com/lightning/page/home";
  const name = "salesforce";
  const preloadScripts = [
    {
      url: root + "/preload/salesforce-openfin-api.js"
    },
    {
      url: root + "/preload/salesforce-openfin-iab.js"
    }
  ];

  if (window.fin.me.isView) {
    const platform = window.fin.Platform.getCurrentSync();

    launchViewButton.style.display = "initial";
    launchViewButton.onclick = async () => {
      let windowIdentity = (await window.fin.me.getCurrentWindow()).identity;

      platform
        .createView(
          {
            name: name + "-view",
            url,
            preloadScripts
          },
          windowIdentity
        )
        .then(console.log)
        .catch((err) => console.log(err));
    };

    launchWindowButton.onclick = async () => {
      platform
        .createView({
          name,
          url,
          preloadScripts
        })
        .then(console.log)
        .catch((err) => console.log(err));
    };
  } else {
    launchWindowButton.onclick = async () => {
      const winOption = {
        name,
        url,
        preloadScripts,
        defaultWidth: 800,
        defaultHeight: 800,
        frame: true,
        autoShow: true
      };

      window.fin.Window.create(winOption)
        .then(() => console.log("Window is created"))
        .catch((err) => console.log(err));
    };
  }

  launchAppButton.onclick = () => {
    window.fin.Application.startFromManifest(salesForceAppManifestUrl)
      .then((app) => console.log("App is running"))
      .catch((err) => console.log(err));
  };
}
