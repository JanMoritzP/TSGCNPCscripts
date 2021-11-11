function init(e) {
    e.item.setTexture(1, "minecraft:diamond_axe");  //Switch out for whatever fits
    e.item.setItemDamage(1);
    e.item.setDurabilityShow(0);
    
}

function interact(e) {
    var block = e.player.rayTraceBlock(100, 0, 0).getBlock();
    var xDist = block.getX() - e.player.getX();
    var zDist = block.getZ() - e.player.getZ();
    if(Math.abs(xDist) > Math.abs(zDist)) {
        for(var i = 0; i < 50; i++) {  //length of the lightning wall
            var yPos = checkForAir(block.getX(), block.getY(), block.getZ() - 25 + i, block.getWorld());
            block.getWorld().thunderStrike(block.getX(), yPos, block.getZ() - 25 + i);        
        }
    }
    else {
        for(var i = 0; i < 50; i++) {
            var yPos = checkForAir(block.getX() - 25 + i, block.getY(), block.getZ(), block.getWorld());
            block.getWorld().thunderStrike(block.getX() - 25 + i, yPos, block.getZ());        
        }
    
    }
}

function checkForAir(xPos, yPos, zPos, world) {  //Use this to let the lightning strike at ground level
    var actualYPos = yPos;
    while(world.getBlock(xPos, actualYPos, zPos).isAir()) {
        actualYPos = actualYPos - 1;
    }
    var checked = false
    while(!checked) {
        if(!world.getBlock(xPos, actualYPos + 1, zPos).isAir()) actualYPos = actualYPos + 1;
else checked = true;
return actualYPos;
    }
}