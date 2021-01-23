import { init as setupMessaging } from "./listenAndSend.js";
import { init as setupSalesForceLauncher } from "./open.js";

document.addEventListener("DOMContentLoaded", async () => {
  await setupMessaging();
  await setupSalesForceLauncher();
});
