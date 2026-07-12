
ALTER TABLE public.content_blocks
  ADD COLUMN IF NOT EXISTS variant text NOT NULL DEFAULT 'markdown',
  ADD COLUMN IF NOT EXISTS data jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Re-map old anchor keys onto a global sort_order so sections live in one
-- shared ordering with the code-defined sections.
UPDATE public.content_blocks SET sort_order = CASE
    WHEN page = 'home' AND key = 'after-hero'      THEN 15
    WHEN page = 'home' AND key = 'after-training'  THEN 45
    WHEN page = 'home' AND key = 'after-positions' THEN 55
    WHEN page = 'home' AND key = 'after-faq'       THEN 95
    WHEN kind = 'section' AND key = 'end'          THEN 999
    ELSE sort_order
  END
  WHERE kind = 'section';
