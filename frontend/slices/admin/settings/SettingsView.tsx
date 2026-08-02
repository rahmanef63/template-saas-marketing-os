"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { parseSocials } from "@/features/_shared/ui/site-footer";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { ImagePickerButton } from "@/features/image-picker";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import { ResetLandingCard } from "@/features/_shared/ui/reset-landing-card";

export function SettingsView() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const genUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getUrl);
  const [logoUrl, setLogoUrl] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [contactAddress, setContactAddress] = React.useState("");
  const [socialX, setSocialX] = React.useState("");
  const [socialLinkedin, setSocialLinkedin] = React.useState("");
  const [socialGithub, setSocialGithub] = React.useState("");
  const [socialYoutube, setSocialYoutube] = React.useState("");
  const [aboutHeadline, setAboutHeadline] = React.useState("");
  const [aboutBody, setAboutBody] = React.useState("");
  const [aboutImageUrl, setAboutImageUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (settings === undefined) return;
    setLogoUrl(settings?.logoUrl ?? "");
    setContactPhone(settings?.contactPhone ?? "");
    setContactAddress(settings?.contactAddress ?? "");
    const sc = parseSocials(settings?.socials);
    setSocialX(sc.x ?? "");
    setSocialLinkedin(sc.linkedin ?? "");
    setSocialGithub(sc.github ?? "");
    setSocialYoutube(sc.youtube ?? "");
    setAboutHeadline(settings?.aboutHeadline ?? "");
    setAboutBody(settings?.seoDescription ?? "");
    setAboutImageUrl(settings?.aboutImageUrl ?? "");
  }, [settings]);

  const onUpload = async (file: File): Promise<string> => {
    const uploadUrl = await genUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = (await res.json()) as { storageId: string };
    return ((await getFileUrl({ storageId: storageId as never })) as string) ?? "";
  };

  const saveLogo = async () => {
    setSaving(true);
    try {
      const socialsMap = Object.fromEntries(
        ([["x", socialX], ["linkedin", socialLinkedin], ["github", socialGithub], ["youtube", socialYoutube]] as const)
          .filter(([, v]) => v.trim()),
      );
      // Merge with current persisted values so we never wipe other settings.
      await upsert({
        siteName: settings?.siteName ?? c.brandName,
        tagline: settings?.tagline ?? c.tagline,
        ownerName: settings?.ownerName ?? c.productName,
        contactEmail: settings?.contactEmail ?? c.email,
        contactPhone: contactPhone || undefined,
        contactAddress: contactAddress || undefined,
        brandColor: settings?.brandColor ?? c.themeColor,
        socials: Object.keys(socialsMap).length ? JSON.stringify(socialsMap) : undefined,
        logoUrl,
        aboutHeadline: aboutHeadline || undefined,
        seoDescription: aboutBody || undefined,
        aboutImageUrl: aboutImageUrl || undefined,
      });
      toast.success("Settings tersimpan");
    } catch {
      toast.error("Gagal menyimpan settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Workspace Settings</h1>
        <p className="text-sm text-muted-foreground">
          Identitas situs disimpan di Convex (diisi lewat wizard onboarding). Default
          template ada di components/templates/saas-marketing/shared/site-config.ts.
        </p>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Logo</h3>
          <p className="text-sm text-muted-foreground">
            Logo brand tampil di header situs publik. Kosongkan untuk pakai wordmark teks.
          </p>
          <div className="flex items-center gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-12 w-auto rounded-md border border-border/60 object-contain"
              />
            ) : (
              <span className="grid size-12 place-items-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground">
                Kosong
              </span>
            )}
            <ImagePickerButton
              label={logoUrl ? "Ganti logo" : "Upload logo"}
              title="Logo"
              onUpload={onUpload}
              searchUnsplash={undefined}
              onChange={(img) => setLogoUrl(img?.value ?? "")}
            />
          </div>
          <h3 className="pt-2 text-base font-medium">Social links</h3>
          <p className="text-sm text-muted-foreground">
            Hanya platform yang diisi URL-nya yang muncul di footer situs publik.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">X / Twitter URL</Label>
              <Input value={socialX} onChange={(e) => setSocialX(e.target.value)} placeholder="https://x.com/username" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
              <Input value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">GitHub URL</Label>
              <Input value={socialGithub} onChange={(e) => setSocialGithub(e.target.value)} placeholder="https://github.com/username" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">YouTube URL</Label>
              <Input value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/@username" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="gap-1" onClick={saveLogo} disabled={saving}>
              <Save className="size-4" /> {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Contact info</h3>
          <p className="text-sm text-muted-foreground">
            Telepon/WhatsApp dan alamat tampil di halaman /contact publik. Email kontak diisi lewat wizard onboarding.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Telepon / WhatsApp</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+62 812 3456 7890" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Alamat</Label>
              <Input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} placeholder="Jl. ... , Kota" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="gap-1" onClick={saveLogo} disabled={saving}>
              <Save className="size-4" /> {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">About page</h3>
          <p className="text-sm text-muted-foreground">
            Headline, bio, dan foto tampil di bagian atas halaman /about publik.
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Judul / headline</Label>
            <Input value={aboutHeadline} onChange={(e) => setAboutHeadline(e.target.value)} placeholder="Built by a small distributed team" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Bio / intro</Label>
            <Textarea value={aboutBody} onChange={(e) => setAboutBody(e.target.value)} rows={3} placeholder="Tell visitors about your team…" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Foto</Label>
            <div className="flex items-center gap-4">
              {aboutImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aboutImageUrl} alt="About" className="size-16 rounded-lg border border-border/60 object-cover" />
              ) : (
                <span className="grid size-16 place-items-center rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
                  Kosong
                </span>
              )}
              <ImagePickerButton
                label={aboutImageUrl ? "Ganti foto" : "Upload foto"}
                title="Foto About"
                onUpload={onUpload}
                searchUnsplash={undefined}
                onChange={(img) => setAboutImageUrl(img?.value ?? "")}
              />
              {aboutImageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setAboutImageUrl("")}>
                  Hapus
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="gap-1" onClick={saveLogo} disabled={saving}>
              <Save className="size-4" /> {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="space-y-3 p-6 text-sm">
          <Row k="Brand"          v={settings?.siteName || c.brandName} />
          <Row k="Product"        v={settings?.siteName || c.productName} />
          <Row k="Tagline"        v={settings?.tagline || c.tagline} />
          <Row k="Owner"          v={settings?.ownerName || c.productName} />
          <Row k="Domain"         v={c.baseUrl}     mono />
          <Row k="Email"          v={settings?.contactEmail || c.email} mono />
          <Row k="Twitter"        v={c.twitter}     mono />
          <Row k="Locale"         v={c.defaultLocale} />
          <Row k="Theme color"    v={settings?.brandColor || c.themeColor}  mono />
          <Row k="Primary CTA"    v={c.ctaPrimary.label} />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="flex items-center justify-between gap-4 p-5 text-sm">
          <div>
            <p className="font-medium text-foreground">Appearance</p>
            <p className="text-muted-foreground">
              Pick display mode (light/dark/system) + a color preset. Saved in
              the browser, applies across the whole dashboard &amp; public site.
            </p>
          </div>
          <ThemePresetSwitcher />
        </CardContent>
      </Card>

      <ResetLandingCard />

      <div className="grid gap-4 md:grid-cols-2">
        <UpdateCard />
        <BackupCard />
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      {mono ? <span className="font-mono">{v}</span> : <Badge variant="outline">{v}</Badge>}
    </div>
  );
}
