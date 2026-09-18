BEGIN;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS image VARCHAR(255);

-- Повторный запуск не добавляет дубликаты этих книг.
INSERT INTO public.books (title, price, is_active, image)
SELECT seed.title, seed.price, true, seed.image
FROM (VALUES
  ('Гарри Поттер и философский камень', 350, 'covers/harry-potter.svg'),
  ('Хоббит', 300, 'covers/hobbit.svg'),
  ('Маленький принц', 180, 'covers/little-prince.svg'),
  ('1984', 250, 'covers/1984.svg'),
  ('Маленькие женщины', 280, 'covers/little-women.svg'),
  ('Алиса в Стране чудес', 220, 'covers/alice.svg'),
  ('Остров сокровищ', 240, 'covers/treasure-island.svg'),
  ('Приключения Шерлока Холмса', 320, 'covers/sherlock.svg'),
  ('Робинзон Крузо', 260, 'covers/robinson.svg'),
  ('Джейн Эйр', 290, 'covers/jane-eyre.svg')
) AS seed(title, price, image)
WHERE NOT EXISTS (SELECT 1 FROM public.books b WHERE b.title = seed.title);
COMMIT;
