export const DEFAULT_PROJECT_IMAGE = "/media/GGI_22p0pt22p0pt22p0.png";

export const getProjectImage = (project) => {
  if (typeof project?.image === "string" && project.image.trim()) {
    return project.image;
  }

  return DEFAULT_PROJECT_IMAGE;
};