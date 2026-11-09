import { ProjectItem } from "@/data/portfolioData";

export function normalizeFirebaseProject(key: string, data: any): ProjectItem {
  let live = "";
  let github = "";

  if (data?.links) {
    if (Array.isArray(data.links)) {
      data.links.forEach((l: any) => {
        const label = String(l?.label || "").toLowerCase();
        const url = String(l?.url || "");
        if (label.includes("live") || label.includes("demo") || label.includes("site")) {
          live = url;
        } else if (label.includes("git") || label.includes("code") || label.includes("repo")) {
          github = url;
        }
      });
    } else if (typeof data.links === "object") {
      live = data.links.live || "";
      github = data.links.github || "";
    }
  }

  const category = data?.category || "Systems & Automation";
  const infra = data?.infra || "Cloudflare";
  const logo = data?.logo || data?.thumbnail || "/Logo v2.2.png";
  const showOnHome =
    data?.showOnHome !== undefined
      ? Boolean(data.showOnHome)
      : data?.featured !== undefined
      ? Boolean(data.featured)
      : true;

  const title = data?.title || "Untitled Project";
  const shortDesc = data?.shortDesc || data?.description || "";
  const tagline = data?.tagline || shortDesc || "Production system";
  const description = data?.description || shortDesc || "";
  const sortOrder =
    typeof data?.sortOrder === "number"
      ? data.sortOrder
      : !isNaN(Number(data?.sortOrder)) && data?.sortOrder !== null && data?.sortOrder !== undefined && data?.sortOrder !== ""
      ? Number(data.sortOrder)
      : undefined;

  return {
    id: data?.id || key,
    title,
    tagline,
    description,
    category,
    infra,
    tech: Array.isArray(data?.tech) ? data.tech : ["Full-Stack"],
    thumbnail: data?.thumbnail || logo,
    logo,
    gradient: data?.gradient || "",
    featured: showOnHome,
    showOnHome,
    sortOrder,
    links: { live, github },
    metrics: data?.metrics || (data?.size ? `${data.size} project` : undefined),
    story: data?.story
      ? {
          challenge: data.story.challenge || "",
          solution: data.story.solution || "",
          impact: data.story.impact || data.story.result || ""
        }
      : undefined
  };
}

export function mergeProjects(
  firebaseData: Record<string, any> | null | undefined,
  defaultProjects: ProjectItem[]
): ProjectItem[] {
  if (!firebaseData || Object.keys(firebaseData).length === 0) {
    return defaultProjects;
  }

  const firebaseItems: ProjectItem[] = [];
  const firebaseIds = new Set<string>();
  const firebaseTitles = new Set<string>();

  Object.entries(firebaseData).forEach(([key, value]) => {
    if (!value) return;
    const item = normalizeFirebaseProject(key, value);
    firebaseItems.push(item);
    if (item.id) firebaseIds.add(item.id.toLowerCase());
    if (item.title) firebaseTitles.add(item.title.toLowerCase().trim());
  });

  // Include default projects that are not already present in Firebase
  const nonOverriddenDefaults = defaultProjects.filter((dp) => {
    const idMatch = firebaseIds.has(dp.id.toLowerCase());
    const titleMatch = firebaseTitles.has(dp.title.toLowerCase().trim());
    return !idMatch && !titleMatch;
  });

  const allMerged = [...firebaseItems, ...nonOverriddenDefaults];

  return allMerged.sort((a, b) => {
    const orderA = typeof a.sortOrder === "number" ? a.sortOrder : 999;
    const orderB = typeof b.sortOrder === "number" ? b.sortOrder : 999;
    return orderA - orderB;
  });
}
