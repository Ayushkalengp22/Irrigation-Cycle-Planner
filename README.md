# 🌱 Irrigation Cycle Planner

A React-based web application for smart irrigation scheduling using configurable plots, motors, runtime, and intervals.

---

## 🚀 Features

- 🛠️ **Dynamic schedule generation** with round-robin motor allocation
- ⏱️ **Real-time progress tracking** with status indicators
- 📊 **Summary dashboard** showing running, done, and upcoming plots
- 🔍 **Filtering and sorting** options for better usability
- 💾 **Auto-save form inputs** - settings persist across page refreshes
- 📱 **Fully responsive** and mobile-friendly interface

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── InputForm.jsx           # User input form for scheduling parameters
│   ├── ScheduleTable.jsx       # Displays schedule table with status and progress
│   ├── StatusBadge.jsx         # Reusable status indicator component
│   └── SummaryDashboard.jsx    # Overview dashboard with stats and progress bar
│
├── utils/
│   └── scheduler.js            # Core scheduling logic with optimized performance
│
├── styles/
│   └── app.css                 # Global and component-level styling
│
├── App.jsx                     # Root component tying everything together
└── index.js                    # Entry point for React application
```

---

## 🧠 How the Smart Scheduling Works

### Round-Robin Algorithm:

The system uses an intelligent **round-robin** approach to distribute irrigation cycles efficiently:

1. **Time Conversion:** Converts start/end times (like 060000) into minutes for easier calculation
2. **Motor Distribution:** Assigns multiple motors to run simultaneously during each time slot
3. **Plot Rotation:** Cycles through all plots sequentially, ensuring equal water distribution
4. **Time Progression:** Moves forward by runtime + interval for each cycle batch

### Efficiency Benefits:

- ✅ **Optimized Performance:** Linear time complexity - no nested loops
- ✅ **Equal Distribution:** Every plot gets same amount of irrigation time
- ✅ **Maximum Utilization:** Uses all available motors simultaneously
- ✅ **Scalable Design:** Easy to add more plots or motors

---

## ⏱️ How Real-Time Updates Work

### Status Calculation System:

The app determines irrigation status by comparing current time with scheduled times:

- **Pending:** Current time is before the start time
- **In Progress:** Current time is between start and end time
- **Done:** Current time is after the end time

### Live Progress Tracking:

- **Time Updates:** App checks current time every second using browser timers
- **Automatic Recalculation:** Status and progress percentages update automatically
- **Visual Indicators:** Progress bars and status badges change colors in real-time
- **No Refresh Needed:** Everything updates live without page reload

### Progress Percentage Logic:

Calculates how much of each irrigation cycle is complete based on elapsed time versus total duration.

---

## 💾 How Data Persistence Works

### Auto-Save Mechanism:

- **Automatic Storage:** Form inputs save to browser's local storage on every change
- **Page Refresh Survival:** Settings persist even when user refreshes or closes browser
- **Smart Loading:** App checks for saved settings when it starts up
- **Fallback System:** Uses default values if no saved data exists

### User Control Features:

- **Reset Button:** Restores original default values
- **Clear Saved:** Removes all saved data and starts fresh
- **Error Handling:** Gracefully handles storage failures or corrupted data

---

## 🎨 How the UI Components Work

### Component Architecture:

- **InputForm:** Handles user configuration and manages localStorage persistence
- **SummaryDashboard:** Calculates and displays overall statistics and currently active plots
- **ScheduleTable:** Shows detailed schedule with filtering, sorting, and status indicators
- **StatusBadge:** Provides consistent visual status representation across the app

### Responsive Design Strategy:

- **Mobile-First:** Designed for phones first, then scaled up for tablets and desktops
- **Flexible Layouts:** Uses CSS Grid and Flexbox for automatic size adjustments
- **Touch-Friendly:** Large buttons and touch targets for mobile users
- **Progressive Enhancement:** Works on basic devices, enhanced on powerful ones

---

## 🔄 How Data Flows Through the App

### Application Flow:

1. **User Input:** User enters configuration in the form
2. **Schedule Generation:** Algorithm creates optimized irrigation schedule
3. **Real-Time Processing:** System continuously calculates current status
4. **UI Updates:** Components automatically re-render with new information
5. **Data Persistence:** Settings automatically save for future sessions

### State Management:

- **Centralized Time:** Single source of truth for current time in main App component
- **Prop Drilling:** Time and schedule data passed down to child components
- **Reactive Updates:** Components automatically update when data changes
- **Memory Optimization:** Calculations only run when necessary using React's memoization

---

## 🎯 How the Filtering System Works

### Smart Filtering:

- **Status-Based:** Users can filter by Pending, In Progress, Done, or All
- **Real-Time Updates:** Filtered results update automatically as status changes
- **Count Display:** Shows how many items match current filter
- **Performance Optimized:** Filtering happens in memory without API calls

---

## 🧪 How to Use - Example Workflow

### Typical User Journey:

1. **Configure Settings:** Enter number of plots, motors, timing, and duration
2. **Generate Schedule:** Click button to create optimized irrigation plan
3. **Monitor Progress:** Watch real-time status updates and progress bars
4. **Filter Results:** Use dropdown to focus on specific status types
5. **Track Completion:** View summary dashboard for overall progress

### Default Configuration Example:

- **4 Plots, 2 Motors:** Efficient utilization with parallel irrigation
- **6 AM to 7 PM:** Full day irrigation schedule
- **5-minute runtime, 20-minute intervals:** Balanced water distribution
- **Result:** Approximately 50+ irrigation cycles throughout the day

---

## 🛠️ Tech Stack & Architecture

### Frontend Technologies:

- **React with Hooks:** Modern functional component approach
- **CSS Grid/Flexbox:** Responsive layout system
- **localStorage API:** Browser-based data persistence
- **Vanilla JavaScript:** Time calculations and algorithms

### Performance Strategies:

- **Memoized Calculations:** Prevents unnecessary re-computations
- **Efficient Algorithms:** Linear time complexity for schedule generation
- **Optimized Rendering:** Components only update when data actually changes
- **Lightweight Design:** No heavy external libraries or frameworks

---

## 📝 Getting Started

```bash
npm install
npm start
```

To generate the production build:

```bash
npm run build
```

---

## 🧪 Example Inputs

| Parameter  | Value    | Purpose                    |
| ---------- | -------- | -------------------------- |
| Plots      | 4        | Number of irrigation zones |
| Motors     | 2        | Available pumps/motors     |
| Start Time | 060000   | Begin irrigation (6:00 AM) |
| End Time   | 190000   | Stop irrigation (7:00 PM)  |
| Runtime    | 5 (min)  | Duration per plot          |
| Interval   | 20 (min) | Rest time between cycles   |

--
