 var playgroundStartup = {

    startup : function(){

        $("#setPointOfView").on("click", function(){ playground.setPointOfView();});
        $("#setTargetOfQuery").on("click", function(){ playground.setTargetOfQuery();});
        $("#reputationAlgorithm")
            .text(CURRENT_ALGORITHM)
            .on("click", function(){ playground.setReputationAlgorithm();});
        $("#getReputationValues").on("click", function(){ playground.getReputationValues();});

        $("#setTargetOfQuery").mouseenter( playground.paintTarget ).mouseleave( playground.clearPaint );
        $("#setPointOfView").mouseenter( playground.paintPointOfView ).mouseleave( playground.clearPaint );
        
        controlButtons.setup();
    }
}