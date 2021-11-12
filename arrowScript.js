// this scrip replaces vanila minecraft arrow with customnps projectile witch is able to use projectile events

var projectile = {
    trailenum:1, //tail particles collor, 0 to disable
    PotionEffect:0, 
    effectDuration:5, gravity:1, 
    accelerate:1, glows:0, power:0, 
    size:10, 
    punch:1, //arrow damage
    explosiveRadius:0, spins:0, 
    sticks:0, render3d:1, 
    isArrow:1, itemid:"minecraft:arrow", 
    itemmeta:0, canBePickedUp: 1}

function rangedLaunched(e){
    e.setCanceled(true);// cancel spawn of vanila minecraft arrow
    var charge = (72000 - e.player.getMCEntity().func_184605_cv());// compute how much the bowstring is pulled
    if (charge>7){// prevent too often shoots
    
        var pi = Math.PI;
        var rot = e.player.getRotation();// angle in X Z axis
        var deviation = Math.random()*sign()/(0.5);// optional value for arrow to have some deviation
        rot += deviation
        var pitch = e.player.getPitch();// vertical camera angle
        
        var ratio = (charge/25 > 1) ? 1 : (charge/25);
        var velosity = 3*ratio;// charge dependence 
        
        var xz_vector = velosity*Math.abs(Math.cos(pitch*pi/180));// projection of motion vector in X Z plane
        var x_dir = Math.sin(rot*pi/180)*(-1)*xz_vector;// X component of motion vector
        var y_dir = velosity*Math.sin(pitch*pi/180)*(-1);// Y component of motion vector
        var z_dir = Math.cos(rot*pi/180)*xz_vector;// Z component of motion vector
        
        // create NBT string for projectile
        var str = '{id:"customnpcs:customnpcprojectile",ownerName:"'+
        e.player.UUID+'",Pos:['+e.player.x+'d,'+(e.player.y+1.6)+'d,'+e.player.z+
        'd],PotionEffect:'+projectile.PotionEffect
        +',isArrow:'+projectile.isArrow
        +'b,punch:'+projectile.punch
        +',explosiveRadius:'+projectile.explosiveRadius
        +',Item:{id:"'+projectile.itemid+'",Count:1,Damage:'+projectile.itemmeta+'s},damagev2:'+projectile.power
        +'f,trailenum:'+projectile.trailenum
        +',Spins:'+projectile.spins
        +'b,glows:'+projectile.glows
        +'b,Accelerate:'+projectile.accelerate
        +'b,direction:['+x_dir+'d,'+y_dir+'d,'+z_dir
        +'d],Motion:['+0+'d,'+0+'d,'+0// while creating Nbt motion values do nothing, but calculated later in fly
        +'d],velocity:'+velosity// this also doesn't do anything
        +',canBePickedUp:'+projectile.canBePickedUp
        +'b,size:'+projectile.size
        +',Sticks:'+projectile.sticks
        +'b,gravity:'+projectile.gravity
        +'b,effectDuration:'+projectile.effectDuration
        +',Render3D:'+projectile.render3d
        +'b}'
        
        var ent = e.player.world.createEntityFromNBT(e.API.stringToNbt(str));// create actual entity
        e.player.world.spawnEntity(ent);
        e.player.world.playSoundAt(e.player.pos, 'minecraft:entity.arrow.shoot', 2, velosity);
        
        //ent.addTag(ratio);// you can add string tag to array in order to use it in impact event
        
        ent.enableEvents();// enable impact and tick events in player script conteiner(see them below)
        }
}

function sign(){
    return (Math.random()>=0.5) ? 1 : -1;
}

function projectileImpact(e){
    // with e.API.executeCommand() you can execute other commands
    if(e.type) {  //Hit a block
    //e.target.getWorld().thunderStrike(e.target.x, e.target.y, e.target.z);
    
    }
    else {  //Hit an entity
        var entity = e.API.getIEntity(e.target);
        entity.addPotionEffect(25, 1, 10, 1);
    }
}


