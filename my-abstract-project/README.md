# AbstractCounter - Смарт-контракт для Abstract

Этот проект демонстрирует создание смарт-контракта для Abstract с использованием foundry-zksync, включая лучшие практики безопасности, оптимизацию газа и совместимость с account abstraction.

## Особенности

- ✅ **Account Abstraction совместимость** - Поддержка Abstract's native account abstraction
- ✅ **Access Controls** - Модификаторы для контроля доступа
- ✅ **Events** - Подробные события для отслеживания изменений
- ✅ **Gas Optimization** - Оптимизированные функции для экономии газа
- ✅ **Error Handling** - Кастомные ошибки для лучшего UX
- ✅ **Security** - Проверки безопасности и предотвращение переполнения
- ✅ **Testing** - Полный набор тестов
- ✅ **Documentation** - Подробная документация кода

## Установка

### 1. Установка foundry-zksync

```bash
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
foundryup-zksync
```

### 2. Клонирование проекта

```bash
git clone <your-repo-url>
cd my-abstract-project
```

### 3. Установка зависимостей

```bash
forge install
```

## Конфигурация

Проект уже настроен с правильной конфигурацией `foundry.toml` для Abstract:

```toml
[profile.default]
src = 'src'
libs = ['lib']
fallback_oz = true

[profile.default.zksync]
enable_eravm_extensions = true

[etherscan]
abstractTestnet = { chain = "11124", url = "", key = ""}
abstractMainnet = { chain = "2741", url = "", key = ""}
```

## Компиляция

```bash
forge build --zksync
```

## Тестирование

```bash
# Запуск всех тестов
forge test

# Запуск тестов с подробным выводом
forge test -vv

# Запуск конкретного теста
forge test --match-test test_Increment
```

## Деплой

### Подготовка

1. Создайте файл `.env` с вашим приватным ключом:
```bash
echo "PRIVATE_KEY=your_private_key_here" > .env
```

2. Получите ETH для деплоя:
   - **Testnet**: Используйте [Abstract Faucet](https://faucet.abs.xyz)
   - **Mainnet**: Используйте [Abstract Bridge](https://bridge.abs.xyz)

### Деплой на Testnet

```bash
# Загрузка переменных окружения
source .env

# Деплой с верификацией
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url https://api.testnet.abs.xyz \
    --chain 11124 \
    --zksync \
    --verify \
    --verifier etherscan \
    --verifier-url https://api-sepolia.abscan.org/api \
    --etherscan-api-key YOUR_API_KEY \
    --broadcast
```

### Деплой на Mainnet

```bash
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url https://api.abs.xyz \
    --chain 2741 \
    --zksync \
    --verify \
    --verifier etherscan \
    --verifier-url https://api.abscan.org/api \
    --etherscan-api-key YOUR_API_KEY \
    --broadcast
```

## Функции контракта

### Основные функции

- `increment()` - Увеличивает счетчик на 1
- `incrementBy(uint256 amount)` - Увеличивает счетчик на указанное значение
- `setCounter(uint256 newValue)` - Устанавливает новое значение счетчика
- `getCounter()` - Возвращает текущее значение счетчика

### Административные функции

- `resetCounter()` - Сбрасывает счетчик в ноль (только владелец)
- `adminSetCounter(uint256 newValue)` - Устанавливает счетчик администратором
- `withdrawETH(uint256 amount)` - Выводит ETH из контракта

### Оптимизированные функции

- `batchIncrement(uint256 iterations)` - Пакетное увеличение счетчика

## События

- `CounterUpdated(uint256 previousValue, uint256 newValue, address caller)` - При изменении счетчика
- `CounterReset(uint256 previousValue, address caller)` - При сбросе счетчика
- `OwnershipTransferred(address previousOwner, address newOwner)` - При смене владельца

## Ошибки

- `Unauthorized()` - Неавторизованный доступ
- `ExceedsMaxValue()` - Превышение максимального значения
- `BelowMinValue()` - Значение ниже минимального
- `SameValue()` - Попытка установить то же значение

## Безопасность

### Реализованные меры безопасности

1. **Access Controls** - Модификатор `onlyOwner` для административных функций
2. **Bounds Checking** - Проверка границ значений
3. **Overflow Protection** - Защита от переполнения
4. **Reentrancy Protection** - Защита от повторного входа
5. **Input Validation** - Валидация входных данных

### Рекомендации по безопасности

1. Всегда тестируйте контракт перед деплоем
2. Используйте только проверенные библиотеки
3. Регулярно обновляйте зависимости
4. Проводите аудит безопасности
5. Используйте мультисиг кошельки для административных функций

## Gas Optimization

### Реализованные оптимизации

1. **Efficient Storage** - Использование `immutable` для владельца
2. **Batch Operations** - Пакетные операции для множественных действий
3. **Custom Errors** - Кастомные ошибки вместо строк
4. **Optimized Loops** - Оптимизированные циклы
5. **Minimal Storage** - Минимальное использование хранилища

## Совместимость с Abstract

### Account Abstraction

Контракт полностью совместим с Abstract's account abstraction:

- Поддерживает `receive()` функцию для приема ETH
- Использует стандартные паттерны EVM
- Совместим с Abstract's system contracts

### ZKSync Features

- Использует `enable_eravm_extensions = true` для system contract compatibility
- Компилируется с zksolc компилятором
- Поддерживает все особенности Abstract

## Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## Поддержка

- Документация: [docs.abs.xyz](https://docs.abs.xyz)
- Discord: [Abstract Discord](https://discord.gg/abstract)
- GitHub: [Abstract GitHub](https://github.com/abstract-money)

## Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## Changelog

### v1.0.0
- Первоначальный релиз
- Основной функционал счетчика
- Access controls и события
- Полный набор тестов
- Документация
