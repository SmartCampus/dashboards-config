# Composition Engine

This service is responsible for matching needs with sensors and widget types.

The following needs are implemented: `"Comparisons"`, `"Data over time"`, `"Proportions"`, `"State"`, `"Relationships"`, `"Distribution"`, `"Part to a whole"`, `"Location"` and `"Patterns"`.

Existing widget type names: `"line"`, `"column"`, `"mix"`, `"pieChart"`, `"boolean"` and `"scatterplot"`.

Domain reference: [datavizcatalogue][http://datavizcatalogue.com/]

See Visualization Catalog mock [README][visualization-catolog/README.md] for more information.

## API

### POST /composition_data

Returns generation possibilities according to given composition data.

Composition data is composed by a set of visualization needs and a set of sensors objects. Example:
```
{
	"needs": 	["Comparisons", "Data over time"],
	"sensors": 	[{sensor object 1}, {sensor object 2}]
}
```

Generation possibilities is an object containing a set of compatible
visualization needs, a boolean pointing out if other data sources can be added and a set of compatible widgets. When no matching widget can be found, the sets are returned empty. Example:
```
{
	"needs": 	["Patters", "Relationships", "Distribution"],
	"acceptMoreSensors": true,
	"widgets": 	["line", "bar"]
}
```

Sensor objects are defined by the sensor containers API service.

Can set 400 HTTP status code in case of bad formatted input data.

## Intallation

At the service root, run `npm install`, root privileges might be required depending on your operating system.

Run `node app.js` at the service root to launch the service.

## Tests

Run `mocha` to launch the test suites.