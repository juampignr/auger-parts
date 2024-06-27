export const fieldRegex = {
    // Numeric Types
    INT: /^-?\d+$/,
    INTEGER: /^-?\d+$/,
    SMALLINT: /^-?\d+$/,
    TINYINT: /^-?\d+$/,
    MEDIUMINT: /^-?\d+$/,
    BIGINT: /^-?\d+$/,
    DECIMAL: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    DEC: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    NUMERIC: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    FIXED: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    FLOAT: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    DOUBLE: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    DOUBLE_PRECISION: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,
    REAL: /^[+-]?(\d+(\.\d*)?|\.\d+)$/,

    // Date and Time Types
    DATE: /^\d{4}-\d{2}-\d{2}$/,
    DATETIME: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    TIMESTAMP: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    TIME: /^\d{2}:\d{2}:\d{2}$/,
    YEAR: /^\d{4}$/,

    // String Types
    CHAR: /^[\s\S]*$/,  // Accepts any character (adjust as needed)
    VARCHAR: /^[\s\S]*$/,  // Accepts any character (adjust as needed)
    BINARY: /^[\s\S]*$/,  // Binary data
    VARBINARY: /^[\s\S]*$/,  // Binary data
    TINYBLOB: /^[\s\S]*$/,  // Binary data
    BLOB: /^[\s\S]*$/,  // Binary data
    MEDIUMBLOB: /^[\s\S]*$/,  // Binary data
    LONGBLOB: /^[\s\S]*$/,  // Binary data
    TINYTEXT: /^[\s\S]*$/,  // Text data
    TEXT: /^[\s\S]*$/,  // Text data
    MEDIUMTEXT: /^[\s\S]*$/,  // Text data
    LONGTEXT: /^[\s\S]*$/,  // Text data
    ENUM: /^[\s\S]*$/,  // Specific values, can be adjusted based on possible values
    SET: /^[\s\S]*$/,  // Specific values, can be adjusted based on possible values

    // Spatial Types
    GEOMETRY: /^[\s\S]*$/,  // Geometry data
    POINT: /^[\s\S]*$/,  // Point data
    LINESTRING: /^[\s\S]*$/,  // Linestring data
    POLYGON: /^[\s\S]*$/,  // Polygon data
    MULTIPOINT: /^[\s\S]*$/,  // Multipoint data
    MULTILINESTRING: /^[\s\S]*$/,  // Multilinestring data
    MULTIPOLYGON: /^[\s\S]*$/,  // Multipolygon data
    GEOMETRYCOLLECTION: /^[\s\S]*$/,  // Geometrycollection data

    // JSON Type
    JSON: /^[\s\S]*$/,  // JSON data
  }