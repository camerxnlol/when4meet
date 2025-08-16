CREATE TABLE public.user_availability (
    id SERIAL PRIMARY KEY,
    username VARCHAR(8) UNIQUE NOT NULL, -- kerb
    available JSONB,
    if_needed JSONB
);
ALTER TABLE public.user_availability ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_user_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET last_availability_update = CURRENT_TIMESTAMP
    WHERE username = NEW.username;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_availability_change ON public.users;

CREATE TRIGGER on_availability_change
    AFTER INSERT OR UPDATE ON public.user_availability
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_update_timestamp();