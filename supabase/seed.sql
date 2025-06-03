INSERT INTO public.users
    (username, name)
VALUES
    ('shoji', 'Shoji Meguro'),
    ('kkondo', 'Koji Kondo'),
    ('vgo', 'VGO'),
    ('fractal161', 'Fractal Onesixone'),
    ('ianbgm', 'Big Man'),
    ('wardle', 'Brian Wardle');

INSERT INTO public.weekly_availabilities
    (user_id, start_day, availability)
VALUES
    (1, '2025-06-01', REPEAT('0', 336)),
    (2, '2025-06-01', REPEAT('1', 336)),
    (3, '2025-06-01', REPEAT('2', 336)),
    (4, '2025-06-01', REPEAT(REPEAT('0', 24) || REPEAT('1', 24), 7));
