/**
 * Sanitize ID and Names so it won't break the viz tool
 *
 * @param {string} original
 * @returns {string}
 */
export function sanitizeID(original) {
  return original.replace(/[^a-zA-Z0-9\-\s]/gi, '');
}

/**
 * Find instances of a resource from its type and pair of attribute name=value.
 * Alternatively, a comparison Function can be used instead.
 *
 * @param state {any}
 * @param type {string}
 * @param attrName {string}
 * @param attrValue {string|Function}
 * @returns {any[]}
 */
export function attrSearch(state, type, attrName, attrValue) {
  const records = state.resources.filter((r) => r.type === type);
  if (!records || records.length === 0) return [];
  return records
    .map((record) => {
      return record.instances.map((instance) => {
        if (attrValue instanceof Function) {
          let property = instance.attributes[attrName];
          if (!(property instanceof Array)) property = [property];
          const filtered = property.filter(attrValue);
          if (filtered.length === 0) return null;
          const adjusted = { ...instance.attributes };
          adjusted[attrName] = filtered;
          return adjusted;
        } else {
          if (instance.attributes[attrName] === attrValue) return instance.attributes;
          else return null;
        }
      });
    })
    .flat(2)
    .filter((x) => !!x);
}

/**
 * Detect name from an instance attributes
 *
 * @param {any} attributes
 * @returns {string}
 */
export function nameSearch(attributes) {
  let title = '' + attributes.id;
  if (attributes.name) title = attributes.name;
  else if (attributes.function_name) title = attributes.function_name;
  else if (attributes.tags && attributes.tags.Name) title = attributes.tags.Name;
  return title;
}
