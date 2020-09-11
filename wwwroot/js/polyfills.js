//Get the last item in an array
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

//Check if a number is positive
if (!Number.prototype.isPositive){
    Number.prototype.isPositive = function(){
        return this > 0 ? true : false;
    };
};