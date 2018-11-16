Création du bot "Restaurant" dans l'IHM

# Amazon LEX
## Intent Lunch_demo
1. Création de l'intent "ChooseRestaurant_demo"  
2. Explication des utterances et ajout de deux phrases
   * I'm starving 
   * I'm hungry
   * I want to eat
   * eat
   
3. Explication des slots
   * Time               ----    When?
   * RestaurantType     ----    What kind?

4. Ajout d'une utterance {Time} 
   * I want to eat at {RestaurantType} ​{Time}

5. **BUILD**

6. Test du chatbot

**Speaker 2 : comment-je peux vérifier les paramètres ?**

9. Activation de la Lambda initialization and validation
  
10. **BUILD**

11. Coder la lambda 
    ```javascript
      decider.addDialogCodeHook("ChooseRestaurant_demo", validateChoose);
    
      async function validateBookingIntent(event) {    
        const slots = event.currentIntent.slots;
        const time = slots.Time;
          
        if(time && (time < "12:00" || time > "14:00")) {
          return elicitSlot(event.currentIntent.name, slots, "Time", "Reservation must be between 12AM and 2PM");
        }
      
        console.log('All slots are valid');
        return delegate(slots);
      }
    ```

12. Tester avec l'horaire "3PM"

**Speaker 2 : c'est bien gentil le récapitulatif de l'intent ...**

13. Activation du Fulfillment

14. **BUILD**
    ```javascript
      decider.addFulfillmentCodeHook("ChooseRestaurant_demo", fulfilment);

      async function fulfilment(event) {
        const slots = event.currentIntent.slots;
        const time = slots.Time;
        const type = slots.RestaurantType;
        
        const resto = chooseRestaurant(time, type);
       
        return close({}, "Your restaurant is "+ resto);
      }
    ```
    
**Speaker 2 : Et si le premier restaurant ne me convient pas ?**

## AnotherRestaurant_demo
1. Création de l'intent "AnotherRestaurant_demo"

2. Activation du Fulfillment

3. **BUILD**

4. Ajouter des attributs de sessions
   ```javascript
   decider.addFulfillmentCodeHook("AnotherRestaurant", another);
   async function another(event) {
      const slots = event.sessionAttributes;
      const time = slots.Time;
      const type = slots.RestaurantType;
      
      const resto = chooseRestaurant(time, type);   
      return close(slots, "Your NEW restaurant is " + resto);
   }
   ```
    
    ```javascript
    async function fulfillment(event) {
      const slots = event.currentIntent.slots;
      const time = slots.Time;
      const deliveryMode = slots.DeliveryMode;
      
      const resto = chooseRestaurant(time, deliveryMode);
  
   
      // /!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\/!\
      return close({Time: time, RestaurantType: type}, "You restaurant is " + resto);
    }
    ```
    
    
5. Tester le chatbot

# Dialogflow
1. Vincent : Dialogflow et Lex partagent les mêmes concepts (Montrer un Intent)


**Speaker 2 : je suis rassuré je retrouve les mêmes concepts**

2. Acquisser et montrer l'interface de tests à droite du chatbot et le tester


**Speaker 2 : demander d'afficher une image à la place du nom du restaurant**

3. Expliquer le concept de Rich Message
    * Aller dans le fulfilment et montrer la condition sur time pour rassurer les participants 
    * Décommenter le code
    * Déployer le code

**Speaker 2 : Si je demande à ton bot "ou mange t'on", il sait me répondre ?**

4. Présenter le training

5. Tester le chat bot pour montrer le rich message une fois la fonction déployée

**Speaker 2 : Il se passe quoi si je demande à ton chatbot l'âge qu'il a ?**

6. Présenter le small talk

**Speaker 2 : tous les xebians sont sur slack, il serait bien de le déployer**

7. Présenter les intégrations

