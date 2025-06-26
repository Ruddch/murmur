# Session Keys Implementation

Этот проект демонстрирует использование сессионных ключей Abstract Global Wallet для создания бесшовного пользовательского опыта без необходимости подписывать каждую транзакцию.

## Что такое Session Keys?

Сессионные ключи - это временные ключи, которые позволяют выполнять предопределенный набор действий от имени Abstract Global Wallet без необходимости подписи владельцем каждой транзакции. Это особенно полезно для:

- Игр и приложений с частыми взаимодействиями
- Мобильных приложений
- Создания бесшовного пользовательского опыта

## Как это работает

1. **Создание сессии**: Пользователь создает сессионный ключ, который определяет:
   - Набор разрешенных действий (например, вызов функции `click` в контракте)
   - Аккаунт-подписчик, который может выполнять эти действия
   - Время истечения сессии
   - Лимиты на комиссии и использование

2. **Использование сессии**: После создания сессии, приложение может выполнять транзакции без запроса подписи у пользователя

3. **Истечение сессии**: Сессия автоматически истекает через заданное время или может быть отозвана пользователем

## Реализация в проекте

### Файлы

- `src/hooks/useSessionKey.ts` - Основной хук для работы с сессионными ключами
- `src/hooks/useClicker.ts` - Обновленный хук для интеграции с сессиями
- `src/components/game/ClickerGame.tsx` - Обновленный UI с поддержкой сессий
- `src/components/wallet/SessionKeyManager.tsx` - Отдельный компонент для управления сессиями

### Основные функции

```typescript
// Создание новой сессии
const createNewSession = async () => {
  // Генерирует новый приватный ключ для сессии
  // Создает сессию на 24 часа с лимитами
  // Использует Abstract Global Wallet API
  // Сохраняет в localStorage
  // Возвращает конфигурацию сессии
};

// Отзыв сессии
const revokeCurrentSession = async () => {
  // Отзывает сессию через Abstract Global Wallet
  // Удаляет сессию из localStorage
};

// Выполнение транзакции через сессию
const executeWithSession = async (functionName: 'click' | 'reset') => {
  // Использует sessionClient.writeContract для выполнения транзакции
  // Без запроса подписи у пользователя
  // Fallback на обычную транзакцию при ошибке
};
```

## Использование

### В компоненте игры

```typescript
const {
  sessionConfig,
  isSessionValid,
  isCreatingSession,
  createNewSession,
  revokeCurrentSession,
} = useClicker();

// Создание сессии
const handleCreateSession = async () => {
  try {
    await createNewSession();
  } catch (error) {
    console.error('Failed to create session:', error);
  }
};

// Клик с использованием сессии
const handleClick = () => {
  if (isConnected && click) {
    click(); // Автоматически использует сессию если доступна
  }
};
```

### UI элементы

- **Индикатор статуса сессии**: Показывает активна ли сессия
- **Кнопка создания сессии**: Создает новую сессию через Abstract Global Wallet
- **Кнопка отзыва сессии**: Отзывает текущую сессию
- **Информация о сессии**: Показывает детали сессии (лимиты, разрешенные функции, время истечения)

## Конфигурация сессии

Сессия настроена для работы с контрактом Clicker:

```typescript
const sessionConfig: SessionConfig = {
  signer: sessionSignerAccount.address, // Адрес сессионного подписчика
  expiresAt: BigInt(Math.floor(Date.now() / 1000) + 24 * 60 * 60), // 24 часа
  feeLimit: {
    limitType: LimitType.Lifetime,
    limit: BigInt(1000000000000000000), // 1 ETH lifetime gas limit
    period: BigInt(0),
  },
  callPolicies: [
    {
      target: CLICKER_ADDRESS,
      selector: toFunctionSelector("click()"),
      valueLimit: { limitType: LimitType.Unlimited, limit: BigInt(0), period: BigInt(0) },
      maxValuePerUse: BigInt(0),
      constraints: [],
    },
    {
      target: CLICKER_ADDRESS,
      selector: toFunctionSelector("reset()"),
      valueLimit: { limitType: LimitType.Unlimited, limit: BigInt(0), period: BigInt(0) },
      maxValuePerUse: BigInt(0),
      constraints: [],
    }
  ],
  transferPolicies: [],
};
```

## Архитектура сессионных ключей

### 1. Генерация сессионного подписчика
```typescript
const sessionPrivateKey = generatePrivateKey();
const sessionSignerAccount = privateKeyToAccount(sessionPrivateKey);
```

### 2. Создание сессионного клиента
```typescript
const sessionClient = agwClient.toSessionClient(sessionSigner, sessionConfig);
```

### 3. Выполнение транзакций
```typescript
const hash = await sessionClient.writeContract({
  address: CLICKER_ADDRESS,
  abi: CLICKER_ABI,
  functionName: 'click',
  chain: sessionClient.chain,
  account: sessionClient.account,
});
```

## Безопасность

- Сессии автоматически истекают через 24 часа
- Пользователь может отозвать сессию в любое время
- Сессии ограничены конкретными действиями (только функции `click` и `reset`)
- Установлены лимиты на комиссии (1 ETH lifetime)
- Приватный ключ сессии хранится в localStorage (в продакшене рекомендуется более безопасное хранение)
- Сессионный подписчик отличается от основного кошелька пользователя

## API интеграция

Проект использует официальные хуки Abstract Global Wallet:

- `useCreateSession` - для создания сессий
- `useRevokeSessions` - для отзыва сессий
- `useAbstractClient` - для получения Abstract клиента
- `toSessionClient` - для создания сессионного клиента
- `getSessionHash` - для получения хеша сессии

## Будущие улучшения

1. **Более безопасное хранение**: Использование зашифрованного хранилища для приватных ключей сессий
2. **Гранулярные разрешения**: Более детальная настройка разрешений для сессий
3. **Мониторинг сессий**: Отслеживание использования сессий и уведомления
4. **Множественные сессии**: Поддержка нескольких активных сессий
5. **Автоматическое обновление**: Автоматическое создание новых сессий при истечении
6. **Paymaster интеграция**: Использование paymaster для спонсирования газа

## Документация

Для получения дополнительной информации о сессионных ключах Abstract Global Wallet, посетите:
- [Session Keys Overview](https://docs.abs.xyz/abstract-global-wallet/session-keys/overview)
- [Going to Production](https://docs.abs.xyz/abstract-global-wallet/session-keys/going-to-production)
- [useCreateSession](https://docs.abs.xyz/abstract-global-wallet/agw-react/hooks/useCreateSession)
- [useRevokeSessions](https://docs.abs.xyz/abstract-global-wallet/agw-react/hooks/useRevokeSessions)
- [Official Examples](https://github.com/Abstract-Foundation/examples/tree/main/session-keys) 