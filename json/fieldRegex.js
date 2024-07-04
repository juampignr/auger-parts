export const fieldRegex = {
    // Numeric Types
    INT: '^-?\\d{MINIMUM,MAXIMUM}$',
    INTEGER: "^-?\\d{MINIMUM,MAXIMUM}$",
    SMALLINT: "^-?\\d{MINIMUM,MAXIMUM}$",
    TINYINT: "^-?\\d{MINIMUM,MAXIMUM}$",
    MEDIUMINT: "^-?\\d{MINIMUM,MAXIMUM}$",
    BIGINT: "^-?\\d{MINIMUM,MAXIMUM}$",
    DECIMAL: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    DEC: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    NUMERIC: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    FIXED: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    FLOAT: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    DOUBLE: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    DOUBLE_PRECISION: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",
    REAL: "^[+-]?(\\d+(\\.\\d*)?|\\.\\d+)$",

    // Date and Time Types
    DATE: "^\\d{4}-\\d{2}-\\d{2}$",
    DATETIME: "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$",
    TIMESTAMP: "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$",
    TIME: "^\\d{2}:\\d{2}:\\d{2}$",
    YEAR: "^\\d{4}$",

    // String Types
    CHAR: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Accepts any character (adjust as needed)
    VARCHAR: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Accepts any character (adjust as needed)
    BINARY: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Binary data
    VARBINARY: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Binary data
    TINYBLOB: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Binary data
    BLOB: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Binary data
    MEDIUMBLOB: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Binary data
    LONGBLOB: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Binary data
    TINYTEXT: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Text data
    TEXT: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Text data
    MEDIUMTEXT: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Text data
    LONGTEXT: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Text data
    ENUM: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Specific values, can be adjusted based on possible values
    SET: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Specific values, can be adjusted based on possible values

    // Spatial Types
    GEOMETRY: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Geometry data
    POINT: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Point data
    LINESTRING: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Linestring data
    POLYGON: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Polygon data
    MULTIPOINT: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Multipoint data
    MULTILINESTRING: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Multilinestring data
    MULTIPOLYGON: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Multipolygon data
    GEOMETRYCOLLECTION: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // Geometrycollection data

    // JSON Type
    JSON: "^[\\s\\S]{MINIMUM,MAXIMUM}$",  // JSON data
  }