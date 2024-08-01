# Task Management System

Welcome to the Task Management System, a web application designed to manage and track tasks efficiently. This project is built using the React-Laravel stack.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User Authentication and Authorization
- Task Creation, Editing, and Deletion
- Task Categorization
- Responsive Design with Tailwind CSS
- Data Persistence with Local Storage

## Tech Stack

### Frontend
- React
- Tailwind CSS

### Backend
- Laravel

### Others
- Local Storage

## Installation

### Prerequisites
- Node.js
- Composer
- PHP
- MySQL

### Frontend Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/MohannadWard12/tasks-system-full-project.git
    ```
2. Navigate to the `frontend` directory:
    ```sh
    cd tasks-system-full-project/frontend
    ```
3. Install dependencies:
    ```sh
    npm install
    ```
4. Start the development server:
    ```sh
    npm start
    ```

### Backend Setup
1. Navigate to the `backend` directory:
    ```sh
    cd ../backend
    ```
2. Install dependencies:
    ```sh
    composer install
    ```
3. Set up environment variables:
    ```sh
    cp .env.example .env
    ```
    - Update the `.env` file with your database credentials.
4. Generate application key:
    ```sh
    php artisan key:generate
    ```
5. Run database migrations:
    ```sh
    php artisan migrate
    ```
6. Start the development server:
    ```sh
    php artisan serve
    ```

## Usage

1. Access the frontend at `http://localhost:3000`
2. Access the backend at `http://localhost:8000`

## Project Structure

```
tasks-system-full-project/
├── backend/                # Laravel backend
│   ├── app/                # Application files
│   ├── config/             # Configuration files
│   ├── database/           # Database migrations and seeders
│   └── ...                 # Other Laravel directories
└── frontend/               # React frontend
    ├── public/             # Public files
    ├── src/                # Source files
    │   ├── components/     # React components
    │   ├── pages/          # React pages
    │   └── ...             # Other source files
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or suggestions, feel free to reach out to:

Mohannad Ward  
- [GitHub](https://github.com/MohannadWard12)
- [Email](mailto:your-email@example.com)
```

Feel free to modify the contact section with your actual email address or any other means of communication you prefer.
