const IntentDecider = require("./IntentDecider")

const decider = new IntentDecider();
decider.addDialogCodeHook("ChooseRestaurant_demo", validate);
decider.addFulfillmentCodeHook("ChooseRestaurant_demo", fulfill);
decider.addFulfillmentCodeHook("AnotherRestaurant", another);

exports.handler = async function (event, context) {
  console.log('Event', JSON.stringify(event));

  return decider.handleRequest(event);
};

// #############################################################################
// # BookRestaurant
// #############################################################################
async function fulfill(event) {
  const slots = event.currentIntent.slots;
  const time = slots.Time;
  const type = slots.RestaurantType;

  const resto = chooseRestaurant(time, type);

  return close({Time: time, RestaurantType: type}, "Your restaurant is " + resto);
}

async function validate(event) {
  const slots = event.currentIntent.slots;
  const time = slots.Time;

  if(time && (time < "12:00" || time > "14:00")) {
    return elicitSlot(event.currentIntent.name, event.currentIntent.slots, "Time", "Time must be between 12 and 14");
  }

  return delegate(slots);
}


// #############################################################################
// # AnotherRestaurant
// #############################################################################
async function another(event) {
  const slots = event.sessionAttributes;
  const time = slots.Time;
  const type = slots.RestaurantType;

  const resto = chooseRestaurant(time, type);

  return close(slots, "Your NEW restaurant is " + resto);
}


// #############################################################################
// # Utilities
// #############################################################################
function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'ElicitSlot',
      intentName,
      slots,
      slotToElicit,
      message: { contentType: 'PlainText', content: message },
    },
  };
}

function close(sessionAttributes, message) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Close',
      "fulfillmentState": "Fulfilled",
      message: { contentType: 'PlainText', content: message },
    }
  };
}

function delegate(sessionAttributes, slots) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Delegate',
      slots,
    }
  };
}


function chooseRestaurant(time, deliveryMode) {
  const resto = ["Chez Joe", "Chez Mario", "Tante Micheline"];

  return resto[Math.floor(Math.random() * resto.length)];
}