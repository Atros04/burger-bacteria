function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var bbSamples = data.samples;
    var bbMetadata = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredBBSamples = bbSamples.filter(sampleID => sampleID.id == sample);
    console.log(filteredBBSamples)
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredBBMetadata = bbMetadata.filter(metaID => metaID.id == sample);
    console.log(filteredBBMetadata)
    // Create a variable that holds the first sample in the array.
    var firstFilteredSample = filteredBBSamples[0];
    // Create a variable that holds the first sample in the metadata array.
    var firstFilteredMetadata = filteredBBMetadata[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var firstOTUID = firstFilteredSample.otu_ids;
    var firstOTULabel = firstFilteredSample.otu_labels;
    var firstSampleValue = firstFilteredSample.sample_values;
    // Create a variable that holds the washing frequency.
    var firstWashing = firstFilteredMetadata.wfreq;
    // Create the yticks for the bar chart.
    var yticks = firstOTUID.slice(0,10).map(x => "OTU " + x.toString()).reverse();
    // Create the trace for the bar chart. 
    var barData = [{
      x: firstSampleValue.slice(0,10).reverse(),
      y: yticks,
      type: 'bar',
      orientation: 'h'
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
     title: 'Top 10 Bacteria Cultures Found',
     paper_bgcolor: '#deb887',
    };
    // Use Plotly to plot the data with the bar chart layout. 
    Plotly.newPlot('bar',barData,barLayout)
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: firstOTUID,
      y: firstSampleValue,
      text: firstOTULabel,
      mode: 'markers',
      marker: {
        color: firstOTUID,
        size: firstSampleValue,
        sizeref: .08,
        sizemode: 'area'
      }
    }];
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Types of Bacteria Found per Person',
      xaxis: {
        title: 'OTU ID'
      },
      hovermode: 'closest',
      paper_bgcolor: '#deb887'
    };
    // Use Plotly to plot the data with the bubble chart layout.
    Plotly.newPlot('bubble',bubbleData,bubbleLayout); 

    // Create the trace for the gauge chart.
    var gaugeData = [{
     domain: {x: [0, 1], y: [0, 1] },
     value: firstWashing,
     title: { text: "Belly Button Washing Frequency" },
     type: "indicator",
     mode: "gauge+number",
     gauge: {
      bar: { color: "black" },
      axis: {range: [null, 10]},
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange"},
        { range: [4, 6], color: 'yellow'},
        { range: [6, 8], color: 'lightgreen'},
        { range: [8, 10], color: 'green'}
    ]},
  }];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 450, 
      margin: { t: 0, b: 0 },
      paper_bgcolor: '#deb887'
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);
  });
}
