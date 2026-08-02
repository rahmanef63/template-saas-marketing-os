"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { MapPin, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { Reveal } from "@/features/_shared/motion";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";

export function ContactPage() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  const contactEmail = settings?.contactEmail || c.email;
  const contactPhone = settings?.contactPhone || "+62 812 3456 7890";
  const contactAddress = settings?.contactAddress || "Jakarta, Indonesia";
  const submit = useMutation(api.leads.submit);
  const [submitted, setSubmitted] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const msg = String(data.get("msg") ?? "").trim();
    const message = [topic && `Topic: ${topic}`, msg].filter(Boolean).join("\n\n");
    setPending(true);
    try {
      await submit({ name, email, message: message || undefined });
      setSubmitted(true);
      toast.success("Thanks — we'll be in touch within a working day.");
    } catch {
      toast.error("Couldn't send that. Please email us instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section>
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-[1fr_1fr]">
        <div>
          <SectionHead
            eyebrow="Contact"
            title="Talk to a human"
            subtitle={`We answer every message — usually within a working day. Or email ${contactEmail} directly.`}
          />
          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail className="size-4" />
              <a href={`mailto:${contactEmail}`} className="hover:text-foreground">{contactEmail}</a>
            </p>
            <p className="flex items-center gap-2"><MessageCircle className="size-4" /> {contactPhone} (WA)</p>
            <p className="flex items-center gap-2"><MapPin className="size-4" /> {contactAddress}</p>
          </div>
          <div className="mt-8 space-y-3 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">Sales:</span> custom pricing, security review, MSA.</p>
            <p><span className="font-medium text-foreground">Support:</span> bugs, integration help, onboarding.</p>
            <p><span className="font-medium text-foreground">Press / partnerships:</span> reach the founders directly.</p>
          </div>
        </div>

        <Reveal variant="fade-left">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-lg border border-border/60 bg-card p-6"
        >
          {submitted ? (
            <div className="py-12 text-center">
              <p className="text-base font-medium">Got it — thanks!</p>
              <p className="mt-1 text-sm text-muted-foreground">We'll reply to you within one working day.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Jane Developer" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" name="email" type="email" required placeholder="jane@startup.example" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="topic">What's this about?</Label>
                <Input id="topic" name="topic" required placeholder="Volume pricing, security review, integration help…" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="msg">Message</Label>
                <Textarea id="msg" name="msg" rows={5} placeholder="A few sentences is plenty." />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Sending…" : "Send"}
              </Button>
            </>
          )}
        </form>
        </Reveal>
      </div>
    </section>
  );
}
