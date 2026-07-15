import { Facebook, Instagram, ChevronDown, Send, X, CheckCircle2, Users, Megaphone, UserPlus, Flag, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLang, useT } from "@/i18n/LanguageProvider";
import { MdBlock } from "@/hooks/useContentBlocks";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  megaphone: Megaphone,
  userplus: UserPlus,
  flag: Flag,
  shield: ShieldCheck,
};

export type SignupFormCopy = {
  heading?: string | null;
  iconKey?: string;
  introMd?: string | null; // overrides the two default paragraphs
  ctaLabel?: string | null;
  successMd?: string | null;
  anchorId?: string;
};

const SignupForm = ({ heading, iconKey, introMd, ctaLabel, successMd, anchorId = "prov-en-trening" }: SignupFormCopy) => {
  const t = useT();
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const Icon = ICONS[(iconKey || "users").toLowerCase()] ?? Users;
  const resolvedHeading = heading?.trim() || t("open.h");
  const resolvedCta = ctaLabel?.trim() || t("try.cta");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    if (trimmedName.length < 1 || trimmedName.length > 100 || trimmedContact.length < 3 || trimmedContact.length > 200) {
      setStatus("error");
      return;
    }
    const { data: inserted, error } = await supabase
      .from("training_signups")
      .insert({
        name: trimmedName,
        contact: trimmedContact,
        age_group: ageGroup || null,
        preferred_date: preferredDate.trim() || null,
        message: message.trim() || null,
        language: lang,
      })
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("Sign-up insert failed", error);
      setStatus("error");
      return;
    }
    void supabase.functions
      .invoke("notify-training-signup", {
        body: {
          signupId: inserted?.id ?? null,
          name: trimmedName,
          contact: trimmedContact,
          ageGroup: ageGroup || null,
          preferredDate: preferredDate.trim() || null,
          message: message.trim() || null,
          language: lang,
        },
      })
      .catch((err) => console.warn("Notification fan-out failed:", err));
    setStatus("success");
    setName(""); setContact(""); setAgeGroup(""); setPreferredDate(""); setMessage("");
  };

  const inputCls =
    "w-full rounded-lg bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 font-body focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition";

  return (
    <section id={anchorId} className="py-16 px-6 scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="text-primary mt-1">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-3">
              {resolvedHeading}
            </h3>
            {introMd?.trim() ? (
              <MdBlock md={introMd} className="mb-6" />
            ) : (
              <>
                <p className="text-muted-foreground font-body leading-relaxed mb-3">
                  {t("open.p1.pre")}<strong className="text-foreground">{t("open.p1.strong")}</strong>{t("open.p1.post")}
                </p>
                <p className="text-muted-foreground font-body leading-relaxed mb-6">
                  {t("open.p2")}
                </p>
              </>
            )}

            {status === "success" ? (
              <div className="flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/10 p-5">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                {successMd?.trim() ? (
                  <MdBlock md={successMd} />
                ) : (
                  <p className="font-body text-foreground">{t("try.success")}</p>
                )}
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4" noValidate>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                  aria-hidden={!expanded}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="space-y-4 pb-4">
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">
                        {t("try.note")}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.name")}</span>
                          <input type="text" required maxLength={100} value={name}
                            onChange={(e) => setName(e.target.value)} placeholder={t("try.namePh")}
                            aria-invalid={status === "error" && name.trim().length < 1}
                            className={inputCls} />
                        </label>
                        <label className="block">
                          <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.contact")}</span>
                          <input type="text" required maxLength={200} value={contact}
                            onChange={(e) => setContact(e.target.value)} placeholder={t("try.contactPh")}
                            aria-invalid={status === "error" && contact.trim().length < 3}
                            className={inputCls} />
                        </label>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.ageGroup")}</span>
                          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className={inputCls}>
                            <option value="">{t("try.ageGroupPh")}</option>
                            <option value="adult">{t("try.ageAdult")}</option>
                            <option value="youth">{t("try.ageYouth")}</option>
                          </select>
                        </label>
                        <label className="block">
                          <span className="block text-sm font-body text-muted-foreground mb-1.5">
                            {t("try.preferredDate")} <span className="text-muted-foreground/60">{t("try.optional")}</span>
                          </span>
                          <input type="text" maxLength={100} value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)} placeholder={t("try.preferredDatePh")}
                            className={inputCls} />
                        </label>
                      </div>
                      <label className="block">
                        <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.message")}</span>
                        <textarea rows={3} maxLength={1000} value={message}
                          onChange={(e) => setMessage(e.target.value)} placeholder={t("try.messagePh")}
                          className={inputCls + " resize-y min-h-[88px]"} />
                      </label>
                      {status === "error" && (
                        <p className="text-sm font-body text-destructive">
                          {t("try.errorPre")}
                          <a href="#coachene" className="underline decoration-destructive/40 hover:decoration-destructive">
                            {t("try.errorLink")}
                          </a>
                          {t("try.errorPost")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type={expanded ? "submit" : "button"}
                    onClick={expanded ? undefined : () => setExpanded(true)}
                    aria-expanded={expanded}
                    disabled={expanded && status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-heading font-bold px-6 py-3 min-w-[200px] hover:shadow-[0_0_12px_hsl(var(--primary)/0.6)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {expanded ? <Send className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {expanded
                      ? (status === "submitting" ? t("try.submitting") : t("try.submit"))
                      : resolvedCta}
                  </button>
                  <a href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
                    target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="text-muted-foreground hover:text-[#1877F2] hover:-translate-y-0.5 transition-all">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/tromsoflaggfotball/"
                    target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="text-muted-foreground hover:text-[#E1306C] hover:-translate-y-0.5 transition-all">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <button type="button" onClick={() => setExpanded(false)}
                    className={`ml-auto inline-flex items-center gap-1.5 font-heading font-medium text-primary hover:text-primary/80 hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)] transition-opacity duration-300 ${
                      expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    aria-hidden={!expanded} tabIndex={expanded ? 0 : -1}>
                    {t("try.close")}
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;