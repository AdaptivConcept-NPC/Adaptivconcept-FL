const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  const adminCode = process.env.ADMIN_ACCESS_CODE;
  const clientCode = event.headers["x-admin-code"];

  // Basic Auth
  if (!adminCode || clientCode !== adminCode) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized access parameters." }),
    };
  }

  const { httpMethod, path, body } = event;
  const store = getStore("admin_data");

  try {
    // LINKS BOARD
    if (path.endsWith("/links")) {
      if (httpMethod === "GET") {
        const links = await store.get("links", { type: "json" }) || [];
        return { statusCode: 200, body: JSON.stringify(links) };
      }
      if (httpMethod === "POST") {
        const newLinks = JSON.parse(body);
        await store.setJSON("links", newLinks);
        return { statusCode: 200, body: JSON.stringify({ message: "Links updated." }) };
      }
    }

    // STUBS (Projects/Blog)
    if (path.endsWith("/stubs")) {
      if (httpMethod === "GET") {
        // We can't easily read local files in the function without knowing the build output path
        // but for now we look for blob overrides
        const projects = await store.get("projects_stub", { type: "json" });
        const blog = await store.get("blog_stub", { type: "json" });
        return { 
          statusCode: 200, 
          body: JSON.stringify({ projects, blog }) 
        };
      }
      if (httpMethod === "POST") {
        const { type, data } = JSON.parse(body);
        if (type === "projects") await store.setJSON("projects_stub", data);
        if (type === "blog") await store.setJSON("blog_stub", data);
        return { statusCode: 200, body: JSON.stringify({ message: `${type} stub updated.` }) };
      }
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Endpoint not found." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
