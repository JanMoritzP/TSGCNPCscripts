function createCoins(name, amount, event) {
    if(amount > 64) return null;
    return event.API.getIWorlds()[0].createItem("ordinarycoins:coin".concat(name), 0, amount);  
}

function updateLabel(event, money) {
    event.gui.getComponent(6).setText("Du hast ".concat(money).concat(" Münzen"));
    event.gui.updateComponent(event.gui.getComponent(6));
    event.gui.update(event.player);
}

function init(event) {

}

function interact(event) {
    var money = event.API.getIWorlds()[0].getStoreddata().get("money:".concat(event.player.getDisplayName()));
    var gui = event.API.createCustomGui(1, 300, 100, false);
    gui.addButton(2, "Alles abheben", 0, 0);
    gui.addButton(3, "Alles einzahlen", 0, 20);
    gui.addButton(4, "Definierte Menge einzahlen", 0, 40);
    gui.addButton(5, "Definierte Menge abheben", 0, 60);
    gui.addLabel(6, "Du hast ".concat(money).concat(" Münzen"), 0, 80, 200, 20);
    event.player.showCustomGui(gui);
}

function customGuiButton(event) {
    //event.API.executeCommand(event.API.getIWorlds()[0], "/say " +  event.id);
    if(event.buttonId === 2) {  //Alles auszahlen
        var money = event.API.getIWorlds()[0].getStoreddata().get("money:".concat(event.player.getDisplayName()));
        var moneyCopy = money;
        var inventory = event.player.getInventory().getItems();
        var freeSlots = 0;
        for(var i = 0; i < inventory.length; i++) {
            if(inventory[i].isEmpty()) freeSlots = freeSlots + 1;
        }
        if(freeSlots === 0) {
            event.player.message("Du hast keinen Platz im Inventar");
            return;
        }
        while(money >= 1) {
            if(freeSlots > 0) {
                if(money > 1000) {  //platinum
                    var platinumCoins = Math.floor(money / 1000);
                    if(platinumCoins > 64) {
                        event.player.giveItem(createCoins("platinum", 64, event));
                        money = money - 64000;
                        freeSlots = freeSlots - 1;
                    }
                    else {
                        event.player.giveItem(createCoins("platinum", platinumCoins, event));
                        money = money - platinumCoins * 1000;
                        freeSlots = freeSlots - 1;
                    }
                }
                else if(money > 100) {  //gold
                    var goldCoins = Math.floor(money / 100);
                    if(goldCoins > 64) {
                        event.player.giveItem(createCoins("gold", 64, event));
                        money = money - 6400;
                        freeSlots = freeSlots - 1;
                    }
                    else {
                        event.player.giveItem(createCoins("gold", goldCoins, event));
                        money = money - goldCoins * 100;
                        freeSlots = freeSlots - 1;
                    }
                }
                else if (money > 10) {  //silver
                    var silverCoins = Math.floor(money / 10);
                    if(silverCoins > 64) {
                        event.player.giveItem(createCoins("silver", 64, event));
                        money = money - 640;
                        freeSlots = freeSlots - 1;
                    }
                    else {
                        event.player.giveItem(createCoins("silver", silverCoins,event));
                        money = money - silverCoins * 10;
                        freeSlots = freeSlots - 1;
                    }
                
                }
                else {  //bronze
                    event.player.giveItem(createCoins("bronze",money ,event));
                    money = 0;
                }
            }
            else break;
        }
        event.API.getIWorlds()[0].getStoreddata().put("money:".concat(event.player.getDisplayName()), money);
        event.player.message("Du hast ".concat(moneyCopy - money).concat(" Münzen abgehoben"));
        updateLabel(event, money);
    }
    else if(event.buttonId === 3) {  //Alles einzahlen
        var inventory = event.player.getInventory().getItems();
        var money = 0;
        for(var i = 0; i < inventory.length; i++) {
            //event.player.message(inventory);
            if(inventory[i]) {
                if(inventory[i].getDisplayName() === "Bronze Coin") {
                    money = money + inventory[i].getStackSize();
                    event.player.removeItem(inventory[i], inventory[i].getStackSize());
                }
                if(inventory[i].getDisplayName() === "Silver Coin") {
                    money = money + inventory[i].getStackSize() * 10;
                    event.player.removeItem(inventory[i], inventory[i].getStackSize());
                }
                if(inventory[i].getDisplayName() === "Gold Coin") {
                    money = money + inventory[i].getStackSize() * 100;
                    event.player.removeItem(inventory[i], inventory[i].getStackSize());
                }
                if(inventory[i].getDisplayName() === "Platinum Coin") {
                    money = money + inventory[i].getStackSize() * 1000;
                    event.player.removeItem(inventory[i], inventory[i].getStackSize());
                }
            }           
        }
        var key = "money:".concat(event.player.getDisplayName());
        var data = event.API.getIWorlds()[0].getStoreddata();
        if(data.has(key)) {
            data.put(key, data.get(key) + money);
        }
        else {
            data.put(key, money);
        }
        updateLabel(event, data.get(key));
        event.player.message(money + " Geld eingezahlt");    
    }
    else if(event.buttonId === 4) {  //definierte Menge einzahlen
        var depositGui = event.API.createCustomGui(800, 278, 100, false);
        depositGui.setBackgroundTexture("minecraft:textures/gui/container/bank.png");
        for(var i = 0; i < 9; i++) {
            for(var k = 0; k < 3; k++) {
                depositGui.addItemSlot(i * 18, k * 18 + 42, event.API.getIWorlds()[0].createItem("ordinarycoins:coinbronze", 0, 1));
            }
        }
        depositGui.addButton(101, "Einzahlen", 0, 150);
        depositGui.showPlayerInventory(0, 200);
        depositGui.update(event.player);
    }
    else if(event.buttonId === 5) {
    
    }
    else if(event.buttonId === 101) {
        event.player.message("Geld eingezahlt");
    }
}
