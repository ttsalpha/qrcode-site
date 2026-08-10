import type { Metadata } from "next";

export const SITE_URL = "https://qrcode.ttsalpha.com";
export const SITE_NAME = "@ttsalpha/qrcode";

// `url` is the entity's own home, `sameAs` the profiles that resolve to it
export const AUTHOR = {
  "@type": "Person",
  name: "Son Tran",
  url: "https://ttsalpha.com",
  sameAs: ["https://github.com/ttsalpha", "https://www.npmjs.com/~ttsalpha"],
} as const;

/** Home > Page trail, so the SERP shows a breadcrumb instead of a bare URL */
export function breadcrumb(path: string, name: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
}

/**
 * Next replaces a whole metadata field instead of deep-merging it, so a page
 * setting `openGraph` or `twitter` drops the layout's `type`, `siteName`, `card`
 * and `creator`, which downgrades the X card to a thumbnail. Built here so every
 * page keeps them.
 */
export function pageMetadata({
  title,
  titleAbsolute,
  description,
  path,
  keywords,
}: {
  /** Page title, run through the layout's "%s | @ttsalpha/qrcode" template */
  title?: string;
  /** Full title, used as-is instead of the template */
  titleAbsolute?: string;
  description: string;
  /** Route path, e.g. "/reference" */
  path: string;
  keywords?: string[];
}): Metadata {
  const socialTitle = titleAbsolute ?? `${title} | ${SITE_NAME}`;

  return {
    title: titleAbsolute ? { absolute: titleAbsolute } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@ttsalpha",
      title: socialTitle,
      description,
    },
  };
}
