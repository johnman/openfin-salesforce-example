import Logger from "./logger.js";

export async function init() {
  const listenToMessagesButton = document.getElementById("listenToMessages");
  const clearMessagesButton = document.getElementById("clearMessages");
  const sendMessageButton = document.getElementById("sendMessage");
  const messageToSend = document.getElementById("messageToSend");
  const receivedMessageDisplay = document.getElementById(
    "receivedMessageDisplay"
  );
  const receivedMessage = document.getElementById("receivedMessage");

  const uuid = window.fin.me.identity.uuid;
  const salesForceAppId = "SalesForceGuide001";
  const outboxTopic = "/openfin/salesforce/outbox/" + salesForceAppId;
  const inboxTopic = "/openfin/salesforce/inbox/" + salesForceAppId;
  const internalOutboxTopic = "/openfin/salesforce/outbox/" + uuid;
  const internalInboxTopic = "/openfin/salesforce/inbox/" + uuid;
  const salesForceAppReceivedMessages = new Logger("SF APP", receivedMessage);
  let salesForceContent;

  if (window.fin.me.isView) {
    salesForceContent = new Logger("SF Platform Content", receivedMessage);
  } else {
    salesForceContent = new Logger("SF Window Content", receivedMessage);
  }

  clearMessagesButton.onclick = () => {
    salesForceAppReceivedMessages.clear();
    salesForceContent.clear();
  };

  listenToMessagesButton.onclick = () => {
    receivedMessageDisplay.style.display = "block";

    window.fin.InterApplicationBus.subscribe(
      { uuid: salesForceAppId },
      outboxTopic,
      (message) => {
        console.log("Message recevieved on topic: " + outboxTopic);
        salesForceAppReceivedMessages.log(
          JSON.stringify(message, undefined, 4)
        );
      }
    )
      .then(() => console.info(`Subscribed to ${outboxTopic}`))
      .catch((err) =>
        console.error(`Error subscribing to ${outboxTopic}`, err)
      );

    window.fin.InterApplicationBus.subscribe(
      { uuid },
      internalOutboxTopic,
      (message) => {
        console.log("Message recevieved on topic: " + internalOutboxTopic);
        salesForceContent.log(JSON.stringify(message, undefined, 4));
      }
    )
      .then(() => console.info(`Subscribed to ${internalOutboxTopic}`))
      .catch((err) =>
        console.error(`Error subscribing to ${internalOutboxTopic}`, err)
      );

    listenToMessagesButton.disabled = true;
  };

  sendMessageButton.onclick = () => {
    window.fin.InterApplicationBus.send(
      { uuid: salesForceAppId },
      inboxTopic,
      messageToSend.value
    ).catch((reason) => {
      console.error(
        `Unable to publish message to application: ${salesForceAppId} on topic: ${inboxTopic}. Reason: ${reason}`
      );
    });
    window.fin.InterApplicationBus.send(
      { uuid },
      internalInboxTopic,
      messageToSend.value
    ).catch((reason) => {
      console.error(
        `Unable to publish message to application: ${uuid} on topic: ${internalInboxTopic}. Reason: ${reason}`
      );
    });
  };
}
