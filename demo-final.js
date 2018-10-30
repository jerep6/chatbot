const IntentDecider = require("./IntentDecider")

const decider = new IntentDecider();
decider.addDialogCodeHook("BookRestaurant", validateBookingIntent);
decider.addFulfillmentCodeHook("BookRestaurant", bookingRestaurantFulfilment);

decider.addFulfillmentCodeHook("AnotherRestaurant_fallback", anotherRestaurant);

exports.handler = async function (event, context) {
  console.log('Event', JSON.stringify(event));

  return decider.handleRequest(event);
};

// #############################################################################
// # BookRestaurant
// #############################################################################
async function validateBookingIntent(event) {
  const time = event.currentIntent.slots.Time;

  if(time && (time < "12:00" || time > "14:00")) {
    return elicitSlot(event.sessionAttributes, event.currentIntent.name, event.currentIntent.slots, "Time", "Reservation must be between 12AM and 2PM");
  }

  console.log('All slots are valid');
  return delegate(event.sessionAttributes, event.currentIntent.slots);
}


async function bookingRestaurantFulfilment(event) {
  console.log('fulfilment');

  const time = event.currentIntent.slots.Time;
  const deliveryMode = event.currentIntent.slots.DeliveryMode;

  const resto = chooseRestaurant(time, deliveryMode);
  event.sessionAttributes['Time'] = time;
  event.sessionAttributes['restaurant_name'] = chooseRestaurant(time, deliveryMode);

  return close(event.sessionAttributes, "Your restaurant is "+ resto);
}


// #############################################################################
// # AnotherBooking
// #############################################################################
async function anotherRestaurant(event) {

  const time = event.sessionAttributes['Time'];
  const deliveryMode = event.sessionAttributes['DeliveryMode'];
  console.log('---------------------------', time, deliveryMode);
  const resto = chooseRestaurant(time, deliveryMode);

  return close(event.sessionAttributes, "Your new restaurant is "+ resto);
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