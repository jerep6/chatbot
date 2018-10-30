
module.exports = class IntentDecider {

  constructor() {
    this.DialogCodeHook = {};
    this.FulfillmentCodeHook = {};
  }

  addDialogCodeHook(intentName, callback) {
    this.DialogCodeHook[intentName] = callback;
  }

  addFulfillmentCodeHook(intentName, callback) {
    this.FulfillmentCodeHook[intentName] = callback;
  }

  async handleRequest(event) {
    const source = event.invocationSource;
    const intentName = event.currentIntent.name;

    switch(source) {
      case 'DialogCodeHook':
        const intentFunction = this.DialogCodeHook[intentName];
        if(intentFunction) {
          return await intentFunction(event);
        }
        return null;

      case 'FulfillmentCodeHook':
        const fulfilmentFunction = this.FulfillmentCodeHook[intentName];
        if(fulfilmentFunction) {
          return await fulfilmentFunction(event);
        }
        return null;
    }

  }

}