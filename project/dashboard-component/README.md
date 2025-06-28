# Candidate Dashboard Component

This project contains a dashboard component specifically designed for candidates. It provides an organized layout to display useful information such as job history, application status, and coaching prompts. The dashboard is built using React and Tailwind CSS for styling.

## Project Structure

- **src/components/dashboard**: Contains all the components related to the candidate dashboard.
  - **CandidateDashboard.jsx**: Main dashboard component for candidates.
  - **DashboardCard.jsx**: Container for various dashboard cards.
  - **JobHistoryCard.jsx**: Displays the candidate's job history using mock data.
  - **StatusCard.jsx**: Shows the current status of the candidate's applications.
  - **CoachingPromptsCard.jsx**: Presents coaching prompts for career development.

- **src/components/ui**: Contains reusable UI components.
  - **Button.jsx**: A customizable button component.
  - **Card.jsx**: A wrapper for content providing consistent styling.
  - **Badge.jsx**: Displays status indicators or labels.

- **src/pages**: Contains the main pages of the application.
  - **ComprehensiveDashboard.jsx**: Detailed dashboard page with a backlink to the /hub page.

- **src/data**: Contains mock data used throughout the dashboard components.
  - **mockData.js**: Mock data for job history, status updates, and coaching prompts.

- **src/hooks**: Contains custom hooks for managing state and logic.
  - **useDashboard.js**: Custom hook for fetching and managing dashboard data.

- **src/utils**: Contains utility functions for data manipulation.
  - **helpers.js**: Utility functions for formatting and processing data.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd dashboard-component
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

Once the server is running, navigate to the candidate dashboard to view job history, application status, and coaching prompts. Use the button provided in the dashboard to access the comprehensive dashboard page for more detailed information.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.