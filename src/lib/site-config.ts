const repository = process.env.GITHUB_REPOSITORY;

function getRepositoryParts() {
  if (!repository) {
    return null;
  }

  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
}

export function getBasePath() {
  const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
  if (configuredBasePath) {
    return configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/$/, "");
  }

  const repoParts = getRepositoryParts();
  if (!repoParts) {
    return "";
  }

  const { owner, repo } = repoParts;
  return repo === `${owner}.github.io` ? "" : `/${repo}`;
}

export function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  const repoParts = getRepositoryParts();
  if (!repoParts) {
    return "https://example.com";
  }

  const { owner, repo } = repoParts;
  return repo === `${owner}.github.io`
    ? `https://${owner}.github.io`
    : `https://${owner}.github.io/${repo}`;
}

export const siteConfig = {
  basePath: getBasePath(),
  siteUrl: getSiteUrl(),
};
