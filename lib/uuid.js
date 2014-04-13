var uuid = require('node-uuid');

/**
 * Validate a UUID
 *
 * @param {string} id The UUID to validate
 *
 * @return {bool} Returns true if the UUID is a valid UUID
 */
uuid.validate = function(id) {
  if (!id)
    return false;

  var matches = id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  return !!(matches && matches.length == 1);
};
  
/**
 * Clean up a UUID
 *
 * Turns a UUID that is mixed case and without dashes into a lower case dashed
 * UUID
 *
 * @param {string} id The UUID to clean
 *
 * @return {string} Returns the clean UUID or null if id is not the correct
 *                  length
 */
uuid.clean = function(id) {
  if (id.length != 32 && id.length != 36)
    return null;

  return uuid.unparse(uuid.parse(id));
};

module.exports = uuid;
