function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class figure{
    color;
    coord = [];
    constructor(id){
        switch (id) {
            case 0:
                this.color = "green";
                this.coord.push([19,3], [19,4], [19,5], [19, 6]);
                break;
            case 1:
                this.color = "red";
                this.coord.push([19,4], [19,5], [18,5], [18, 6]);
                break;
            case 2:
                this.color = "lime";
                this.coord.push([18,4], [18,5], [19,5], [19, 6]);
                break;
            case 3:
                this.color = "yellow";
                this.coord.push([19,4], [19,5], [18,4], [18, 5]);
                break;
            case 4:
                this.color = "purple";
                this.coord.push([19,4], [18,3], [18,4], [18, 5]);
                break;
            case 5:
                this.color = "blue";
                this.coord.push([19,3], [18,3], [18,4], [18, 5]);
                break;
            case 6:
                this.color = "orange";
                this.coord.push([19,5], [18,3], [18,4], [18, 5]);
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
            newCoord.push([this.coord[i][0] - 1, this.coord[i][1] - 1]);
        }
        return newCoord;
    }
}

class field{
    cells = [[]]
    figures = [];
    readyToPlace = false;
    currentFigure;
    counter;
    waiter;
    velocity;
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
        console.log(this.cells);
    }
    returnRandomFigure(){
        var fig = new figure(getRandomInt(7));
        return fig;
    }
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
        if(!this.isMoveable(this.currentFigure, 2)){
            var counter = setTimeout(() => {
            }, 1000);
            return;
        }
        this.removeFigure(this.currentFigure);
        this.currentFigure.moveDown();
        this.showFigure(this.currentFigure);
    }
    moveRight(){
        if(!this.isMoveable(this.currentFigure, 1)){
            var counter = setTimeout(() => {
            }, 1000);
            return;
        }
        this.removeFigure(this.currentFigure);
        this.currentFigure.moveRight();
        this.showFigure(this.currentFigure);
    }
    moveLeft(){
        if(!this.isMoveable(this.currentFigure, 3)){
            var counter = setTimeout(() => {
            }, 1000);
            return;
        }
        this.removeFigure(this.currentFigure);
        this.currentFigure.moveLeft();
        this.showFigure(this.currentFigure);
    }
    waitUntilPlaced(){
        
    }
    onNewFigure(){
        var figure = this.returnRandomFigure();
        this.currentFigure = figure;
        this.showFigure(this.currentFigure);
        var counter = setInterval(() => {
            if(!this.isMoveable(this.currentFigure, 2)){
                // if(this.readyToPlace){
                    this.setFigureOnPlace(this.currentFigure);
                    this.onNewFigure();
                    clearInterval(counter);
                // }
            }
            this.moveDown(figure);
        }, this.velocity);
    }
    startGame(velocity){
        this.velocity = velocity;
        this.onNewFigure();
    }
}

// 1 - зеленая(палка)
// 2 - красная(странная херовина слева)
// 3 - лаймовая(странная херовина справа)
// 4 - желтая(квадрат)
// 5 - фиолетовая(буква Т)
// 6 - синяя(буква Г)
// 7 - оранжевая(перевернутая буква Г)

// если при повороте встречается преграда, то поднять фигуру на один блок выше, если 