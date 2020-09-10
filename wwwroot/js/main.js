"use strict";
(function () {
  ///NO CODE BEFORE THIS LINE

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
    self.pageTitle = ko.observable();
    self.occupation = ko.observable();
    self.region = ko.observable();
    self.summary = ko.observable();
    self.trendComparison = ko.observable();
    self.employingIndustries = ko.observable();

    ///// FUNCTION DECLARATIONS /////
    //General Functions
    self.main = main;
    self.drawOccupationLineChart = drawOccupationLineChart;

    //Setters
    self.setOccupationOverviewModelData = setOccupationOverviewModelData;
    self.setPageTitle = setPageTitle;

    //Getters

    //API Calls

    //Event Handlers

    //Listeners

    ///// PROMISE DEFINITIONS /////
    //Functions
    const getOccupationOverviewDataPromise = function (args) {
      if (args.requestData == null) {
        return null;
      }

      //Returns requested data as a resolved or rejected promise based on data received
      //Important for daisychaining reactions to receiving data
      return new Promise(function (resolve, reject) {
        $.ajax({
          url: apiRoot + "a2cc3707-8691-4188-8413-6183a7bb3d32",
          //data: args.requestData ,  //Current request specified by GUID
          method: "GET",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
        })
          .done(function (retrievedOccupationOverviewData) {
            resolve(retrievedOccupationOverviewData);
          })
          .fail(function (error) {
            console.log(error);
            alert("API Failed to retrieve data.");
            reject(false);
          });
      });
    };

    //Declarations
    self.getOccupationOverviewDataPromise = getOccupationOverviewDataPromise;

    ///// CALL MAIN FUNCTION -- This kicks off the code  /////
    self.main();

    ///// FUNCTION DEFINITIONS /////
    function main() {
      var requestArgs = {};
      requestArgs.requestData = JSON.stringify({
        occupation: "15-1131",
        area_type: "msa",
        area_code: "42660",
      });

      //Changes the title if the occupation changes
      self.occupation.subscribe(function(newValue){
        self.setPageTitle(newValue.title());
      })

      //Getting/Setting the model data and then once the model is binded, init and draw charts
      self
        .getOccupationOverviewDataPromise(requestArgs)
        .then(function (modelData) {
          self.setOccupationOverviewModelData(modelData);
        })
        .then(function () {
          google.charts.load("current", { packages: ["corechart", "line"] });
          google.charts.setOnLoadCallback(drawOccupationLineChart);
        })
        .catch(function (error) {
          console.log("The model data was not set");
          console.log("Error: " + error);
        });
    }

    function setPageTitle(newTitle) {
      let newTitleString = "Occupation Overview - " + newTitle;
      self.pageTitle(newTitleString);
    }

    function setOccupationOverviewModelData(modelData) {
      self.occupation(new Occupation(modelData.occupation));

      self.region(new Region(modelData.region));

      self.summary(new Summary(modelData.summary));

      self.trendComparison(new TrendComparison(modelData.trend_comparison));

      self.employingIndustries(
        new EmployingIndustries(modelData.employing_industries)
      );
    }

    //Grabbed from https://jsfiddle.net/api/post/library/pure/
    function drawOccupationLineChart() {
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Year")
      data.addColumn("number", "Region");
      data.addColumn("number", "State");
      data.addColumn("number", "Nation");

      //Grabbed from https://stackoverflow.com/questions/35972095/google-charts-javascript-using-two-arrays-for-data-input-for-a-line-chart
      let trendObject = self.trendComparison();

      for (var i = 0; i < trendObject.regional().length; i++) {
        var row = [trendObject.years()[i], trendObject.formattedRegional()[i], trendObject.formattedState()[i], trendObject.formattedNation()[i]];
        data.addRow(row);
      }

      
      //Chart Options and Formatting
      let chartDashStyle = [2, 2, 20, 2, 20, 2]; 
      
      var options = {
        vAxis: {
          title: "Percent Change",
        },
        hAxis: {
          minValue: trendObject.startYear(),
          maxValue: trendObject.endYear()
        }, 
        series: {
          0: { pointShape: 'circle', lineDashStyle: chartDashStyle },
          1: { pointShape: 'square', lineDashStyle: chartDashStyle },
          2: { pointShape: 'triangle', lineDashStyle: chartDashStyle },
        },
        pointSize: 8,
        colors: ['#142850','#1185c4','#abdafc'],
      
      };


      var chart = new google.visualization.LineChart(
        document.getElementById("OccupationLineChart")
      );
      chart.draw(data, options);
    }

    // ADD NEW FUNCTIONS ABOVE THIS COMMENT
  }

  ///// APPLY MVVM BINDINGS /////
  // Applying model to HTML element to enable dynamic page title
  $(document).ready(function () {
    ko.applyBindings(
      new OccupationOverviewViewModel(),
      document.getElementById("occupationOverviewHtml")
    );
  });

  ///// DATA MODEL DEFINITIONS /////
  function Occupation(occupationData) {
    var self = this;

    self.onet = ko.observable(occupationData.onet);

    self.title = ko.observable(occupationData.title);
  }

  function Region(regionData) {
    var self = this;

    self.type = ko.observable(regionData.type);

    self.id = ko.observable(regionData.id);

    self.title = ko.observable(regionData.title);
  }

  function Summary(summaryData) {
    var self = this;

    self.jobs = ko.observable(new Jobs(summaryData.jobs));

    self.jobsGrowth = ko.observable(new JobsGrowth(summaryData.jobs_growth));

    self.earnings = ko.observable(new Earnings(summaryData.earnings));

    //Nested models
    function Jobs(jobsData) {
      let self = this;

      self.year = ko.observable(jobsData.year);
      self.yearFormatted = ko.observable("Jobs(" + jobsData.year + ")");

      self.regional = ko.observable(jobsData.regional);
      self.regionalFormatted = ko.observable(NumberWithCommas(jobsData.regional));

      self.nationalAvg = ko.observable(jobsData.national_avg);

      //Calculates the % difference between region and national job quantities
      self.jobsRegionalNationalDifference = ko.computed(function(){
          return PercentageDifferenceBetweenTwoNumbers(self.regional(), self.nationalAvg(),2)
        });
        //Checks whether or not the regional jobs are higher than the national jobs
      self.jobsRegionalPositive = ko.computed(function () {
        return self.regional() >= self.nationalAvg() ? true : false;
      });
    }

    function JobsGrowth(jobsGrowthData) {
      let self = this;

      self.startYear = ko.observable(jobsGrowthData.start_year);

      self.endYear = ko.observable(jobsGrowthData.end_year);
      self.yearsFormatted = ko.observable("% Change("+self.startYear()+"-"+self.endYear()+")"); //Ex. % Change(2013-2020)

      self.regional = ko.observable(jobsGrowthData.regional);

      self.nationalAvg = ko.observable(jobsGrowthData.national_avg);

      self.regionalFormatted = ko.computed(function(){
        return FormatGrowthPercentage(self.regional()); //Ex. -20% OR +43%
      });
      self.nationalAvgFormatted = ko.computed(function(){
        return FormatGrowthPercentage(self.nationalAvg()); 
      });

    }

    function Earnings(earningsData) {
      let self = this;

      self.regional = ko.observable(earningsData.regional);
      self.regionalFormatted = ko.observable(FormatHourly(earningsData.regional));

      self.nationalAvg = ko.observable(earningsData.national_avg);
      self.nationalAvgFormatted = ko.observable("Nation:"+ FormatHourly(earningsData.national_avg));
     
    }
  }

  function TrendComparison(trendComparisonData) {
    var self = this;

    self.startYear = ko.observable(trendComparisonData.start_year);

    self.endYear = ko.observable(trendComparisonData.end_year);

    self.regional = ko.observableArray(trendComparisonData.regional);
    self.formattedRegional = ko.observableArray(GetArrayPercentChanged(trendComparisonData.regional));

    self.state = ko.observableArray(trendComparisonData.state);
    self.formattedState = ko.observableArray(GetArrayPercentChanged(trendComparisonData.state));

    self.nation = ko.observableArray(trendComparisonData.nation);
    self.formattedNation = ko.observableArray(GetArrayPercentChanged(trendComparisonData.nation));

    self.regionObject = ko.observable({});
    self.stateObject = ko.observable({});
    self.nationObject = ko.observable({});

    //Returns an array of all years starting with the start year and ending with the end year
    self.years = ko.computed(function(){
      let yearArray = [];
      let yearSpan = (self.endYear() - self.startYear() + 1); //Add one to account for the start year
      for(var i = 0; i < yearSpan; i++){
        yearArray.push(String(self.startYear()+i))
      }
      return yearArray
    });
  }


  function EmployingIndustries(employingIndustriesData) {
    var self = this;

    self.year = ko.observable(employingIndustriesData.year);

    self.jobs = ko.observable(employingIndustriesData.jobs);
    let totalOccupationJobs = self.jobs();

    self.industries = ko.observableArray();
    var mappedIndustries = ko.utils.arrayMap(
      employingIndustriesData.industries,
      function (item) {
        return new Industry(item);
      }
    );
    self.industries(mappedIndustries);

    //Nested models
    function Industry(industryData) {

      let self = this;

      self.niacs = ko.observable(industryData.niacs);

      self.title = ko.observable(industryData.title);

      self.inOccupationJobs = ko.observable(industryData.in_occupation_jobs);

      self.jobs = ko.observable(industryData.jobs);

      self.calculatedOccupationInIndustry = ko.computed(function(){
        return PercentageDifferenceBetweenTwoNumbers(self.inOccupationJobs(),totalOccupationJobs,1) + "%";
        
      });

      self.calculatedTotalJobsInIndustry = ko.computed(function(){
        return PercentageDifferenceBetweenTwoNumbers(self.inOccupationJobs(),self.jobs(),1)+ "%";
    });
    }
  }
})(); /// NO CODE AFTER THIS LINE
