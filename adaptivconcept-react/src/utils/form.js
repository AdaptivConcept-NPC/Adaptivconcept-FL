/**
 * URL-encodes a data object.
 * @param {Object} data 
 * @returns {string}
 */
export const encodeNetlifyData = (data) => {
  return Object.keys(data)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]),
    )
    .join("&");
};

/**
 * Submits form data to Netlify.
 * @param {string} formName 
 * @param {Object} formFields 
 * @returns {Promise<Response>}
 */
export const submitToNetlify = (formName, formFields) => {
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeNetlifyData({ "form-name": formName, ...formFields }),
  });
};
