import { Facebook, Instagram, Phone, MapPin, Clock, Calendar, ExternalLink, ChevronDown, Flag } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.png";
import SpinningFootball from "@/components/SpinningFootball";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <img
            src={logo}
            alt="Tromsø Flaggfotball logo"
            className="w-40 h-40 md:w-56 md:h-56 mb-8 drop-shadow-2xl"
          />
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-2">
            TROMSØ
          </h1>
          <p className="font-heading text-xl md:text-2xl font-bold text-primary tracking-widest uppercase mb-4">
            Flaggfotball
          </p>
          <div className="w-16 h-px bg-primary/50 mb-4" />
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase">
            Arktisk flaggfotball · 69°N
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <SpinningFootball />
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Bli med på laget.
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            Vi er Tromsøs første flaggfotballklubb. Flaggfotball er en kontaktfri variant av
            amerikansk fotball — perfekt for alle aldre og nivåer. Åpne treninger hver mandag,
            ingen erfaring nødvendig.
          </p>
        </div>
      </section>

      {/* Treninger */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
              Treninger
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard icon={<Calendar className="w-5 h-5" />} label="Dag" value="Mandager" />
              <InfoCard icon={<Clock className="w-5 h-5" />} label="Tid" value="20:30 – 22:00" />
              <InfoCard icon={<MapPin className="w-5 h-5" />} label="Sted" value="Mellomvegen 110" />
            </div>
            <div className="mt-8 rounded-xl overflow-hidden border border-border aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500!2d18.955!3d69.6496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2sMellomvegen+110%2C+Troms%C3%B8!5e1!3m2!1sno!2sno!4v1700000000000"
                title="Mellomvegen 110, Tromsø"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lenker */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Kom i gang
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <LinkCard
              href="https://club.spond.com/landing/signup/naik/form/0A2A60617F184406B7FFEAA4EDC61409"
              title="Bli medlem"
              description="Meld deg inn i Amerikanske Idretters klubb via Spond."
            />
            <LinkCard
              href="https://amerikanskeidretter.no/forbund/klubbdrift/lisens-og-forsikring/#amerikansk-fotball-lisens"
              title="Lisens & forsikring"
              description="Forsikring for deltakere i flaggfotball via Min Idrett."
            />
            <LinkCard
              href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
              title="Facebook"
              description="Lik siden vår for aktuell info om treninger og arrangementer."
              icon={<Facebook className="w-5 h-5" />}
            />
            <LinkCard
              href="https://www.instagram.com/tromsoflaggfotball/"
              title="Instagram"
              description="Bilder og videoer fra trening og kamper."
              icon={<Instagram className="w-5 h-5" />}
            />
            <LinkCard
              href="https://flaggfotball.no"
              title="Flaggfotball.no"
              description="Lær mer om sporten, regler og turneringer i Norge."
              icon={<Flag className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            Se flaggfotball i aksjon
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6">
            Fanatics Flag Football Classic — Wildcats FFC vs. Team USA
          </p>
          <div className="aspect-video rounded-xl overflow-hidden border border-border">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/BqLI6k8HEk8"
              title="Wildcats vs Team USA – Fanatics Flag Football Classic"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>


      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Ofte stilte spørsmål
          </h2>
          <div className="space-y-3">
            <FaqItem
              q="Hva er flaggfotball?"
              a="Flaggfotball er en kontaktfri variant av amerikansk fotball. I stedet for tackling drar man av et flagg festet i beltet til motstanderen. Sporten er inkluderende, morsom og passer for alle — uansett kjønn eller erfaring."
            />
            <FaqItem
              q="Hvem kan være med?"
              a="Alle fra 16 år og oppover er velkommen! Ingen erfaring nødvendig — vi tilpasser treningene slik at alle kan delta og utvikle seg."
            />
            <FaqItem
              q="Trenger jeg erfaring?"
              a="Nei! Vi tar imot alle, fra nybegynnere til de med erfaring. Treningene er tilpasset slik at du lærer underveis."
            />
            <FaqItem
              q="Hva koster det?"
              a="Trening er helt gratis! Du trenger medlemskap i Amerikanske Idretters klubb (ca 80 kr) og lisens/forsikring via Min Idrett (ca 100 kr). Reiser og påmelding til kamper eller turneringer dekkes av den enkelte."
            />
            <FaqItem
              q="Hva trenger jeg å ta med?"
              a="Sportklær og joggesko. Alt annet utstyr har vi. Ta gjerne med en vannflaske."
            />
            <FaqItem
              q="Hvor mange er på et lag?"
              a="Flaggfotball spilles vanligvis 5 mot 5 på banen. Vi deler inn i lag på trening."
            />
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Kontakt
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ContactCard
              role="Coach"
              name="Espen Haukeland Kristensen"
              phone="958 48 889"
            />
            <ContactCard
              role="Ass. coach"
              name="Martin Sand Monsen"
              phone="952 99 706"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="font-heading text-sm font-bold text-muted-foreground">
              Tromsø Flaggfotball
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tromsø Flaggfotball
          </p>
        </div>
      </footer>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="text-primary mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">{label}</p>
      <p className="font-heading text-lg font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const LinkCard = ({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-card border border-border rounded-xl p-6 flex items-start gap-4 hover:border-primary/40 transition-colors"
  >
    <div className="text-primary mt-0.5">
      {icon || <ExternalLink className="w-5 h-5" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
        {title}
      </p>
      <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
    </div>
  </a>
);

const ContactCard = ({ role, name, phone }: { role: string; name: string; phone: string }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <p className="text-xs text-primary uppercase tracking-wider font-body mb-1">{role}</p>
    <p className="font-heading font-bold text-foreground text-lg">{name}</p>
    <a
      href={`tel:+47${phone.replace(/\s/g, "")}`}
      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-2 font-body text-sm"
    >
      <Phone className="w-4 h-4" />
      {phone}
    </a>
  </div>
);


const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-card border border-border rounded-xl p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold text-foreground">{q}</p>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-sm text-muted-foreground font-body mt-3 leading-relaxed">{a}</p>
      )}
    </button>
  );
};

export default Index;
