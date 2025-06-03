ALTER TABLE public.weekly_availabilities
    ADD CONSTRAINT start_of_week_is_sunday
    CHECK (EXTRACT(DOW FROM start_day) = 0);
