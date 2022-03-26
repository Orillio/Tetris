jQuery(function(){
    var f = new field();
    f.startGame(200);
    document.onkeydown = function(e) {
        switch(e.which) {
            case 32: // space
            console.log(e);
            break;

            case 37: // left
            console.log(e);
            f.moveLeft()
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
    document.onkeyup = function(e) {
        if(e.which == 38) {
            f.changeDirection();
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    };
});