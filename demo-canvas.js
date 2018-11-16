const IntentDecider = require("./IntentDecider")

const decider = new IntentDecider();

exports.handler = async function (event, context) {
  console.log('Event', JSON.stringify(event));

  return decider.handleRequest(event);
};

// #############################################################################
// # Utilities
// #############################################################################
function elicitSlot(intentName, slots, slotToElicit, message) {
  return {
    sessionAttributes: {},
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
    },
  };
}

function delegate(slots) {
  return {
    sessionAttributes: {},
    dialogAction: {
      type: 'Delegate',
      slots,
    }
  };
}


function chooseRestaurant(time, restaurantType) {
  if(!time) {
    return "Missing parameter 'Time'";
  }

  if(!restaurantType) {
    return "Missing parameter 'RestaurantType'";
  }

  const resto = ["Chez Joe", "Chez Mario", "Tante Micheline"];
  return resto[Math.floor(Math.random() * resto.length)];
}