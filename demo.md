

Création du bot "Restaurant" dans l'IHM

## Intent BookingRestaurant_demo
1. Création de l'intent "BookingRestaurant_demo"  
2. Explication des utterances et ajout de deux phrases
   * I'm starving 
   * eat
   
3. Explication des slots
   * Time
   * DeliveryMode

4. Ajout d'une utterance {Time} 
   * I want eat at ​{Time}​ and it will be ​{DeliveryMode}​

5. **BUILD**

6. Test du chatbot

7. Activation de la Lambda initialization and validation
  
8. **BUILD**

9. Coder la lambda 
    ```javascript
      decider.addDialogCodeHook("BookingRestaurant_demo", validatebooking);
    
      async function validateBookingIntent(event) {
        const time = event.currentIntent.slots.Time;
    
        if(time && (time < "12:00" || time > "14:00")) {
          return elicitSlot(event.sessionAttributes, event.currentIntent.name, event.currentIntent.slots, "Time", "Book hours must be between 12AM and 2PM");
        }
      
        console.log('All slots are valid');
        return delegate(event.currentIntent.slots);
      }
    ```

10. Tester avec l'horaire "3PM"

11. Activation du Fulfillment

12. Activation d'une réponse
    - Thanks, I have placed your booking

13. **BUILD**
    ```javascript
      function bookingRestaurantFulfilment(event) {
        const event.currentIntent.slots;
        console.log('CALL API', slots);
    
        return close({});
      }
    ```

## CancelBooking_demo
1. Création de l'intent "CancelBooking_demo"

2. Ajouter un Confirmation prompt
   * Are you sure you want to cancel the [restaurant_name] at [booking_time]?

3. **BUILD**

4. Ajouter des attributs de sessions
   ```javascript
   function bookingRestaurantFulfilment(event) {
        console.log('fulfilment');
        
        event.sessionAttributes['restaurant_name'] = "Chez Joe";
        event.sessionAttributes['restaurant_id'] = "09876";
        event.sessionAttributes['booking_id'] = "0987654";
        event.sessionAttributes['booking_time'] = event.currentIntent.slots.Time;
        
        return close(event.sessionAttributes)
    }
    ```
5. Tester le chatbot