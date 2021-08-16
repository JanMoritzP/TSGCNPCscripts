function interact(event) {
    var inventory = event.player.getInventory().getItems();
    var hasKey = false
    for (var i = 0; i < inventory.length; i++) {
        if (!inventory[i].isEmpty()) {
            var lore = inventory[i].getLore();
            for (var k = 0; k < lore.length; k++) {
                if (lore[k] === "Der Schlüssel zu dem geheimen Waffenraum") hasKey = true;

            }
        }
    }
    if (hasKey) event.block.setOpen(true);
    else {
        event.block.setOpen(false);
        event.setCanceled(true);
    }
}