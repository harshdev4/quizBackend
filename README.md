## Authentication Endpoints

### Signup
- **URL**: `/auth/signup`
- **Method**: POST
- **Description**: Allows users to create a new account.
- **Request Body**:
  - `email`: User's email address.
  - `username`: User's username.
  - `password`: User's password.
- **Response**:
  - `201 OK`: User account created successfully.
  - `400 Bad Request`: Missing required fields in the request body.
  - `409 Conflict`: User already exists with the provided email.

### Login
- **URL**: `/auth/login`
- **Method**: POST
- **Description**: Allows users to log in to their account.
- **Request Body**:
  - `username`: User's username.
  - `password`: User's password.
- **Response**:
  - `200 OK`: Login successful. JWT token sent in the response header.
  - `400 Bad Request`: Missing username or password in the request body.
  - `404 Not Found`: User not found in the database.
  - `401 Unauthorized`: Invalid credentials.


## Quiz Endpoints

### Get Active Quiz
- **URL**: `/quiz/active`
- **Method**: GET
- **Description**: Retrieves all active quizzes.
- **Response**:
    - `200 OK`: Active quizzes retrieved successfully.
    - `status`: Status of the response (success).
    - `data`: Object containing quiz data.
    - `quiz`: Array of active quizzes.

### Create Quiz
- **URL**: `/quiz`
- **Method**: POST
- **Description**: Creates a new quiz.
- **Request Body**:
  - `question`: Text of the question.
  - `options`: Array of answer options.
  - `rightAnswer`: Index of the correct answer in the options array.
  - `startDate`: Date and time when the quiz should start (ISO format).
  - `endDate`: Date and time when the quiz should end (ISO format).
- **Response**:
    - `201 Created`: Quiz created successfully.
    - `status`: Status of the response (success).
    - `data`: Object containing the created quiz.

### Get Quiz Result by ID
- **URL**: `/quiz/:id/result`
- **Method**: GET
- **Description**: Retrieves the result of a quiz by its ID.
- **Parameters**:
  - `id`: Quiz ID.
- **Response**:
    - `200 OK`: Quiz result retrieved successfully.
    - `status`: Status of the response (success).
    - `data`: Correct answer index.

### Get All Quizzes
- **URL**: `/quiz/all`
- **Method**: GET
- **Description**: Retrieves all quizzes.
- **Response**:
    - `200 OK`: All quizzes retrieved successfully.
    - `status`: Status of the response (success).
    - `quizzes`: Array of all quizzes.
