function init(event) {
    event.block.setModel("minecraft:beacon");
}

function interact(event) {
    var gui = event.API.createCustomGui(1, 300, 1, false);
    gui.addButton(2, "Reset", 0, 0);
    gui.addTextField(3, 210, 60, 50, 50);
    event.player.showCustomGui(gui);
}

function customGuiButton(event) {
    var dialogId = event.gui.getComponent(3).getText();
    if(dialogId == null) return;
    event.player.removeDialog(dialogId);
    event.player.message("Unread dialog: " +
     dialogId);
}
