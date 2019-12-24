function isLeftButton(event){
    
    return event.which == 1;
}

function getAngleInDegrees(rise, run){

    return Math.atan(rise/run) * 180 / Math.PI;
}

function getAngle(origin, target) {

    var run = target[0] - origin[0];
    var rise = -(target[1] - origin[1]); // because y is smaller at the top for some reason

    var radians = Math.atan2(rise, run);

    // Map to 0 degrees at 3 O'clock, 270 at 12 O'clock
    if (radians < 0) radians = Math.abs(radians);
    else radians = 2 * Math.PI - radians;

    return radians * 180 / Math.PI;
}

function getVectorFromAngleAndDistance(distance, angle){

    var radians = angle / (180 / Math.PI);

    return [distance * Math.sin(radians), distance * Math.cos(radians)];
}


function getTargetQuadrant(startPoint, endPoint){

    // starting top left, going clockwise 0-3
    if ( endPoint[1] < startPoint[1] ){

        if ( endPoint[0] < startPoint[0] ) return 0; // top left
        return 1; // top right
    }

    if ( endPoint[0] > startPoint[0] ) return 2; // bottom right
    return 3; //bottom left
}

function findCircleParent(element){
    if ($(element).hasClass("circle") ) return element;
    if (element == document.body) return null;
    if (element == null) return null;
    return findCircleParent(element.parentElement);
}

function findLineParent(element){
    if ($(element).hasClass("line") ) return element;
    if (element == document.body) return null;
    if (element == null) return null;
    return findLineParent(element.parentElement);
}

function resetUI(){

    document.onmouseup = null;
    document.onmousemove = null;
    $("#drawing").remove();
}

function createLinkId(fromId, toId, isPositive){

    var id = isPositive ? "positiveLink" : "negativeLink"
    id += "From" + fromId + "To" + toId;

    //if (CAN_HAVE_DUPLICATE_LINK_TYPES && $("#" + id + 1).length > 0) id = findIdNumber(id, 2);

    return id;
}

function findIdNumber(id, count){

    if ($("#" + id + count).length > 0) return findIdNumber(id, count + 1);
    return id + count;
}
