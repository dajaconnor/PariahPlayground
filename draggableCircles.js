function setupDragEvents(element) {

    var x2 = 0;
    var y2 = 0;
    var x1 = 0;
    var y1 = 0;
    var startingElement = null;
    element.onmousedown = dragMouseDown;
   
    

    function dragMouseDown(event) {
        resetUI();
        event = handleEventBoilerplate(event);

        // only drag for left clicks!
        if (!isLeftButton(event)) return;

        // get the mouse cursor position at startup:
        x1 = event.clientX;
        y1 = event.clientY;

        if (event.ctrlKey || controlButtons.link()){

            colorCirclesByGradient(event.target);
            document.onmouseup = closeLinkElement;
            document.onmousemove = link;

        } else{

            if (event.shiftKey || controlButtons.group()){

                helper.selectCircle(event.target);
            } else if (controlButtons.move()){

                document.onmouseup = closeDragElement;
                document.onmousemove = drag;
            }
        }

        
    }

    function drag(event){

        event = handleEventBoilerplate(event);

        // calculate the new cursor position:
        x2 = x1 - event.clientX;
        y2 = y1 - event.clientY;
        x1 = event.clientX;
        y1 = event.clientY;

        element.style.top = (element.offsetTop - y2) + "px";
        element.style.left = (element.offsetLeft - x2) + "px";

        $(".from" + element.id).each(function(i, line){
            helper.moveLine(line);
        });
        $(".to" + element.id).each(function(i, line){
            helper.moveLine(line);
        });
    }

    function link(event){

        event = handleEventBoilerplate(event);
        
        //console.log(event.clientX + " : " + event.clientY);

        var lineId = "drawing";
        var line = $("#" + lineId);

        if (line.length == 0){
            line = helper.createLine(lineId, "playground");
            startingElement = findCircleParent(event.target);
        }

        helper.moveLineByPoints(helper.getCenterOfCircle(startingElement), [event.clientX, event.clientY], line, 0);
        
    }

    function closeDragElement() {

        // reset document's mouse functions :)
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function closeLinkElement(event) {

        event = handleEventBoilerplate(event);

        document.onmouseup = null;
        document.onmousemove = null;

        var target = findCircleParent(event.target);

        if (target != null && startingElement != null && startingElement.id && target.id && startingElement.id != target.id){

            createLinkTypeSelectionButtons(event.clientX, event.clientY, startingElement.id, target.id);
            
            

        } else{

            $("#drawing").remove();
            $(".lineTypePickerCircle").removeClass("lineTypePickerCircle");
        }
    }

    function createLinkTypeSelectionButtons(x, y, fromId, toId){

        $(".lineTypePickerCircle").removeClass("lineTypePickerCircle");

        if (helper.isOnLeft(toId, x)){

            playground.createPositiveLink(fromId, toId);
        } else{

            playground.createNegativeLink(fromId, toId);
        }

        anchorLineToCircleCenters($("#"+fromId), $("#"+toId));
    }

    function anchorLineToCircleCenters(from, to){

        helper.moveLineByPoints(helper.getCenterOfCircle(from), helper.getCenterOfCircle(to), $("#drawing"), 0);
    }

    function handleEventBoilerplate(event){

        event = event || window.event;

        // clears whatever the default event would have been
        event.preventDefault();

        return event;
    }

    function colorCirclesByGradient(mysteryElement){

        var circle = findCircleParent(mysteryElement);
        console.log("found circle: " + circle.id);

        $(".circle").each(function(i, otherCircle){

            if (otherCircle.id != circle.id){

                console.log("found other circle: " + otherCircle.id);
                $(otherCircle).addClass("lineTypePickerCircle");//"linear-gradient(to right, blue, #97a9f8, red)");
            }
        })
    }
}