
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class figure{
    rotation = 0;
    color;
    figureId;
    coord = [];
    constructor(id){
        switch (id) {
            case 0:
                this.color = "green";
                this.figureId = 1;
                this.coord.push([19,3], [19,4], [19,5], [19, 6]);
                break;
            case 1:
                this.color = "red";
                this.figureId = 2;
                this.coord.push([19,4], [19,5], [18,5], [18, 6]);
                break;
            case 2:
                this.color = "lime";
                this.figureId = 3;
                this.coord.push([18,4], [18,5], [19,5], [19, 6]);
                break;
            case 3:
                this.color = "yellow";
                this.figureId = 4;
                this.coord.push([19,4], [19,5], [18,4], [18, 5]);
                break;
            case 4:
                this.color = "purple";
                this.figureId = 5;
                this.coord.push([19,4], [18,3], [18,4], [18, 5]);
                break;
            case 5:
                this.color = "blue";
                this.figureId = 6;
                this.coord.push([19,3], [18,3], [18,4], [18, 5]);
                break;
            case 6:
                this.color = "orange";
                this.figureId = 7;
                this.coord.push([19,5], [18,3], [18,4], [18, 5]);
                break;
            case 7:
                this.color = "gray";
                this.figureId = 8;
                break;
            default:
                break;
        }
    }
    moveDown(){
        this.coord.forEach(element => {
            element[0] -= 1;
        });
    }
    moveLeft(){
        this.coord.forEach(element => {
            element[1] -= 1;
        });
    }
    moveRight(){
        this.coord.forEach(element => {
            element[1] += 1;
        });
    }
    newCoordDown(){
        var newCoord = []
        for (let i = 0; i < 4; i++) {
            newCoord.push([this.coord[i][0] - 1, this.coord[i][1]]);
        }
        return newCoord;
    }
    newCoordRight(){
        var newCoord = []
        for (let i = 0; i < 4; i++) {
            newCoord.push([this.coord[i][0], this.coord[i][1] + 1]);
        }
        return newCoord;
    }
    newCoordLeft(){
        var newCoord = []
        for (let i = 0; i < 4; i++) {
            newCoord.push([this.coord[i][0], this.coord[i][1] - 1]);
        }
        return newCoord;
    }
}

class field{
    colors = ['green', 'red', 'lime',
        'yellow', 'purple', 'blue', 'orange'];

    cells = [[]]
    figures = [];
    currentFigure;
    shadow;
    holdingFigure;
    counter;
    velocity;
    count = 0;
    globalCount = 0;
    gamestarted = false;
    isHolded = false;
    next_figures = [];
    constructor(){
        this.setInitial();
    }
    setInitial(){
        for (let i = 0; i < 20; i++) {
            this.cells.push([]);
            for (let j = 0; j < 10; j++) {
                this.cells[i].push(0);
            }
        }
        for (let i = 0; i < 5; i++) {
            var fig = this.returnRandomFigure();
            this.next_figures.push(fig);
        }
        this.showFiguresOnNextCells();
    }
    returnRandomFigure(){
        var fig = new figure(getRandomInt(7));
        return fig;
    }
    returnNextFigure(){
        return this.next_figures.pop();
    }
    addNextFigure(figure){
        if(this.next_figures.length < 5)
            this.next_figures.splice(0, 0, figure);
    }


    //#region 
    showFigure(figure){
        var cell1 = figure.coord[0];
        var cell2 = figure.coord[1];
        var cell3 = figure.coord[2];
        var cell4 = figure.coord[3];
        $(`.cell${cell1[0]}-${cell1[1]}`).addClass(figure.color);
        $(`.cell${cell2[0]}-${cell2[1]}`).addClass(figure.color);
        $(`.cell${cell3[0]}-${cell3[1]}`).addClass(figure.color);
        $(`.cell${cell4[0]}-${cell4[1]}`).addClass(figure.color);
    }

    removeFigure(figure){
        var cell1 = figure.coord[0];
        var cell2 = figure.coord[1];
        var cell3 = figure.coord[2];
        var cell4 = figure.coord[3];
        $(`.cell${cell1[0]}-${cell1[1]}`).removeClass(figure.color);
        $(`.cell${cell2[0]}-${cell2[1]}`).removeClass(figure.color);
        $(`.cell${cell3[0]}-${cell3[1]}`).removeClass(figure.color);
        $(`.cell${cell4[0]}-${cell4[1]}`).removeClass(figure.color);
    }
    isCellArleadyInField(cell_coord){
        for (let i = 0; i < 4; i++) {
            if(this.cells[cell_coord[i][0]][cell_coord[i][1]] == 1){
                return true;
            }
        }
        
        return false;
    }
    cellIsOutOfBounds(coord){
        for (let i = 0; i < 4; i++) {
            if(coord[i][0] < 0 || coord[i][1] < 0 || coord[i][1] > 9){
                return true;
            }
        }
        return false;
    }
    
