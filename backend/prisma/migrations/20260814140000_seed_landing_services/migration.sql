INSERT INTO "services" (
  "id",
  "name",
  "slug",
  "shortDescription",
  "type",
  "basePrice",
  "createdAt",
  "updatedAt",
  "deletedAt"
)
VALUES
  ('10000000-0000-4000-8000-000000000001', 'SEO', 'seo', 'Rank higher and drive high-quality organic traffic with data-driven SEO.', 'RETAINER', 5000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('10000000-0000-4000-8000-000000000002', 'Google Ads', 'google-ads', 'Generate qualified leads with high-converting Google Ads campaigns.', 'RETAINER', 8000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('10000000-0000-4000-8000-000000000003', 'Meta Ads', 'meta-ads', 'Scale with targeted Facebook and Instagram advertising campaigns.', 'RETAINER', 4999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('10000000-0000-4000-8000-000000000004', 'Website Design', 'website-design', 'Build a fast, responsive, and conversion-focused business website.', 'ONE_TIME', 14999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('10000000-0000-4000-8000-000000000005', 'E-Commerce', 'ecommerce', 'Launch and grow a high-performing online store built for conversions.', 'ONE_TIME', 19999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('10000000-0000-4000-8000-000000000006', 'Video Editing', 'video-editing', 'Create polished videos, reels, and motion graphics that hold attention.', 'RETAINER', 5999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
  ('10000000-0000-4000-8000-000000000007', 'Graphic Design', 'graphic-design', 'Create distinctive digital and print visuals for every marketing channel.', 'RETAINER', 5999, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "shortDescription" = EXCLUDED."shortDescription",
  "type" = EXCLUDED."type",
  "basePrice" = EXCLUDED."basePrice",
  "updatedAt" = CURRENT_TIMESTAMP,
  "deletedAt" = NULL;
