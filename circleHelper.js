

var helper = {

    sanityCheck : function (element){

        if (element.css("top") < 0) element.css("top", 0);
        if (element.css("top") > SPACING_VARIABLES["heightLimit"]) element.css("top", SPACING_VARIABLES["heightLimit"]);
        if (element.css("left") < 0) element.css("left", 0);
        if (element.css("left") > SPACING_VARIABLES["widthLimit"]) element.css("left", SPACING_VARIABLES["widthLimit"]);
    },

    setCircleSize : function (size, circle, animateResize, fadeSpeed) {

        var height = size * 3/4;
        var width = size;
        if (!fadeSpeed) fadeSpeed = FADE_SPEED;

        if (animateResize){

            $(circle).animate({
                width: width,
                height: height
            }, FADE_SPEED);
        } else{

            circle.style.width = width + "px";
            circle.style.height = height + "px";
        }

        $(".line").each(function(i, line){

            helper.moveLine(line);
        })
        

    },

    setToggleSize : function (size, toggle) {

        var height = size + "px";
        var width = size + "px";

        toggle.style.width = width;
        toggle.style.height = height;

    },
    
    setButtonSize : function (size, button) {

        var height = size + "px";
        var width = size + "px";

        button.style.width = width;
        button.style.height = height;

    },


    //Fades circle from it's current position to a new one
    slideCircle : function (x, y, circle) {

        var movey = y - parseInt($(circle).css('top'), 10);
        var movex = x - parseInt($(circle).css('left'), 10);
        var topMove = "+=" + movey + "px";
        var leftMove = "+=" + movex + "px";

        $(circle).animate({
            top: topMove,
            left: leftMove
        }, FADE_SPEED);
    },

    applyVectors : function( vectors, slide, iterations ){

        for (var circleId in vectors) {

            var targetPoint = this.findTargetLocation(vectors[circleId], circleId);

            var x = targetPoint[0] + "px";
            var y = targetPoint[1] + "px";

            helper.animateCircle( circleId, targetPoint, FADE_SPEED, iterations );
            // $("#" + circleId).animate({
            //     top: y,
            //     left: x
            // }, FADE_SPEED ? slide : 0, function progress( animation, progress, remainingMs ){ 
            //     var newTarget = forceMove.findTargetForCircle(circleId);

            //     if (newTarget[0] != x && newTarget[1] != y){

            //         animation.stop();
            //         helper.animateCircle(circleId, newTarget, remainingMs, iterations - 1);
            //     }
            // });
        }
    },

    nudgeAlongVectors : function(vectors){

        for (var circleId in vectors) {

            var vector = vectors[circleId];

            helper.constantlyNudge(circleId, vector);
            $("#" + circleId).animate({
                top: helper.getNudgeDirection(vector[1]),
                left: helper.getNudgeDirection(vector[0])
            }, 0);
        }
    },

    getNudgeDirection : function( axis ){

        if (axis > 0) return 1;
        if (axis < 0) return -1;
        return 0;
    },

    constantlyNudge : function(circleId, target){

        $("#" + circleId).animate({
            top: target[1],
            left: target[0]
        }, NUDGE_SPEED, function progress( animation ){ 
            var newTarget = forceMove.findNudgeItForCircle(circleId);

            if ((newTarget[0] != target[0] || newTarget[1] != target[1])){

                animation.stop();
                helper.constantlyNudge(circleId, newTarget);
            }
        });
    },

    animateCircle : function(circleId, target, remainingMs, iterations){

        $("#" + circleId).animate({
            top: target[1],
            left: target[0]
        }, remainingMs, function progress( animation, progress, remainingMs ){ 
            var newTarget = forceMove.findTargetForCircle(circleId);

            if (iterations > 0 && (newTarget[0] != target[0] || newTarget[1] != target[1])){

                animation.stop();
                helper.animateCircle(circleId, newTarget, remainingMs, iterations - 1);
            }
        });
    },

    findTargetLocation : function( vector, circleId ){

        var top = this.getCssNumber("top", circleId) + vector[1];
        var left = this.getCssNumber("left", circleId) + vector[0];

        return [
            this.setInBoundary(left, SPACING_VARIABLES["widthLimit"]),
            this.setInBoundary(top, SPACING_VARIABLES["heightLimit"])
        ];
        
    },

    setInBoundary : function( current, boundary ){

        if (current > boundary) current = boundary;
        else if (current < 0) current = 0;

        return current;
    },

    changeToBoundary : function( current, change, boundary ){

        if ((current + change) > boundary) {
            change = boundary - current;
        } else if ((current + change) < 0){
            change = -current;
        }

        return change;
    },

    getCssNumber : function( cssName, elementId ){

        return parseInt($('#' + elementId).css(cssName), 10);
    },

    // normalizeVector( vector ){

    //     var maxX = SPACING_VARIABLES['width'] - (SPACING_VARIABLES['size'] * 3/4);
    //     var maxY = SPACING_VARIABLES['height'] - (SPACING_VARIABLES['size'] * 9/16);

    //     if (vector[0] < 0) vector[0] = 0;
    //     if (vector[1] < 0) vector[1] = 0;
    //     if (vector[0] > maxX) vector[0] = maxX;
    //     if (vector[1] > maxY) vector[1] = maxY;

    //     return vector;
    // },

    //Places circle in a new location
    moveCircle : function (x, y, circle) {

        var topMove = y + "px";
        var leftMove = x + "px";

        circle.style.top = topMove;
        circle.style.left = leftMove;

    },

    //This makes all circles on the screen the correct size.  Boolean for resizing only the new circles
    resizeCircles : function (animateResize, animateTime) {

        var size = SPACING_VARIABLES["sizeNumberOfNodesSpecific"];

        var fontSize = size * 3 / 32;
        var textHeight = size / 8;
        
        $('.circle').each(function () {
            helper.setCircleSize(size, this, animateResize, animateTime);
        });

        controlButtons.resize();

        $('.centeredText').css({ 'font-size': fontSize });
        $('.centeredText').css({ 'height': textHeight });
    },

    //Returns a dictionary with a number of window size related variables
    getSpaceVars : function () {

        var edges = $(".circle").length;

        if (!edges) edges = 0;

        var vars = {};

        vars['height'] = $(window).height();
        vars['width'] = $(window).width();

        //Find the appropriate size for the window
        if (vars['height'] < vars['width']) {
            vars['space'] = vars['height'];
        }
        else {
            vars['space'] = vars['width'];
        }



        vars['size'] = vars['space'] / 6;
        vars['sizeNumberOfNodesSpecific'] = (vars['space'] / 4) - edges * 2;
        vars['circleHeight'] = 3/4 * vars['sizeNumberOfNodesSpecific'];
        vars['circleWidth'] = vars['sizeNumberOfNodesSpecific'];
        vars['heightLimit'] = vars['height'] - vars['circleHeight'] -10;
        vars['widthLimit'] = vars['width'] - vars['circleWidth'] -10;
        vars['x'] = vars['width'] / 2 - vars['sizeNumberOfNodesSpecific'] / 2;
        vars['y'] = vars['height'] / 2 - vars['sizeNumberOfNodesSpecific'] / 2;
        vars['separation'] = vars['space'] / 3;
        vars['horizontalArrowSpacing'] = vars['x'] / 10;
        vars['verticalArrowSpacing'] = vars['y'] / 10;
        vars['button'] = vars['size'] / 6;
        vars['buttonSpacing'] = vars['size'] / 5;
        vars['lineSpacing'] = vars['sizeNumberOfNodesSpecific'] / 12;
        vars['shadowSpacing'] = vars['sizeNumberOfNodesSpecific'] / 18;

        return vars;
    },

    getRandomInt : function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    //Places circle in the center
    center : function (SPACING_VARIABLES, slide, circle) {

        if (slide) {
            this.slideCircle(SPACING_VARIABLES['x'], SPACING_VARIABLES['y'], circle);
        }
        else {
            this.moveCircle(SPACING_VARIABLES['x'], SPACING_VARIABLES['y'], circle);
        }
    },

    getSmallNewCenterAdjust : function (SPACING_VARIABLES){

        return SPACING_VARIABLES['size'] / 8;
    },

    getDisplayName : function(circleId){

        if (circleId in ID_TO_TEXT) return ID_TO_TEXT[circleId];
        return circleId;
    },

    createCircle : function (id, ID_TO_TEXT, x, y, parentId) {

        //If the div doesn't already exist
        if ($('#' + id).length == 0) {

            var div = '';

            if (id in ID_TO_TEXT) {
                div = '<div id="' + id + '" class="circle"><div class="centeredText">' + ID_TO_TEXT[id] + '</div></div>';
            }
            else {
                div = '<div id="' + id 
                + '" class="circle"><div class="centeredText">' + id + '</div></div>';
            }

            $('#' + parentId).append(div);
            $('#' + id).css("top", y);
            $('#' + id).css("left", x);

            $('#' + id).on("click", function(){ 

                if((window.event.ctrlKey && window.event.shiftKey) || controlButtons.delete()) {
                    
                    helper.deleteCircle(this);
                } else if(controlButtons.edit()){

                    helper.getDisplayName(id)
                    var fontsize = $($('#'+id).children()[0]).css("font-size");
                    var height = $($('#'+id).children()[0]).css("height");


                    var input = '<input id="editText" type="text" value="'
                        + helper.getDisplayName(id)
                        + '" onsubmit="helper.editName('+id+');>';

                        console.log(input);

                    $('#' + id).append(input);
                    //console.log( $('#' + id).children()[0] );
                    //contenteditable="true"
                }
            });
    
        }

        var element = $('#' + id)[0];

        setupDragEvents(element);

        //TODO create node in server

        return element;
    },

    editName : function (id){

        console.log(id);
    },

    createLine : function (id, parentId){

        var lineDiv = '<div id="'+id+'" class="line"></div>';
        $('#' + parentId).append(lineDiv);

        $('#' + id).on("click", function(){ 

            if((window.event.ctrlKey && window.event.shiftKey) || controlButtons.delete()) {
                
                helper.deleteLine(this);
            }
        });

        return $('#' + id);
    },

    moveLine : function(line, siblingOffset){

        var fromId = $(line).attr("from");
        var toId = $(line).attr("to");

        helper.moveLineByPoints(helper.getCenterOfCircle($("#"+fromId)), helper.getCenterOfCircle($("#"+toId)), $(line), siblingOffset);
    },

    moveLineByPoints : function (origin, target, line, siblingOffset){

        if (!siblingOffset && siblingOffset !== 0){
            siblingOffset = helper.getLineSiblingOffset(line);
        }

        var rise = target[1] - origin[1];
        var run = target[0] - origin[0];
        var length = Math.sqrt( Math.pow(rise, 2) + Math.pow(run, 2) );

        var angle = getAngle(origin, target);
        var offsetVector = helper.applyOffset(siblingOffset, angle + 90);
        var shadowVector = getVectorFromAngleAndDistance(SPACING_VARIABLES['shadowSpacing']/2, angle);

        var top = origin[1] + offsetVector[0];
        var left = origin[0] + offsetVector[1];

        var shadowColor = NEUTRAL_SHADOW;
        // if (line.hasClass("negativeLink")) shadowColor = NEGATIVE_SHADOW;
        // if (line.hasClass("positiveLink")) shadowColor = POSITIVE_SHADOW;

        var shadow = "drop-shadow("
        + shadowVector[0] + "px "
        + shadowVector[1] + "px 2px " 
        + shadowColor + ")";

        line.css("top", top);
        line.css("left", left);
        line.css("border-left-width", length );
        line.css("transform", "rotate("+angle+"deg)");
        line.css("transformOrigin", "0 0");
        line.css("filter", shadow);
    },

    applyOffset : function( offset, angle ){

        return getVectorFromAngleAndDistance(offset * SPACING_VARIABLES['lineSpacing'], angle);
    },

    getLineSiblingOffset : function(line){

        var createdDate = line.attr("createdDate");
        var offset = 1; // first is still offset!

        helper.getAllLineSiblings(line).each(function(i, sibling){

            if ($(sibling).attr("createdDate") < createdDate) offset++;
        });

        return offset;
    },

    getAllLineSiblings : function(line){

        var fromId = line.attr("from");
        var toId = line.attr("to");

        var className = helper.getLineClassByCicleIds(fromId, toId);

        return $("." + className);
    },

    getLineClassByCicleIds(fromId, toId){
        return "from" + fromId + "to" + toId;
    },

    setLineClasses : function(line, fromCircleId, toCircleId){

        line.addClass("from" + fromCircleId);
        line.addClass("to" + toCircleId);
        line.attr("from", fromCircleId);
        line.attr("to", toCircleId);
    },

    getCenterOfCircle : function(circle){

        var x = parseInt($(circle).css("left"), 10) + SPACING_VARIABLES["circleWidth"] / 2;
        var y = parseInt($(circle).css("top"), 10) + SPACING_VARIABLES["circleHeight"] / 2;

        return [x, y];
    },

    deleteElement : function(mysteryElement){

        var circle = findCircleParent(mysteryElement);
        
        if (circle != null){

            helper.deleteCircle(circle);
            return;
        }

        var line = findLineParent(mysteryElement);
        $(line).remove();
    },

    deleteCircle : function(circle){

        helper.deleteCirclesLines("to", circle.id);
        helper.deleteCirclesLines("from", circle.id);
        
        $("#" + circle.id).remove();
        SPACING_VARIABLES = helper.getSpaceVars();
        helper.resizeCircles(true);
        //TODO: remove node from server
    },

    selectCircle : function(mysteryElement){

        var circle = findCircleParent(mysteryElement);

        if (circle != null){

            if ($(circle).hasClass("highlighted")){

                $(circle).removeClass("highlighted");
            } else{

                $(circle).addClass("highlighted");
            }
        }
    },

    deleteLine : function(line){

        $("#" + line.id).remove();
        //TODO: remove edge from server
    },

    deleteCirclesLines(direction, circleId){

        $("."+direction+circleId).each(function(i, line){
            helper.deleteLine(line);
        });
    },

    isOnLeft(circleId, x, y){

        var middle = parseInt($("#"+circleId).css("left"), 10) + parseInt($("#"+circleId).css("width"), 10) / 2;

        return x < middle;
    }
}

