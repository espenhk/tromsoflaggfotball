import { useRef } from "react";
import { Instagram, Facebook, ChevronLeft, ChevronRight, ExternalLink, Heart, MessageCircle } from "lucide-react";

export type SocialPost = {
  id: string;
  source: "ig" | "fb";
  image: string;
  caption: string;
  permalink: string;
  timestamp: string; // ISO
  likes?: number;
  comments?: number;
};

// Mock data — replace with API-fed posts later.
export const mockPosts: SocialPost[] = [
  {
    id: "1",
    source: "ig",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
    caption: "Stor innsats på treninga i kveld! 🏈 #flaggfotball #tromsø",
    permalink: "https://instagram.com/p/example1",
    timestamp: "2026-05-30T18:00:00Z",
    likes: 47,
    comments: 4,
  },
  {
    id: "2",
    source: "fb",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80",
    caption: "Påmeldingen til høstsesongen er åpen! Bli med på en av de raskest voksende lagidrettene i Norge.",
    permalink: "https://facebook.com/example/posts/2",
    timestamp: "2026-05-28T10:00:00Z",
    likes: 132,
    comments: 18,
  },
  {
    id: "3",
    source: "ig",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    caption: "Touchdown! 🎉 Kampbilder fra helgens turnering kommer snart.",
    permalink: "https://instagram.com/p/example3",
    timestamp: "2026-05-25T20:30:00Z",
    likes: 89,
    comments: 7,
  },
  {
    id: "4",
    source: "fb",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
    caption: "Velkommen til nye spillere! Første trening er gratis — møt opp på Templarheimen.",
    permalink: "https://facebook.com/example/posts/4",
    timestamp: "2026-05-22T09:15:00Z",
    likes: 64,
    comments: 2,
  },
  {
    id: "5",
    source: "ig",
    image: "https://images.unsplash.com/photo-1495563381401-ecfbcaaa60f2?w=800&q=80",
    caption: "Coachens hjørne: Slik leser du forsvaret som en proff QB 🧠",
    permalink: "https://instagram.com/p/example5",
    timestamp: "2026-05-20T17:00:00Z",
    likes: 211,
    comments: 23,
  },
  {
    id: "6",
    source: "ig",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    caption: "Sommercamp 2026 — datoer slippes neste uke. Følg med!",
    permalink: "https://instagram.com/p/example6",
    timestamp: "2026-05-18T12:00:00Z",
    likes: 156,
    comments: 11,
  },
];

const formatDate = (iso: string, lang: string = "no") => {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "no" ? "nb-NO" : "en-US", {
    day: "numeric",
    month: "short",
  });
};

type Props = {
  posts?: SocialPost[];
  title?: string;
  subtitle?: string;
};

const SocialFeedCarousel = ({
  posts = mockPosts,
  title = "Følg oss på sosiale medier",
  subtitle = "Siste poster fra Instagram og Facebook",
}: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="py-16 px-6 bg-card/50 scroll-mt-16" id="sosialt">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              aria-label="Forrige"
              onClick={() => scrollBy(-1)}
              className="p-2 rounded-full bg-background/60 border border-border hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Neste"
              onClick={() => scrollBy(1)}
              className="p-2 rounded-full bg-background/60 border border-border hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-thin"
          style={{ scrollbarWidth: "thin" }}
        >
          {posts.map((post) => (
            <SocialPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialPostCard = ({ post }: { post: SocialPost }) => {
  const isIg = post.source === "ig";
  const Icon = isIg ? Instagram : Facebook;
  const sourceLabel = isIg ? "Instagram" : "Facebook";
  const accent = isIg ? "text-pink-400" : "text-sky-400";
  const glow = isIg
    ? "hover:shadow-[0_0_24px_hsl(var(--primary)/0.25)]"
    : "hover:shadow-[0_0_24px_hsl(var(--primary)/0.25)]";

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      data-card
      className={`group flex-none w-[280px] md:w-[320px] snap-start bg-background/60 border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${glow}`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={post.image}
          alt={post.caption.slice(0, 80)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm ${accent}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{sourceLabel}</span>
        </div>
        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-foreground line-clamp-3 min-h-[3.75rem]">
          {post.caption}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {post.likes !== undefined && (
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> {post.likes}
              </span>
            )}
            {post.comments !== undefined && (
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
              </span>
            )}
          </div>
          <span>{formatDate(post.timestamp)}</span>
        </div>
      </div>
    </a>
  );
};

export default SocialFeedCarousel;