    setFigureOnPlace(figure){
        for (let i = 0; i < 4; i++) {
            this.cells[figure.coord[i][0]][figure.coord[i][1]] = 1;
        }
        this.removePendingRows();
    }
    // 1 - right direction, 2 - down dir, 3- left dir
    isMoveable(figure, direction){
        if(direction == 1){
            var newCoord = figure.newCoordRight(figure);
        }
        else if(direction == 2){
            var newCoord = figure.newCoordDown(figure);
        }
        else if(direction == 3){
            var newCoord = figure.newCoordLeft(figure);
        }
        if(this.cellIsOutOfBounds(newCoord)){
            return false;
        }
        if(this.isCellArleadyInField(newCoord)){
            return false;
        }
        return true;
    }
    moveDown(){
        if(this.isMoveable(this.currentFigure, 2)){
            this.removeFigure(this.currentFigure);
            this.currentFigure.moveDown();
            this.showFigure(this.currentFigure);
        }
    }
    moveRight(){
        this.count = 0;
        if(this.isMoveable(this.currentFigure, 1)){
            this.removeFigure(this.currentFigure);
            this.currentFigure.moveRight();
            this.showFigure(this.currentFigure);
            this.remove_shadow();
            this.put_shadow();
        }
        
    }
    moveLeft(){
        console.log(this.count);
        this.count = 0;
        if(this.isMoveable(this.currentFigure, 3)){
            this.removeFigure(this.currentFigure);
            this.currentFigure.moveLeft();
            this.showFigure(this.currentFigure);
            this.remove_shadow();
            this.put_shadow();
        }
    }
    changeDirection(){
        var fig = this.currentFigure;
        var new_fig = new figure();
        var new_coord = [];
        switch (fig.figureId) {
            case 1:
                if(this.currentFigure.rotation == 0){
                    new_coord.push([fig.coord[0][0] + 1 , fig.coord[0][1] + 2])
                    new_coord.push([fig.coord[1][0], fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0] - 1,fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 2, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 1){
                    new_coord.push([fig.coord[0][0] - 2,fig.coord[0][1] + 1])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1]])
                    new_coord.push([fig.coord[2][0],fig.coord[2][1] - 1])
                    new_coord.push([fig.coord[3][0] + 1, fig.coord[3][1] - 2])
                }
                if(this.currentFigure.rotation == 2){
                    new_coord.push([fig.coord[0][0] - 1,fig.coord[0][1] - 2])
                    new_coord.push([fig.coord[1][0],fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0] + 1,fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 2,fig.coord[3][1] + 1])
                }
                if(this.currentFigure.rotation == 3){
                    new_coord.push([fig.coord[0][0] + 2,fig.coord[0][1] - 1])
                    new_coord.push([fig.coord[1][0] + 1,fig.coord[1][1]])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1] + 1])
                    new_coord.push([fig.coord[3][0] - 1,fig.coord[3][1] + 2])
                }
            break;
            case 2:
                if(this.currentFigure.rotation == 0){
                    new_coord.push([fig.coord[0][0], fig.coord[0][1] + 2])
                    new_coord.push([fig.coord[1][0] - 1, fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 1){
                    new_coord.push([fig.coord[0][0] - 2,fig.coord[0][1]])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0],fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 2){
                    new_coord.push([fig.coord[0][0],fig.coord[0][1] - 2])
                    new_coord.push([fig.coord[1][0] + 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1,fig.coord[3][1] + 1])
                }
                if(this.currentFigure.rotation == 3){
                    new_coord.push([fig.coord[0][0] + 2,fig.coord[0][1]])
                    new_coord.push([fig.coord[1][0] + 1,fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1,fig.coord[3][1] + 1])
                }
            break;
            case 3:
                if(this.currentFigure.rotation == 0){
                    new_coord.push([fig.coord[0][0] + 1, fig.coord[0][1] + 1])
                    new_coord.push([fig.coord[1][0], fig.coord[1][1]])
                    new_coord.push([fig.coord[2][0] - 1, fig.coord[2][1] + 1])
                    new_coord.push([fig.coord[3][0] - 2, fig.coord[3][1]])
                }
                if(this.currentFigure.rotation == 1){
                    new_coord.push([fig.coord[0][0] - 1,fig.coord[0][1] + 1])
                    new_coord.push([fig.coord[1][0],fig.coord[1][1]])
                    new_coord.push([fig.coord[2][0] - 1,fig.coord[2][1] - 1])
                    new_coord.push([fig.coord[3][0], fig.coord[3][1] - 2])
                }
                if(this.currentFigure.rotation == 2){
                    new_coord.push([fig.coord[0][0] - 1,fig.coord[0][1] - 1])
                    new_coord.push([fig.coord[1][0],fig.coord[1][1]])
                    new_coord.push([fig.coord[2][0] + 1, fig.coord[2][1] - 1])
                    new_coord.push([fig.coord[3][0] + 2,fig.coord[3][1]])
                }
                if(this.currentFigure.rotation == 3){
                    new_coord.push([fig.coord[0][0] + 1,fig.coord[0][1] - 1])
                    new_coord.push([fig.coord[1][0],fig.coord[1][1]])
                    new_coord.push([fig.coord[2][0] + 1, fig.coord[2][1] + 1])
                    new_coord.push([fig.coord[3][0],fig.coord[3][1] + 2])
                }
            break;
            case 4:
                new_coord = fig.coord
                break;
            case 5:
                if(this.currentFigure.rotation == 0){
                    new_coord.push([fig.coord[0][0] - 1, fig.coord[0][1] + 1])
                    new_coord.push([fig.coord[1][0] + 1, fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 1){
                    new_coord.push([fig.coord[0][0] - 1,fig.coord[0][1] - 1])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 2){
                    new_coord.push([fig.coord[0][0] + 1,fig.coord[0][1] - 1])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1,fig.coord[3][1] + 1])
                }
                if(this.currentFigure.rotation == 3){
                    new_coord.push([fig.coord[0][0] + 1,fig.coord[0][1] + 1])
                    new_coord.push([fig.coord[1][0] + 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1,fig.coord[3][1] + 1])
                }
            break;
            case 6:
                if(this.currentFigure.rotation == 0){
                    new_coord.push([fig.coord[0][0], fig.coord[0][1] + 2])
                    new_coord.push([fig.coord[1][0] + 1, fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 1){
                    new_coord.push([fig.coord[0][0] - 2,fig.coord[0][1]])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 2){
                    new_coord.push([fig.coord[0][0],fig.coord[0][1] - 2])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1,fig.coord[3][1] + 1])
                }
                if(this.currentFigure.rotation == 3){
                    new_coord.push([fig.coord[0][0] + 2,fig.coord[0][1]])
                    new_coord.push([fig.coord[1][0] + 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1,fig.coord[3][1] + 1])
                }
            break;
            case 7:
                if(this.currentFigure.rotation == 0){
                    new_coord.push([fig.coord[0][0] - 2, fig.coord[0][1]])
                    new_coord.push([fig.coord[1][0] + 1, fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 1){
                    new_coord.push([fig.coord[0][0],fig.coord[0][1] - 2])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] + 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1, fig.coord[3][1] - 1])
                }
                if(this.currentFigure.rotation == 2){
                    new_coord.push([fig.coord[0][0] + 2,fig.coord[0][1]])
                    new_coord.push([fig.coord[1][0] - 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] + 1,fig.coord[3][1] + 1])
                }
                if(this.currentFigure.rotation == 3){
                    new_coord.push([fig.coord[0][0],fig.coord[0][1] + 2])
                    new_coord.push([fig.coord[1][0] + 1,fig.coord[1][1] - 1])
                    new_coord.push([fig.coord[2][0], fig.coord[2][1]])
                    new_coord.push([fig.coord[3][0] - 1,fig.coord[3][1] + 1])
                }
            break;
            
            default:
                break;
        }
        if(this.cellIsOutOfBounds(new_coord)){
            var flag = 0;
            for (let i = 0; i < 4; i++) {
                if(new_coord[i][1] < 0){
                    flag = 1;
                }
            }
            for (let i = 0; i < 4; i++) {
                if(new_coord[i][0] < 0){
                    flag = 2;
                }
            }
            if(flag == 0){
                for (let i = 0; i < 4; i++) {
                    if(this.currentFigure.figureId == 1){
                        new_coord[i][1] -= 2;
                    }
                    if(this.currentFigure.figureId != 1 && this.currentFigure.figureId != 4){
                        new_coord[i][1] -= 1;
                    }
                }
            }
            else if(flag == 1) {
                for (let i = 0; i < 4; i++) {
                    if(this.currentFigure.figureId == 1){
                        new_coord[i][1] += 2;
                    }
                    if(this.currentFigure.figureId != 1 && this.currentFigure.figureId != 4){
                        new_coord[i][1] += 1;
                    }
                }
            }
            else if(flag == 2) {
                for (let i = 0; i < 4; i++) {
                    if(this.currentFigure.figureId == 1){
                        new_coord[i][0] += 2;
                    }
                    if(this.currentFigure.figureId != 1 && this.currentFigure.figureId != 4 ){
                        new_coord[i][0] += 1;
                    }
                }
            }
        }
        if(this.isCellArleadyInField(new_coord)){
            for (let i = 0; i < 4; i++) {
                if(this.currentFigure.figureId == 1){
                    new_coord[i][0] += 2;
                }
                if(this.currentFigure.figureId != 1 && this.currentFigure.figureId != 4 ){
                    new_coord[i][0] += 1;
                }
            }
            // this.moveRight();
            // if(this.isCellArleadyInField(new_coord)){
            //     this.moveLeft();
            // }
        }

        if(!this.isCellArleadyInField(new_coord)){
            new_fig.color = this.currentFigure.color;
            new_fig.figureId = this.currentFigure.figureId;
            new_fig.rotation = (this.currentFigure.rotation + 1) % 4;
            new_fig.coord = new_coord;
            this.removeFigure(this.currentFigure);
            this.currentFigure = new_fig;
            this.showFigure(new_fig);
            this.remove_shadow();
            this.put_shadow();
            
        }
    }
    removeRow(rowIndex){
        this.cells.splice(rowIndex, 1);
        this.cells.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        $(`.row${rowIndex}`).remove();
        for (let i = rowIndex + 1; i < 20; i++) {
            var element = $(`.row${i}`);
            element.removeClass(`row${i}`);
            element.addClass(`row${i - 1}`);
            for (let j = 0; j < 10; j++) {
                var element = $(`.cell${i}-${j}`);
                element.removeClass(`cell${i}-${j}`);
                element.addClass(`cell${i-1}-${j}`);
            }
        }
        $(".field").prepend(`
            <div class="row row19">
                <div class="cell cell19-0"></div>
                <div class="cell cell19-1"></div>
                <div class="cell cell19-2"></div>
                <div class="cell cell19-3"></div>
                <div class="cell cell19-4"></div>
                <div class="cell cell19-5"></div>
                <div class="cell cell19-6"></div>
                <div class="cell cell19-7"></div>
                <div class="cell cell19-8"></div>
                <div class="cell cell19-9"></div>
            </div>
        `);
    }
    removePendingRows(){
        var removedRows = 0;
        for (let i = 0; i < 20 - removedRows; i++) {
            var flag = false;
            for (let j = 0; j < 10; j++) {
                if(this.cells[i][j] != 1){
                    flag = true;
                }
            }
            if(!flag){
                this.removeRow(i);
                i--;
                removedRows++;
            }
        }
    }
    put_shadow(){
        this.shadow = new figure(7);
        for (let i = 0; i < 4; i++) {
            this.shadow.coord.push([this.currentFigure.coord[i][0], this.currentFigure.coord[i][1]]);   
        }
        this.shadow.rotation = this.currentFigure.rotation;
        while(!this.cellIsOutOfBounds(this.shadow.newCoordDown()) && !this.isCellArleadyInField(this.shadow.newCoordDown())){
            this.shadow.moveDown();
        }
        this.showFigure(this.shadow);
    }
    remove_shadow(){
        this.removeFigure(this.shadow);
    }
    
    hold(){
        if(this.isHolded) return;
        clearInterval(this.counter);
        this.removeFigure(this.currentFigure);
        this.remove_shadow();
        this.clearHold();
        this.isHolded = true;
        if(this.holdingFigure == undefined){
            this.holdingFigure = new figure(this.currentFigure.figureId - 1);
            this.onNewFigure(this.returnNextFigure());
        }
        else{
            var temp = new figure(this.holdingFigure.figureId - 1);
            this.holdingFigure = new figure(this.currentFigure.figureId - 1);
            this.onNewFigure(temp);
        }
        this.showFigureOnCell(this.holdingFigure, ".fig_cell");
    }

    //#endregion
    
    showFigureOnCell(figure, str){
        var id = figure.figureId;
        if(id == 1){
            for (let i = 0; i < 4; i++) {
                $(`${str}1-${i}`).addClass(figure.color);
            }
        }
        if(id == 2){
            $(`${str}1-0`).addClass(figure.color);
            $(`${str}1-1`).addClass(figure.color);
            $(`${str}0-1`).addClass(figure.color);
            $(`${str}0-2`).addClass(figure.color);
        }
        if(id == 3){
            $(`${str}1-2`).addClass(figure.color);
            $(`${str}1-1`).addClass(figure.color);
            $(`${str}0-1`).addClass(figure.color);
            $(`${str}0-0`).addClass(figure.color);
        }
        if(id == 4){
            $(`${str}1-1`).addClass(figure.color);
            $(`${str}1-2`).addClass(figure.color);
            $(`${str}0-1`).addClass(figure.color);
            $(`${str}0-2`).addClass(figure.color);
        }
        if(id == 5){
            $(`${str}1-1`).addClass(figure.color);
            $(`${str}0-0`).addClass(figure.color);
            $(`${str}0-1`).addClass(figure.color);
            $(`${str}0-2`).addClass(figure.color);
        }
        if(id == 6){
            $(`${str}1-0`).addClass(figure.color);
            $(`${str}0-0`).addClass(figure.color);
            $(`${str}0-1`).addClass(figure.color);
            $(`${str}0-2`).addClass(figure.color);
        }
        if(id == 7){
            $(`${str}1-2`).addClass(figure.color);
            $(`${str}0-0`).addClass(figure.color);
            $(`${str}0-1`).addClass(figure.color);
            $(`${str}0-2`).addClass(figure.color);
        }
    }
    clearHold(){
        if(this.holdingFigure != undefined){
            for (let i = 0; i < 4; i++) {
                var el1 = $(`.fig_cell0-${i}`);
                var el2 = $(`.fig_cell1-${i}`);
                el1.removeAttr('class');
                el1.attr('class', `cell fig_cell0-${i}`);
                el2.removeAttr('class');
                el2.attr('class', `cell fig_cell1-${i}`);
            }
        }
    }
    showFiguresOnNextCells(){
        this.clearNext();
        for (let i = 0; i < 5; i++) {
            this.showFigureOnCell(this.next_figures[i], `.figure${i} .next_cell`);
        }
    }
    clearNext(){
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                var el1 = $(`.figure${i} .next_cell0-${j}`);
                el1.removeClass(this.colors);
                var el2 = $(`.figure${i} .next_cell1-${j}`);
                el2.removeClass(this.colors);
            }
        }
    }
    onNewFigure(fig){
        if(!this.gamestarted) return;
        this.counter = 0;
        this.globalCount = 0;
        var figure = fig;
        this.addNextFigure(this.returnRandomFigure());
        if(this.isCellArleadyInField(figure.coord)){
            this.abortGame(0);
            return;
        }
        this.currentFigure = figure;
        this.showFigure(this.currentFigure);
        this.put_shadow();
        this.showFiguresOnNextCells();
        this.counter = setInterval(() => {
            if(!this.isMoveable(this.currentFigure, 2)){
                this.count++;
                this.globalCount++;
                if(this.count >= 1000 / this.velocity
                    || this.globalCount >= 10000 / this.velocity){

                    clearInterval(this.counter);
                    this.count = 0;
                    this.isHolded = false;
                    this.setFigureOnPlace(this.currentFigure);
                    this.remove_shadow();
                    this.showFiguresOnNextCells();
                    this.onNewFigure(this.returnNextFigure());
                    return;
                }
            }
            else{
                this.moveDown(this.currentFigure);
            }
        }, this.velocity);
    }
    hardDrop() {
        if(!this.gamestarted) return;
        clearInterval(this.counter);
        this.removeFigure(this.currentFigure);
        while(this.isMoveable(this.currentFigure, 2)){
            this.currentFigure.moveDown();
        }
        this.count = 0;
        this.showFigure(this.currentFigure);
        this.setFigureOnPlace(this.currentFigure);
        this.isHolded = false;
        this.remove_shadow();
        this.showFiguresOnNextCells();
        this.onNewFigure(this.returnNextFigure());
        
    }
    startGame(velocity){
        this.gamestarted = true;
        this.velocity = velocity;
        this.onNewFigure(this.returnNextFigure());
    }
    clearField(){
        this.cells = [];
        this.setInitial();
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                $(`.cell${i}-${j}`).removeClass(this.colors);
            }
        }
    }
    abortGame(win){
        clearInterval(this.counter);
        this.clearField();
        this.clearNext();
        this.clearHold();
        this.gamestarted = false;
    }
}

// 1 - зеленая(палка)
// 2 - красная(странная херовина слева)
// 3 - лаймовая(странная херовина справа)
// 4 - желтая(квадрат)
// 5 - фиолетовая(буква Т)
// 6 - синяя(буква Г)
// 7 - оранжевая(перевернутая буква Г)
// 8 - серый(тень)

// x = 1000/velocity