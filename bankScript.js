function createCoins(name, amount, event) {
    if(amount > 64) return null;
    return event.API.getIWorlds()[0].createItem("ordinarycoins:coin".concat(name), 0, amount);  
}

function analyseAmount(coins) {
    if(coins.getDisplayName() === "Bronze Coin") {
        return coins.getStackSize()
    }
    else if(coins.getDisplayName() === "Silver Coin") {
        return coins.getStackSize() * 10
    }
    else if(coins.getDisplayName() === "Gold Coin") {
        return coins.getStackSize() * 100
    }
    else if(coins.getDisplayName() === "Platinum Coin") {
        return coins.getStackSize() * 1000
    }
    return 0;
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
    gui.addTextField(7, 210, 63, 100, 15);
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
        if(freeSlots === 5) {
            event.player.message("Du hast keinen Platz im Inventar");
            return;
        }
        while(money >= 1) {
            if(freeSlots > 5) {
                if(money > 999) {  //platinum
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
                else if(money > 99) {  //gold
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
                else if (money > 9) {  //silver
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
        var depositGui = event.API.createCustomGui(100, 248, 100, false);
        depositGui.addTexturedRect(103, "minecraft:textures/gui/container/inventory.png", 3, 16, 250, 80, 0, 338);        
        depositGui.addItemSlot(48, -13);
        depositGui.addTexturedRect(102, "minecraft:textures/gui/widgets.png", 80, -50, 23, 23, 0, 22);
        depositGui.showPlayerInventory(-25, 51);
        event.player.showCustomGui(depositGui);
        depositGui.update(event.player);
    }
    else if(event.buttonId === 5) {  //definierte Menge abheben
        var baseMoney = event.API.getIWorlds()[0].getStoreddata().get("money:".concat(event.player.getDisplayName()));
        var money = parseInt(event.gui.getComponent(7).getText());
        if(money > baseMoney) return;
        var moneyCopy = money;
        var inventory = event.player.getInventory().getItems();
        var freeSlots = 0;
        for(var i = 0; i < inventory.length; i++) {
            if(inventory[i].isEmpty()) freeSlots = freeSlots + 1;
        }
        if(freeSlots === 5) {
            event.player.message("Du hast keinen Platz im Inventar");
            return;
        }
        while(money >= 1) {
            if(freeSlots > 5) {
                if(money > 999) {  //platinum
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
                else if(money > 99) {  //gold
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
                else if (money > 9) {  //silver
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
        event.API.getIWorlds()[0].getStoreddata().put("money:".concat(event.player.getDisplayName()), baseMoney - (moneyCopy - money));
        event.player.message("Du hast ".concat(moneyCopy - money).concat(" Münzen abgehoben"));
        updateLabel(event, baseMoney - (moneyCopy - money));    
    }
    else if(event.buttonId === 101) {
        event.player.message("Geld eingezahlt");
    }
}

function customGuiSlot(event) {
    if(!event.stack.isEmpty()) {
        var stack = event.stack;
        event.gui.getSlots().get(0).setStack(null);
        var money = analyseAmount(stack);
        if(money != 0) {
            event.stack.setStackSize(0);
            event.gui.updateComponent(event.gui.getSlots()[0]);
            var key = "money:".concat(event.player.getDisplayName());
            var data = event.API.getIWorlds()[0].getStoreddata();
            if(data.has(key)) {
                data.put(key, data.get(key) + money);
            }
            else {
                data.put(key, money);
            }
        }
    }
}
