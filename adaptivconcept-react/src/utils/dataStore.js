/**
 * Data Storage Utility
 * Handles fetching dynamic content from Netlify Blobs via the Admin API
 * with automatic fallback to local JSON stubs.
 */

import projectsLocal from "../data/projects.json";
import blogLocal from "../data/blog-posts.json";

const API_BASE = "/.netlify/functions/admin";

export const getProjects = async () => {
  try {
    const res = await fetch(`${API_BASE}/stubs`, {
      headers: { "x-admin-code": localStorage.getItem("admin_code") || "" }
    });
    const data = await res.json();
    return data.projects || projectsLocal;
  } catch (err) {
    console.warn("Using local project stubs:", err);
    return projectsLocal;
  }
};

export const getBlogPosts = async () => {
  try {
    const res = await fetch(`${API_BASE}/stubs`, {
      headers: { "x-admin-code": localStorage.getItem("admin_code") || "" }
    });
    const data = await res.json();
    return data.blog || blogLocal;
  } catch (err) {
    console.warn("Using local blog stubs:", err);
    return blogLocal;
  }
};

export const getLinks = async () => {
  try {
    const res = await fetch(`${API_BASE}/links`, {
      headers: { "x-admin-code": localStorage.getItem("admin_code") || "" }
    });
    if (!res.ok) throw new Error("Link fetch failed");
    return await res.json();
  } catch (err) {
    console.warn("Links board offline.");
    return [];
  }
};
