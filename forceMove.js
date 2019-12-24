var forceMove = {

    vectors : {},

    spreadCircles : function(){

        // forceMove.moveAllCircles();

        // forceMove.moveCirclesCycle(2);
        forceMove.incrementalMovement();

    },

    incrementalMovement : function(){

        //while(iterations-- > 0){

            this.vectors = {};
            this.populateVectors();
            helper.nudgeAlongVectors(  this.vectors );
        //}
    },

    moveCirclesCycle : function(iterations){

        setTimeout(function(){ 
        //for (var i = 0; i < iterations; i++){

            forceMove.moveAllCircles();
            if (iterations-- > 0) forceMove.moveCirclesCycle(iterations);
        }, FADE_SPEED);
    },

    moveAllCircles : function(){

        // clear previous vectors
        this.vectors = {};

        this.populateVectors();
        //this.jiggleVectors();
        helper.applyVectors(  this.vectors, true );
    },

    jiggleVectors : function(){

        for (i in this.vectors){
            
            var change = helper.getRandomInt(20) - 10;
            this.vectors[i][0] += change;
            this.vectors[i][1] += change;
        }
    },

    sumVectors : function(){

        var sum = 0;

        for (var id in this.vectors) {

            sum += Math.abs(this.vectors[id][0]);
            sum += Math.abs(this.vectors[id][1]);
        }

        return sum;
    },

    populateVectors : function(){
        var circles = $('.circle');
        var limit = circles.length;

        circles.each(function(i){

            var circle1 = circles.get(i);
            
            forceMove.setBorderVectors( circle1 );
            
            for (n = i+1; n < limit; n++) { 

                var circle2 = circles.get(n);
                forceMove.setCircleVectors(circle1, circle2);
            }
        });
    },

    findTargetForCircle : function( circleId ){

        var circle  = $('#' + circleId);
        var totalVector = forceMove.getBorderVector( circle );

        var circles = $('.circle');

        circles.each(function(i){

            var otherCircle = circles.get(i);

            if (otherCircle !== circle){

                totalVector = forceMove.vectorSum(forceMove.getVector(circle, otherCircle), totalVector);
            }
        });

        return helper.findTargetLocation( totalVector, circleId );
    },

    findNudgeItForCircle : function( circleId ){

        var circle  = $('#' + circleId);
        var totalVector = forceMove.getBorderVector( circle );

        var circles = $('.circle');

        circles.each(function(i){

            var otherCircle = circles.get(i);

            if (otherCircle !== circle){

                totalVector = forceMove.vectorSum(forceMove.getVector(circle, otherCircle), totalVector);
            }
        });

        return helper.findTargetLocation( nudgeifyVector( totalVector ), circleId );
    },

    nudgeifyVector : function( vector ){

        return [ vector[0]/8, vector[1]/8 ];
    },

    getBorderVector : function(circle){

        var x = parseInt($(circle).css('left'), 10);
        var y = parseInt($(circle).css('top'), 10);

        return [
            (SPACING_VARIABLES['widthLimit'] /2 ) - x,
            (SPACING_VARIABLES['heightLimit'] /2 ) - y
        ];
    },

    setBorderVectors : function(circle){

        this.updateCircleVector(circle.id, this.getBorderVector(circle));
    },

    setCircleVectors : function(circle1, circle2){

        var vector = this.getVector(circle1, circle2);

        this.updateCircleVector(circle1.id, vector);
        this.updateCircleVector(circle2.id, this.invertVector(vector));
    },

    updateCircleVector : function( id, vector ){

        var oldVector = this.vectors[id];

        if (!oldVector){ 
            this.vectors[id] = vector 
        }

        else{
            this.vectors[id] = this.vectorSum(oldVector, vector);
        }
    },

    vectorSum : function(vector1, vector2){

        return [vector1[0] + vector2[0], vector1[1] + vector2[1]];
    },

    invertVector : function(vector){

        return  [ 
                    vector[0] *= -1,
                    vector[1] *= -1
                ];
    },

    getDistanceCoordinates : function(x1, y1, x2, y2){

        return Math.sqrt( Math.pow ((x1 - x2), 2) + Math.pow ((y1 - y2), 2) );
    },

    getVectorCoordinates : function(x1, y1, x2, y2){

        var xTotal = Math.abs( Math.abs(x1 - x2) - SPACING_VARIABLES['widthLimit'] ) / 2;
        var yTotal = Math.abs( Math.abs(y1 - y2) - SPACING_VARIABLES['heightLimit'] ) / 2;

        if (x1 > x2) xTotal = -xTotal;
        if (y1 > y2) yTotal = -yTotal;

        var power = Math.sqrt( Math.pow (xTotal, 2) + Math.pow (yTotal, 2) );

        return this.distributePowerToVector(power,[xTotal, yTotal]);
    },

    distributePowerToVector : function(power, [x, y]){

        var abx = Math.abs(x);
        var aby = Math.abs(y);

        return [power * x / (abx+aby), power * y / (abx+aby)];
    },

    getVector : function(circle1, circle2){

        var x1 = parseInt($(circle1).css('left'), 10);
        var y1 = parseInt($(circle1).css('top'), 10);
        var x2 = parseInt($(circle2).css('left'), 10);
        var y2 = parseInt($(circle2).css('top'), 10);

        return this.getVectorCoordinates(x1, y1, x2, y2);
    },

    getPowerByDistance : function( distance ){

        return ( SPACING_VARIABLES['space'] / 4 ) / distance;
    }
}