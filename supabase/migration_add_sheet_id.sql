-- Run this in Supabase SQL Editor (after the main schema.sql)
-- Adds the Google Sheet reference to each client

alter table clients
  add column google_sheet_id text,
  add column sheet_tab_name text default 'Sheet1'; -- change if your tab has a different name

comment on column clients.google_sheet_id is 'The ID from the Google Sheet URL: docs.google.com/spreadsheets/d/[THIS_PART]/edit';
