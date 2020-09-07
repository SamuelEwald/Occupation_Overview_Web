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

    ///// FUNCTION DECLARATIONS /////
    //General Functions
    self.main = main;
    self.setPageTitle = setPageTitle;
    self.drawOccupationLineChart = drawOccupationLineChart;

    //API Calls
    self.getOccupationOverviewData = getOccupationOverviewData;

    //Event Handlers

    //Listeners

    ///// CALL MAIN FUNCTION -- This kicks off the code  /////
    self.main();

    ///// FUNCTION DEFINITIONS /////
    function main() {
     
        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawOccupationLineChart);
    }

    function setPageTitle() {

    }

    function setOccupationOverviewModelData(){
        self.occupation(new Occupation(retrievedOccupationOverviewData.occupation))


        
    }

    function getOccupationOverviewData(args) {
        //args.requestData = {
            "occupation": "15-1131",
            "area_type": "msa",
            "area_code": "42660"
        }

      $.ajax({
        url: apiRoot + "a2cc3707-8691-4188-8413-6183a7bb3d32",
        data: 
        method: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
      }).done(function(retrievedOccupationOverviewData) {

        return JSON.parse(retrievedOccupationOverviewData)

      }).fail(function () {
        alert("API Failed to retrieve data.")
        return null;
      });
    }

    //Grabbed from https://jsfiddle.net/api/post/library/pure/
    function drawOccupationLineChart() {
      var data = new google.visualization.DataTable();
      data.addColumn("number", "X");
      data.addColumn("number", "Dogs");
      data.addColumn("number", "Cats");

      // Grabbed from https://stackoverflow.com/questions/35972095/google-charts-javascript-using-two-arrays-for-data-input-for-a-line-chart
      for (var i = 0; i < time.length; i++) {
        var row = [i, regional[i], state[i], nation[i]];
        data.addRow(row);
      }

      var options = {
        hAxis: {
          title: "Time",
        },
        vAxis: {
          title: "Popularity",
        },
        series: {
          1: { curveType: "function" },
        },
      };

      var chart = new google.visualization.LineChart(
        document.getElementById("chart_div")
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

      self.regional = ko.observable(jobsData.regional);

      self.nationalAvg = ko.observable(jobsData.national_avg);
    }

    function JobsGrowth(jobsGrowthData) {
      let self = this;

      self.startYear = ko.observable(jobsGrowthData.start_year);

      self.endYear = ko.observable(jobsGrowthData.end_year);

      self.regional = ko.observable(jobsGrowthData.regional);

      self.nationalAvg = ko.observable(jobsGrowthData.national_avg);
    }

    function Earnings(earningsData) {
      let self = this;

      self.regional = ko.observable(earningsData.regional);

      self.nationalAvg = ko.observable(earningsData.national_avg);
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
    var mappedIndustries = ko.utils.map(
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
