-- Supabase Schema - ALL DATA PUBLIC
-- Run this in your Supabase project's SQL Editor
-- (Database > SQL Editor > New Query)

-- =============================================================================
-- USERS Table
-- ID is manually managed.
-- =============================================================================
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    last_availability_update TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
COMMENT ON COLUMN public.users.last_availability_update IS 'Automatically updated via trigger';

CREATE OR REPLACE FUNCTION public.handle_user_update_timestamp()
RETURNS TRIGGER AS $$
DECLARE
    affected_user_id INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        affected_user_id = OLD.user_id;
    ELSE
        affected_user_id = NEW.user_id;
    END IF;

    UPDATE public.users
    SET last_availability_update = CURRENT_TIMESTAMP
    WHERE id = affected_user_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER on_availability_change
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_update_timestamp();

CREATE TABLE public.weekly_availabilities (
    user_id INTEGER NOT NULL,
    start_day DATE NOT NULL,
    availability BYTEA,
    PRIMARY KEY (user_id, start_day),
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE public.weekly_availabilities ENABLE ROW LEVEL SECURITY;
COMMENT ON COLUMN public.weekly_availabilities.availability IS 'Each byte stores availability for the corresponding 30-minute interval';

CREATE TABLE public.events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT chk_event_times CHECK (end_time >= start_time)
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.event_users (
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE public.event_users ENABLE ROW LEVEL SECURITY;

-- access policies
CREATE POLICY "Public can read users"
    ON public.users FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "Public has full access to events"
    ON public.events FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public can read availabilities"
    ON public.weekly_availabilities FOR SELECT
    TO anon
    USING (true);
CREATE POLICY "Public can insert availabilities"
    ON public.weekly_availabilities FOR INSERT
    TO anon
    WITH CHECK (true);
CREATE POLICY "Public can update availabilities"
    ON public.weekly_availabilities FOR UPDATE
    TO anon
    USING (true);

CREATE POLICY "Public has full access to event_users"
  ON public.event_users FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
