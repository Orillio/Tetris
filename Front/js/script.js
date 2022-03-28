var f;
jQuery(function(){
    f = new field();
    var interval1;
    var interval2;
    var interval3;
    var timeout1;
    var timeout2;
    var timeout3;
    f.startGame(700);
    // 32 - space, 37 - leftArrow, 38 - uparrow 39 - rightarrow, 40 - downarrow
    var map = {32: false, 37: false, 38: false, 39: false, 40: false};
    jQuery(document).on( "keydown", function(e) {
        if(e.keyCode == 32){
            f.hardDrop();
        }
        if(e.keyCode == 16){
            f.hold();
        }
        if(e.keyCode in map){

            if(e.keyCode == 37 && !map[e.keyCode]){
                map[e.keyCode] = true;
                f.moveLeft();
                timeout1 = setTimeout(() => {
                    interval1 = setInterval(() => {
                        f.moveLeft();
                    }, 35);
                }, 120);
            }
            if(e.keyCode == 39 && !map[e.keyCode]){
                map[e.keyCode] = true;
                f.moveRight();
                timeout2 = setTimeout(() => {
                    interval2 = setInterval(() => {
                        f.moveRight();
                    }, 35);
                }, 120);
            }
            if(e.keyCode == 40 && !map[e.keyCode]){
                map[e.keyCode] = true;
                f.moveDown();
                timeout3 = setTimeout(() => {
                    interval3 = setInterval(() => {
                        f.moveDown();
                    }, 60);
                }, 120);
            }
       }
    });
    document.onkeyup = function(e) {
        if (e.keyCode in map) {
            map[e.keyCode] = false;
            if(e.keyCode != 38){
                clearInterval(interval1)
                clearInterval(interval2)
                clearInterval(interval3)
                clearTimeout(timeout1);
                clearTimeout(timeout2);
                clearTimeout(timeout3);
            }
        }
        if(e.keyCode == 38){
            f.changeDirection();
        }
    };
});