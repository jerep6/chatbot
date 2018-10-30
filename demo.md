Création du bot "Restaurant" dans l'IHM

## Intent BookingRestaurant_demo
1. Création de l'intent "ChooseRestaurant_demo"  
2. Explication des utterances et ajout de deux phrases
   * I'm starving 
   * I'm hungry
   * Where are we eating
   * eat
   
3. Explication des slots
   * Time           ---- When?
   * DeliveryMode   ---- On site or take away?

4. Ajout d'une utterance {Time} 
   * I want to eat at ​{Time}​ and it will be ​{DeliveryMode}​

5. **BUILD**

6. Test du chatbot

7. Test de phrase qu'il ne comprend  pas
    - hey
    - how are you?
    
8. Ajouter une phrase dans la section Error Handling
    - I don't understand what you say!

9. Activation de la Lambda initialization and validation
  
10. **BUILD**

11. Coder la lambda 
    ```javascript
      decider.addDialogCodeHook("ChooseRestaurant_demo", validateChoose);
    
      async function validateBookingIntent(event) {
        const time = event.currentIntent.slots.Time;
          
        if(time && (time < "12:00" || time > "14:00")) {
          return elicitSlot(event.currentIntent.name, event.currentIntent.slots, "Time", "Reservation must be between 12AM and 2PM");
        }
      
        console.log('All slots are valid');
        return delegate(event.currentIntent.slots);
      }
    ```

12. Tester avec l'horaire "3PM"

13. Activation du Fulfillment

14. **BUILD**
    ```javascript
      decider.addFulfillmentCodeHook("ChooseRestaurant_demo", fulfilment);

      async function fulfilment(event) {
        const time = event.currentIntent.slots.Time;
        const deliveryMode = event.currentIntent.slots.DeliveryMode;
        
        const resto = chooseRestaurant(time, deliveryMode);
       
        return close(event.sessionAttributes, "Your restaurant is "+ resto);
      }
    ```

## AnotherRestaurant_demo
1. Création de l'intent "AnotherRestaurant_demo"

2. Activation du Fulfillment

3. **BUILD**

4. Ajouter des attributs de sessions
   ```javascript
   decider.addFulfillmentCodeHook("AnotherRestaurant", another);
   async function another(event) {
     const session = event.sessionAttributes;
     
     const resto = chooseRestaurant(session.Time, session.DeliveryMode);
     return close({}, `You NEW restaurant is ${resto} (${session.Time})`);
   }
   ```
    
    ```javascript
    async function fulfillment(event) {
      const slots = event.currentIntent.slots;
      const time = slots.Time;
      const deliveryMode = slots.DeliveryMode;
      
      event.sessionAttributes.Time = time;
      event.sessionAttributes.DeliveryMode = deliveryMode;
      
      const resto = chooseRestaurant(time, deliveryMode);
      return close(event.sessionAttributes, "You restaurant is " + resto);
    }
    ```
    
    
5. Tester le chatbot