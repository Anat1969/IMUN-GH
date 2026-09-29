# Supabase — image storage

- Project: **cultura-GH** (`ktqmwpbzcnzkhjskqisy`), shared with other apps.
- Bucket: `imun-images` (public read, 1MB per file, images only). File name = slot key, e.g. `lesson-1-cover`, `lesson-3-rule-2`, `home-cover`.
- Table: `public.imun_admin` — one row with the salted PBKDF2 hash of the admin password (RLS on, no policies).
- Edge function: `imun-images` (verify_jwt on) — `setup` / `check` / `upload` / `delete`, gated by the `x-admin-key` header.
- Reset the admin password: `delete from public.imun_admin;` then set a new one at `/admin`.
