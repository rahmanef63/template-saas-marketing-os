"use client";

import { type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SiteShell } from "@/features/_shared/ui/site-shell";
import { parseSocials } from "@/features/_shared/ui/site-footer";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import {
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  PUBLIC_BASE,
  PUBLIC_CTA,
  PUBLIC_NAV,
} from "@/features/_app/nav-config";

const c = DEFAULT_SITE_CONFIG;

/**
 * Public chrome (nav + footer) with owner branding applied at runtime — brand
 * name + uploaded logo come from Convex `siteSettings` (admin Settings /
 * onboarding), falling back to template defaults before load. Copyright keeps
 * the product name. Mirrors personal-brand-os so the landing reflects edits.
 */
export function PublicChrome({ children }: { children: ReactNode }) {
  const s = useQuery(api.settings.get);
  const brandName = s?.siteName || c.brandName;
  const brand = {
    brandLetter: brandName.charAt(0).toUpperCase() || c.brandLetter,
    brandName,
    logoUrl: s?.logoUrl,
    tagline: c.tagline,
    description: c.description,
    baseUrl: c.baseUrl,
    twitter: c.twitter,
    email: c.email,
    defaultLocale: c.defaultLocale,
    themeColor: c.themeColor,
  };
  const tagline = s?.tagline || FOOTER_TAGLINE;

  return (
    <SiteShell
      brand={brand}
      homeHref={PUBLIC_BASE}
      navItems={PUBLIC_NAV}
      cta={PUBLIC_CTA}
      navExtras={<ThemePresetSwitcher />}
      footerColumns={FOOTER_COLUMNS}
      footerTagline={tagline}
      footerSocials={parseSocials(s?.socials)}
      copyrightHolder={c.productName}
    >
      {children}
    </SiteShell>
  );
}
