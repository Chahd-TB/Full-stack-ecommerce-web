# 🛍️ Full-Stack E-Commerce Web Application

A full-stack e-commerce web application built to practice and strengthen my skills in **frontend and backend development**, including authentication, REST APIs, database relationships, order management, and simulated payment processing.

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* User and admin roles
* Role-based access control

### 📦 Product Management

* Create, read, update, and delete products
* Product search
* Category filtering
* Pagination
* Product management for administrators

### 🛒 Shopping Cart & Checkout

* Add products to cart
* Update product quantities
* Remove products from cart
* Checkout process
* Customer and delivery information
* Order creation and status management

### 💳 Payment System

* Cash on Delivery
* Simulated CIB / Edahabia payment flow
* Payment records linked to users and orders
* Payment status management
* Transaction ID generation
* Automatic order confirmation after successful payment

> ⚠️ **Note:** The payment system is simulated for demonstration purposes. No real financial transactions are processed.

### 🛡️ Validation & Error Handling

* Request validation using Zod
* Authentication middleware
* Authorization checks
* Centralized error handling
* MongoDB/Mongoose validation

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Zod
* bcrypt

### Development Tools

* Git
* GitHub
* Nodemon

---

## 📁 Project Structure

```text
full-stack-ecommerce-app/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── index.js
│
├── Frontend/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd full-stack-ecommerce-app
```

### 2. Install Backend dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend dependencies

```bash
cd ../Frontend
npm install
```

---

## 🔑 Environment Variables

### Backend

Create a `.env` file inside the `Backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Frontend

Create a `.env` file inside the `Frontend` folder:

```env
VITE_API_URL=http://localhost:3000
```

> Never commit your `.env` files or sensitive credentials to GitHub.

---

## ▶️ Running the Application

### Start the Backend

From the `Backend` folder:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### Start the Frontend

From the `Frontend` folder:

```bash
npm run dev
```

---

## 💳 Test Payment

The application includes a simulated payment system for testing.

Use the following test card information:

```text
Card Number: 4242 4242 4242 4242
Expiry Date: 12/30
CVV: 123
```

No real payment is processed.

---

## 🔄 Application Flow

```text
User
  │
  ▼
Authentication
  │
  ▼
Browse Products
  │
  ▼
Shopping Cart
  │
  ▼
Checkout
  │
  ▼
Create Order
  │
  ▼
Create Payment
  │
  ▼
Process Payment
  │
  ├── Failed → Payment Failed
  │
  └── Successful
          │
          ▼
    Payment = Paid
          │
          ▼
    Order = Confirmed
```

---

## 🧠 What I Learned

This project helped me strengthen my understanding of:

* REST API development
* React frontend development
* Express.js backend architecture
* JWT authentication and authorization
* MongoDB and Mongoose relationships
* CRUD operations
* Request validation with Zod
* Middleware
* Error handling
* Frontend-backend integration
* Shopping cart and checkout logic
* Order and payment workflows
* Managing asynchronous operations
* Git and GitHub workflow

One of the main goals of the project was to understand how different parts of a real-world e-commerce application communicate with each other, particularly the relationships between **users, products, orders, and payments**.

---

## 🔮 Future Improvements

Possible future improvements include:

* Persistent shopping cart
* Email notifications
* Order history page
* Admin order management
* Product reviews and ratings
* Wishlist
* Real payment gateway integration
* Production deployment

---

## 👩‍💻 Author

**Chahd Touaibia**

Data Science Engineering Student | Full-Stack Web Development & AI

---

## 📄 License

This project was created for learning and portfolio purposes.
