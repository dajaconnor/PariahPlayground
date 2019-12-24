//["Bob", "Jane", "Charles", "John", "Cal", "George", "Sally", "Blain", "Alfred", "Penny" ]

//Globals
var FADE_SPEED = 400;
var NUDGE_SPEED = 10;
var CAN_HAVE_DUPLICATE_LINK_TYPES = false;
var ALGORITHMS = ["Pariah", "Naive"];
var CURRENT_ALGORITHM = "Pariah";

var ENTITY_MAP = {};
var ID_TO_TEXT = {};
var FORCE_MOVEMENT_CUTOFF = 100000;
var nextCircleId = 1;

var SPACING_VARIABLES = {};
var NAVIGATION_MAP = {};

//"rgb(221, 68, 68)";
var NEGATIVE_SHADOW = "rgb(255, 34, 34)";
var NEUTRAL_SHADOW = "#232335";
var POSITIVE_SHADOW = "rgb(34, 34, 255)";

var selectedCircles = [];

$("document").ready(function () {

    SPACING_VARIABLES = helper.getSpaceVars();
    playgroundStartup.startup();

    $(window).resize(function () {

        SPACING_VARIABLES = helper.getSpaceVars();
        helper.resizeCircles(true);
        //forceMove.spreadCircles();
        
    });

    $("body").mousedown(function(e){

        // is left button down and on backgroun
        if (isLeftButton(e) && e.target === document.body 
            && controlButtons.canCreate() ){

            resetUI();

            helper.createCircle(nextCircleId++, ID_TO_TEXT,
                event.clientX - SPACING_VARIABLES['circleWidth'] / 2, 
                event.clientY - SPACING_VARIABLES['circleHeight'] / 2, 
                "playground");

            SPACING_VARIABLES = helper.getSpaceVars();
            helper.resizeCircles(true);
        }
    });
});



playground = {

    drawLineHome : function (x1, y1, color, thickness){

        var offset = $('.current').offset();
        var x2 = offset.left + SPACING_VARIABLES['circleWidth'] / 2;
        var y2 = offset.top + SPACING_VARIABLES['circleHeight'] / 2;

        // distance
        var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
        
        // center
        var cx = ((x1 + x2) / 2) - (length / 2);
        var cy = ((y1 + y2) / 2) - (thickness / 2);
        
        // angle
        var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
        
        var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg); z-index:0;' />";

        document.body.innerHTML += htmlLine;
    },

    createPositiveLink : function(fromId, toId){

        if (playground.allowedToCreateThisLink(fromId, toId, true)){

            var newLine = playground.boilerPlateForNewLink(fromId, toId, true);

            newLine.addClass("positiveLink");
            //TODO add edge to server
        }

        resetUI();
    },

    createNegativeLink : function(fromId, toId){

        if (playground.allowedToCreateThisLink(fromId, toId, false)){

            var newLine = playground.boilerPlateForNewLink(fromId, toId, false);

            newLine.addClass("negativeLink");
            
            //TODO add edge to server
        }

        resetUI();
    },

    allowedToCreateThisLink : function(fromId, toId, isPositive){

        if (CAN_HAVE_DUPLICATE_LINK_TYPES) return true;
        return $("#"+createLinkId(fromId, toId, isPositive)).length == 0;
    },

    boilerPlateForNewLink : function(fromId, toId, isPositive){

        var newLine = $("#drawing");

        //var timestamp = (new Date).getTime();
        var id = createLinkId(fromId, toId, isPositive);

        if (CAN_HAVE_DUPLICATE_LINK_TYPES) id += "_" + (new Date).getTime();

        newLine.attr('id', id);
        newLine.attr("createdDate", (new Date).getTime());

        newLine.addClass(helper.getLineClassByCicleIds(fromId, toId));

        helper.setLineClasses(newLine, fromId, toId);
        helper.moveLine(newLine); // Sets it in it's offset order

        return newLine;
    },

    setPointOfView : function(){

        $(".pointOfView").removeClass("pointOfView");
        $(".highlighted").addClass("pointOfView").removeClass("highlighted");

        playground.clearPaint();
        playground.paintPointOfView();
    },

    setTargetOfQuery : function(){

        $(".targetQuery").removeClass("targetQuery");
        $(".highlighted").addClass("targetQuery").removeClass("highlighted");

        playground.clearPaint();
        playground.paintTarget();
    },

    setReputationAlgorithm : function(){

        console.log("setReputationAlgorithm");
    },


    getReputationValues : function(){
        console.log("Yeah!");
    },

    paintTarget : function(){

        $(".targetQuery").addClass("painted");
        
    },

    paintPointOfView : function(){

        $(".pointOfView").addClass("painted");
    },

    clearPaint : function(){

        $(".painted").removeClass("painted");
    },

    jsonifyTheGraph : function(){

        var graph = {
            circles : []
        };

        $(".circle").each(function(i, circle){

            console.log(circle)

            var id = circle.id;
            console.log(id)

            var jsonCircle = {

                id : id,
                name : helper.getDisplayName(id),
                trusts : [],
                distrusts : [],
                vectorPercent : playground.getPositionAsVectorPercent(circle)
            };

            $(".from"+id).each(function(i, link){

                if($(link).hasClass("positiveLink")) jsonCircle.trusts.push($(link).attr("to"));
                if($(link).hasClass("negativeLink")) jsonCircle.distrusts.push($(link).attr("to"));
            });

            graph.circles.push(jsonCircle);
        });

        alert(graph);

        console.log(graph);
        return graph;
    },

    graphTheJson : function( graph ){

        playground.clearTheGraph();
        ID_TO_TEXT = {};

        graph.circles.forEach(function(jsonCircle){

            if (jsonCircle.id != jsonCircle.name) ID_TO_TEXT[jsonCircle.id] = jsonCircle.name;

            var position = playground.getPositionFromVectorPercent(jsonCircle.vectorPercent);

            helper.createCircle(jsonCircle.id, ID_TO_TEXT, position[0], position[1], "playground");
        });

        graph.circles.forEach(function(jsonCircle){

            jsonCircle.trusts.forEach(function(toId){

                playground.createPositiveLink(jsonCircle.id, toId);
            });

            jsonCircle.distrusts.forEach(function(toId){

                playground.createNegativeLink(jsonCircle.id, toId);
            });
        });
    },

    getPositionAsVectorPercent : function( circle ){

        parseInt($("#1").css("left"), 10)
        return [ parseInt($(circle).css("left"), 10) / $(window).width(), parseInt($(circle).css("top"), 10) / $(window).height()];
    },

    getPositionFromVectorPercent : function( vectorPercent ){

        return [ vectorPercent[0] * $(window).width(), vectorPercent[1] * $(window).height()];
    },

    clearTheGraph : function(){

        $(".circle").each(function(i, circle){

            helper.deleteCircle(circle);
        });
        
    }

}