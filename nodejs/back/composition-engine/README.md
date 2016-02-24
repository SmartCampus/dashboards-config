# Composition Engine

This service is responsible for matching needs with sensors and widget types.

The following needs are implemented: `"Comparison"`, `"Overtime"`, `"Proportion"`, `"See Status"`, `"Relationships"`, `"Hierarchy"`, `"Summarize"` and `"Pattern"`.

Existing widget type names: `"line"`, `"column"`, `"mix"`, `"pieChart"`, `"boolean"` and `"scatterplot"`.

## API

### POST /needSet

Returns matching sensor categories to given visualization needs.

Expects the request body to be set to a JSON array of strings representing needs.

Answers with an array of sensor sets (categories) matching the given needs. Sensor set format:

```
{
 "set": "category_name",
 "sensors": [{sensor object}]
}
```

Sensor objects are defined in the sensor container API.

Might send 400 status codes in case of incorrect needs or incompatible needs.

### POST /sensorSet

Handles POST requests on /sensorSet path. Returns matching needs to  the given sensors.

Expects the request body to be set to a JSON array of sensor objetcs. Sensor objects are defined in the sensor container API.

Answers with an array of strings representing needs matching the given sensors.

Might send 400 status codes in case of invalid sensors or invalid sensors categories.

### POST /expressNeeds

Handles POST requests on /expressNeed path. Returns matching widget types to given visualization needs.

Expects the request body to be set to a JSON array of strings representing needs.

Answers with a widget type name.

Might send 422 status codes in case of unprocessable inputs.