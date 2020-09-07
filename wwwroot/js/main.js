(function () { ///NO CODE BEFORE THIS LINE

    ///// LOCAL VARIABLES /////


    ///// LOCAL FUNCTIONS /////


    ///// URL Parameters /////


    function OccupationOverviewViewModel() {
		self = this;
        ///// VARIABLE DECLARATIONS /////
        //Objects
        self.occupationLineChartColumns = ko.observableArray();

        //Conditionals

        //Values
        self.pageTitle = ko.observable()



        ///// FUNCTION DECLARATIONS /////
        //General Functions
        self.main = main;
        self.setPageTitle = setPageTitle;
        self.drawOccupationLineChart = drawOccupationLineChart;
		
        //API Calls

        //Event Handlers

        //Listeners



        ///// CALL MAIN FUNCTION -- This kicks off the code  /////
		self.main()



        ///// FUNCTION DEFINITIONS /////
		function main() {

            //google.charts.load('current', {packages: ['corechart', 'line']});
            //google.charts.setOnLoadCallback(drawOccupationLineChart);
			
        }
        
        function setPageTitle(){

        }

        //Grabbed from https://jsfiddle.net/api/post/library/pure/
        function drawOccupationLineChart(){
            
        }

        // ADD NEW FUNCTIONS ABOVE THIS COMMENT
    }


    ///// APPLY MVVM BINDINGS /////
    $(document).ready(function () {
        ko.applyBindings(new OccupationOverviewViewModel());
    }

    ///// DATA MODEL DEFINITIONS /////


}()); /// NO CODE AFTER THIS LINE