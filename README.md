# 🌱 FreshRoots

FreshRoots is a modern full-stack grocery e-commerce platform built with the MERN stack. It allows customers to browse products, manage their cart, place orders, and enjoy a seamless online grocery shopping experience, while administrators can efficiently manage products, users, orders, and sales analytics.

## 🚀 Live Demo
https://fresh-roots-grocery.vercel.app/

---

## ✨ Features

### Customer Features
- Secure user registration and login
- JWT authentication with HTTP-only cookies
- Browse products by category
- Product details page
- Search and filter products
- Add to cart and manage quantities
- Responsive shopping experience
- Place and track orders
- View order history

### Admin Features
- Admin dashboard
- Product management (Create, Update, Delete)
- Product image uploads
- User management
- Order management
- Sales analytics
- Revenue tracking
- Inventory monitoring

---

## 🛠 Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- Shadcn UI
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JWT Authentication
- HTTP-only Cookies
- bcrypt Password Hashing

### Deployment
- Render
- MongoDB Atlas

---

## 📂 Project Structure

```bash
FreshRoots
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   ├── routes
│   │   ├── layouts
│   │   └── utils
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── utils
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/freshroots.git
cd freshroots
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

---

## 📊 Core Functionalities

| Module | Functionality |
|----------|--------------|
| Authentication | Register, Login, Logout |
| Products | Add, Edit, Delete, View |
| Cart | Add, Remove, Update Quantity |
| Orders | Place and Manage Orders |
| Users | Customer & Admin Roles |
| Dashboard | Sales and Revenue Analytics |
| Inventory | Product Stock Management |
| Security | JWT + bcrypt Authentication |

---

## 📦 Database Models

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: String
}
```

### Product

```js
{
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number
}
```

### Order

```js
{
  user: ObjectId,
  products: Array,
  totalAmount: Number,
  status: String,
  createdAt: Date
}
```

---

## 📈 Admin Dashboard Analytics

The dashboard provides:

- Total Users
- Total Products
- Total Orders
- Total Revenue
- Daily Sales Tracking
- Business Performance Monitoring

---

## 📱 Responsive Design

FreshRoots is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile Devices

---

## 🎯 Future Enhancements

- Online Payment Gateway Integration
- Wishlist Functionality
- Product Reviews & Ratings
- Coupon & Discount System
- Email Notifications
- Real-Time Order Tracking
- AI Product Recommendations
- Multi-Vendor Marketplace

---

## 📸 Screenshots

### Home Page
<img width="1913" height="966" alt="image" src="https://github.com/user-attachments/assets/7407ee25-e953-4c4b-89ce-f4d4f5ddb52c" />



### Product Page

<img width="1917" height="963" alt="image" src="https://github.com/user-attachments/assets/3ca16c00-68b3-4ec1-8557-334f1bc3ab29" />


### Admin Dashboard

<img width="1896" height="958" alt="image" src="https://github.com/user-attachments/assets/810874a4-a555-41ae-ba4a-149fb354a0b3" />

<img width="1912" height="873" alt="image" src="https://github.com/user-attachments/assets/a8ae4367-0088-4ec9-814c-226ad01b6f3c" />

<img width="1918" height="957" alt="image" src="https://github.com/user-attachments/assets/7dffc0e3-1367-48c1-985f-416dfb4ab2f7" />

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

### Onik 

Computer Science & Engineering Student

Built with ❤️ using the MERN Stack.
