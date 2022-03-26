jQuery(function(){
    var f = new field();
    f.startGame(300);
    document.onkeydown = function(e) {
        switch(e.which) {
            case 37: // left
            console.log(e);
            f.moveLeft()
            break;
    
            case 38: // up
            break;
            
            case 39: // right
            f.moveRight();
            break;
    
            case 40: // down
            console.log(e);
            f.moveDown();
            break;
    
            default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    };
});