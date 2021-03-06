# Visualization Catalog Mock

The visualization catalog mock matches graphs with visualization functions and number of allowed data sources.

The following visualization functions are implemented: `"Comparisons"`, `"Data over time"`, `"Proportions"`, `"State"`, `"Relationships"`, `"Distribution"`, `"Location"`, `"Part to a whole"` and `"Patterns"`.

The following charts are implemented: `"Line Graph"`, `"Bar Chart"`, `"Pie Chart"`, `"Scatterplot"`, `"Dot Map"`, `"Boolean"` and `"Line and Bar Chart"`.

A chart object is defined by a name and associated visualization functions. The `functions property represents functions related to a chart when a single data source is applied to it. The `whenGroupedFunctions` property represents functions related to this chart when several data sources are applied to it.

Domain reference: http://datavizcatalogue.com/

## API

### GET /functions

Returns the catalog's list of visualization functions as an array of strings representing visualization functions.

### GET /charts

Returns the catalog's list of charts as an array of chart objects. Chart objects look like this way:
```
{
	"name": "Line Graph",
	"functions": ["Patterns", "Data over time"],
	"whenGroupedFunctions": ["Comparisons", "Relationships", "Patterns", "Data over time"]
}
```

### GET /ratedcharts

Returns matching charts according to given requirements. Expects "grouped" and "functions" query parameters.

Example: `GET /ratedcharts?grouped=true&functions=Comparisons-Proportions`

Expects grouped to define whether the chart has to handle multiple data sources or not.

Expects functions to represent a list of visualization functions where function identifiers are delimited by a '-' character.

Returns an array of charts sorted from the most matching to the less one according to a rating criteria. Example:
```
[
	{
		"name": "Line Graph",
		"rating": 4
	},
	{
		"name": "Dot Map",
		"rating": 5
	}
	...
]
```

#### Mock Specification

The mock has to fullfill the following requirements:
 1. Patterns and Data over time functions with one data source matches Line Graph as first result.
 2. Patterns, Data over time, Comparisons and Relationships functions with several data sources matches Line Graph as first result.
 3. Comparisons, Relationships and Patterns functions with one data source matches Bar Chart as first result.
 4. Comparisons, Relationships, Patterns and Distribution functions with several data sources matches Bar Chart as first result.
 5. Comparisons, Part to a whole and Porportions functions with one data source matches Pie Chart as first result.
 6. Patterns and Relationships functions with one data source matches Scatterplot as first result.
 7. Distribution, Location and Patterns functions with several data sources matches Line Graph as first result.
 8. Status function with one data source matches Boolean as first result.
 9. Distribution, Patterns, Data over time, Comparisons and Relationships functions with several data sources matches Line and Bar Chart as first result.

 This specification is guaranted by integration tests in `test/mockTest.js` file.

## Intallation

At the service root, run `npm install`, root privileges might be required depending on your operating system.

Run `node app.js` at the service root to launch the service.

## Tests

Run `mocha` to launch the test suites.