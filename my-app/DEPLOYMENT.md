# Деплой на GitHub Pages

## Автоматический деплой

Это приложение настроено для автоматического деплоя на GitHub Pages при каждом пуше в ветку `main`.

### Настройка GitHub Pages

1. Перейдите в настройки вашего репозитория на GitHub
2. Найдите раздел "Pages" в боковом меню
3. В разделе "Source" выберите "GitHub Actions"
4. Убедитесь, что у вас есть права на запись в репозиторий

### Локальная сборка

Для тестирования сборки локально:

```bash
cd my-app
pnpm install
pnpm run export
```

Собранные файлы будут в папке `out/`.

### Структура деплоя

- Приложение будет доступно по адресу: `https://[username].github.io/murmur/`
- Все статические файлы автоматически оптимизируются
- Изображения отключаются от оптимизации для совместимости с GitHub Pages

### Важные замечания

1. **Base Path**: Приложение настроено с base path `/murmur` для продакшена
2. **Статический экспорт**: Используется `output: 'export'` для создания статических файлов
3. **Trailing Slash**: Включены завершающие слеши для совместимости
4. **Кэширование**: Настроено кэширование pnpm для ускорения сборки

### Troubleshooting

Если деплой не работает:

1. Проверьте, что ветка называется `main` (не `master`)
2. Убедитесь, что у GitHub Actions есть права на запись
3. Проверьте логи сборки в разделе "Actions" на GitHub
4. Убедитесь, что все зависимости установлены корректно 