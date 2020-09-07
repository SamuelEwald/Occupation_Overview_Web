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

    function setPageTitle() {}

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
      data.addColumn("number", "X");
      data.addColumn("number", "Dogs");
      data.addColumn("number", "Cats");

      // Grabbed from https://stackoverflow.com/questions/35972095/google-charts-javascript-using-two-arrays-for-data-input-for-a-line-chart
      //   for (var i = 0; i < time.length; i++) {
      //     var row = [i, regional[i], state[i], nation[i]];
      //     data.addRow(row);
      //   }

      //   var options = {
      //     hAxis: {
      //       title: "Time",
      //     },
      //     vAxis: {
      //       title: "Popularity",
      //     },
      //     series: {
      //       1: { curveType: "function" },
      //     },
      //   };

      //   var chart = new google.visualization.LineChart(
      //     document.getElementById("chart_div")
      //   );
      //   chart.draw(data, options);
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

      self.nationalAvg = ko.observable(jobsData.national_avg);
      //Calculates the % difference between region and national job quantities
      self.jobsRegionalNationalDifference = ko.computed(function () {
          let jobDifference = self.regional() - self.nationalAvg();
          jobDifference = (jobDifference / self.nationalAvg()) * 100;
          return jobDifference;
      });

      self.jobsRegionalPositive = ko.computed(function () {
        return self.regional() >= self.nationalAvg() ? true : false;
      });
    }

    function JobsGrowth(jobsGrowthData) {
      let self = this;

      self.startYear = ko.observable(jobsGrowthData.start_year);

      self.endYear = ko.observable(jobsGrowthData.end_year);
      self.yearsFormatted = ko.observable("% Change("+self.startYear()+"-"+self.endYear()+")");

      self.regional = ko.observable(jobsGrowthData.regional);
   

      self.nationalAvg = ko.observable(jobsGrowthData.national_avg);

      self.regionalFormatted = ko.computed(function(){
        return self.regional() >  0 ? "+"+self.regional()+"%" :  "-"+self.regional()+"%";
      });
      self.nationalAvgFormatted = ko.computed(function(){
        return self.nationalAvg() > 0 ? "+"+self.nationalAvg()+"%" :  "-"+self.nationalAvg()+"%";
      });
    }

    function Earnings(earningsData) {
      let self = this;

      

      self.regional = ko.observable(earningsData.regional);
      self.regionalFormatted = ko.observable(FormatHourly(earningsData.regional));

      self.nationalAvg = ko.observable(earningsData.national_avg);
      self.nationalAvgFormatted = ko.observable("Nation:"+ FormatHourly(earningsData.national_avg));

      function FormatHourly(item){
        return "$"+item+"/hr"
      }
    }
  }

  function TrendComparison(trendComparisonData) {
    var self = this;

    self.startYear = ko.observable(trendComparisonData.start_year);

    self.endYear = ko.observable(trendComparisonData.end_year);

    self.regional = ko.observableArray();

    self.state = ko.observableArray();

    self.nation = ko.observableArray();
  }

  function EmployingIndustries(employingIndustriesData) {
    var self = this;

    self.year = ko.observable();

    self.jobs = ko.observable();

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

      self.title = ko.observable(industryData.titel);

      self.inOccupationJobs = ko.observable(industryData.in_occupation_jobs);

      self.jobs = ko.observable(industryData.jobs);
    }
  }
})(); /// NO CODE AFTER THIS LINE
