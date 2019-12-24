var controlButtons = {

    canCreate : function(){
        return (controlButtons.current == null 
            || controlButtons.current == controlButtons.values.CREATE.name);
    },

    move : function(){
        return (controlButtons.current == null 
            || controlButtons.current == controlButtons.values.MOVE.name);
    },

    link : function(){
        return controlButtons.current == controlButtons.values.LINK.name;
    },

    group : function(){
        return controlButtons.current == controlButtons.values.GROUP.name;
    },

    edit : function(){
        return false;// controlButtons.current == controlButtons.values.EDIT.name;
    },

    delete : function(){
        return controlButtons.current == controlButtons.values.DELETE.name;
    },

    current : null,

    values : {
        CREATE : {name: "create", placement: 4}, 
        MOVE : {name: "move", placement: 3}, 
        LINK : {name: "link", placement: 2}, 
        GROUP : {name: "group", placement: 1}, 
        //EDIT : {name: "edit", placement: 1}, 
        DELETE : {name: "delete", placement: 0}
    },

    createButton : function(name, parentId){

        var buttonDiv = '<div id="'+name+'Button" class="button"></div>';
        $('#' + parentId).append(buttonDiv);

        var textDiv = '<div id="'+name+'Text" class="buttonText">' + name + '</div>';
        $('#' + parentId).append(textDiv);

        $("#" + name + "Button").on("click", function(){ 

            $(".buttonSelected").removeClass("buttonSelected");

            if (controlButtons.current != name){

                controlButtons.current = name;
                $("#" + name + "Button").addClass("buttonSelected");
            } else{

                controlButtons.current = null;
            }
        });


    },

    resize : function(){

        for ( var key in controlButtons.values ){

            $("#"+controlButtons.values[key].name+"Button").animate({
                top: SPACING_VARIABLES["height"] 
                        - (controlButtons.values[key].placement * SPACING_VARIABLES["buttonSpacing"]) 
                        - (SPACING_VARIABLES["buttonSpacing"] * 3/2),
                left: SPACING_VARIABLES["buttonSpacing"] / 2,
                width: SPACING_VARIABLES["button"],
                height: SPACING_VARIABLES["button"]
                
            }, 0);

            $("#"+controlButtons.values[key].name+"Text").animate({
                top: SPACING_VARIABLES["height"] 
                        - (controlButtons.values[key].placement * SPACING_VARIABLES["buttonSpacing"]) 
                        - (SPACING_VARIABLES["buttonSpacing"] * 3/2)
                        + 4,
                left: SPACING_VARIABLES["buttonSpacing"] * 3/2,
                height: SPACING_VARIABLES["button"]
                
            }, 0);
        }
    },

    setup : function(){

        for ( var key in controlButtons.values ){

            controlButtons.createButton(controlButtons.values[key].name, "playground");
        }

        controlButtons.resize();
    }        
};