# 🎯 Habit Tracker App

A comprehensive habit tracking application built with React Native, Expo, and Convex. Build better habits, track your progress, and achieve your goals with beautiful visualizations and detailed analytics.

## ✨ Features

### 🧩 Core Features

- **Habit Creation**: Create habits with custom names, descriptions, colors, and emojis
- **Flexible Scheduling**: Set habits for daily, weekly, or custom days
- **Daily Check-In**: Mark habits as complete with a simple tap
- **Streak Tracking**: Monitor current and longest streaks with visual feedback
- **Progress Visualization**: View habit completion with charts and analytics
- **Retroactive Tracking**: Mark habits as complete for previous days

### 📊 Analytics & Insights

- **Progress Charts**: Weekly and monthly completion rate visualization
- **Habit Analytics**: Individual habit statistics and performance
- **Achievement System**: Earn badges for consistency and milestones
- **Perfect Days**: Track days with 100% habit completion
- **Success Rates**: Detailed completion percentage tracking

### 🔔 Smart Notifications

- **Daily Reminders**: Customizable notification times
- **Achievement Celebrations**: Get notified when you hit milestones
- **Streak Alerts**: Stay motivated with streak notifications

### 💾 Data Management

- **Offline-First**: Works without internet connection
- **Real-time Sync**: Automatic synchronization with Convex backend
- **Data Export**: Export your data to CSV format
- **Backup & Recovery**: Secure cloud backup options

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Convex (real-time database)
- **State Management**: Convex React hooks
- **Navigation**: Expo Router
- **Charts**: React Native Chart Kit
- **Notifications**: Expo Notifications
- **Storage**: Convex with offline support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Convex**

   ```bash
   npx convex dev
   ```

   This will:

   - Create a new Convex project
   - Set up the database schema
   - Generate the necessary configuration files

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your Convex deployment URL.

5. **Start the development server**

   ```bash
   pnpm start
   ```

6. **Run on device/emulator**
   - iOS: Press `i` in the terminal or scan QR code with Camera app
   - Android: Press `a` in the terminal or scan QR code with Expo Go app

## 📱 App Structure

```
app/
├── (tabs)/                 # Main tab navigation
│   ├── index.tsx          # Today's habits screen
│   ├── habits.tsx         # All habits management
│   ├── analytics.tsx      # Progress analytics
│   └── settings.tsx       # App settings
├── _layout.tsx            # Root layout with providers
└── +not-found.tsx         # 404 page

convex/                    # Backend functions and schema
├── schema.ts              # Database schema
├── habits.ts              # Habit CRUD operations
├── completions.ts         # Completion tracking
└── analytics.ts           # Analytics queries

components/                # Reusable UI components
hooks/                     # Custom React hooks
types/                     # TypeScript type definitions
utils/                     # Utility functions
constants/                 # App constants and colors
```

## 🎨 Screens Overview

### 📅 Today Screen

- View habits scheduled for today
- Quick completion toggle
- Progress overview with motivational messages
- Completion rate display

### 📋 Habits Screen

- Manage all habits
- Create new habits with custom settings
- Edit or delete existing habits
- Color and emoji customization

### 📊 Analytics Screen

- Weekly and monthly progress charts
- Individual habit performance
- Achievement tracking
- Streak statistics and trends

### ⚙️ Settings Screen

- App preferences and configuration
- Data export and backup options
- Notification settings
- Privacy and about information

## 🎯 Key Features Explained

### Habit Creation

- **Name & Description**: Clear identification of your habits
- **Visual Customization**: Choose from 12 colors and 20 emojis
- **Frequency Options**: Daily, weekly, or custom day patterns
- **Date Ranges**: Set start and optional end dates

### Progress Tracking

- **Streak System**: Track consecutive completion days
- **Visual Feedback**: Color-coded progress indicators
- **Historical Data**: View past performance and trends
- **Success Metrics**: Completion rates and consistency scores

### Analytics Dashboard

- **Interactive Charts**: Bar charts and line graphs
- **Time Periods**: Weekly, monthly, and all-time views
- **Habit Comparisons**: See which habits perform best
- **Achievement Badges**: Milestone recognition system

## 🔧 Customization

### Adding New Habit Colors

Edit `types/habit.ts`:

```typescript
export const HABIT_COLORS = [
  "#FF6B6B", // Add your custom colors
  // ... existing colors
];
```

### Adding New Emojis

Edit `types/habit.ts`:

```typescript
export const HABIT_EMOJIS = [
  "💪", // Add your custom emojis
  // ... existing emojis
];
```

### Customizing Notifications

Edit `hooks/useNotifications.ts` to modify notification behavior, timing, and messages.

## 📊 Database Schema

The app uses Convex with three main tables:

- **habits**: Stores habit definitions and metadata
- **habitCompletions**: Records when habits are completed
- **streaks**: Tracks current and longest streaks

See `convex/schema.ts` for the complete schema definition.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Backend powered by [Convex](https://convex.dev/)
- Icons from [SF Symbols](https://developer.apple.com/sf-symbols/)
- Charts by [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)

## 🐛 Known Issues

- Chart library requires manual font loading on some devices
- Notification permissions need to be granted on first use
- Offline mode works but requires initial online setup

## 🔮 Future Enhancements

- [ ] Social features and habit sharing
- [ ] Advanced habit categories and tags
- [ ] Habit templates and recommendations
- [ ] Integration with health apps
- [ ] Dark mode improvements
- [ ] Widget support for iOS/Android
- [ ] Export to different formats (PDF, JSON)
- [ ] Advanced analytics and insights

---

**Happy habit building! 🎯**
