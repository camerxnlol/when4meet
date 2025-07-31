CREATE TABLE public.user_availability (
    id SERIAL PRIMARY KEY,
    username VARCHAR(8) UNIQUE NOT NULL, -- kerb
    available JSONB,
    if_needed JSONB
);
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;