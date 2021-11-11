function init(e) {
    e.item.setTexture(1, "minecraft:nether_star");
    e.item.setItemDamage(1);
    e.item.setDurabilityShow(0);
    e.item.setCustomName("Instant Kill");
}

function interact(e) {
    var entities = e.player.rayTraceEntities(10, 0, 0);
    if(entities.length > 0) entities[0].kill();
}