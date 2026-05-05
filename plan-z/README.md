# PLAN-Z Project Development Guide

## Project Name

PLAN-Z

## Course Information

Course: CSE470  
Section: 07  
Group: 01  

## Group Members

- Khondokar Waysal E Mustafa
- Faraaz Jamil Chowdhury
- Tashrique Tanvir

---

# Project Overview

PLAN-Z is a full-stack online event management and ticketing platform developed using the MERN stack.

The purpose of the platform is to make event discovery, ticket booking, event organization, and event management easier. Attendees can browse events, book tickets, save favorite events, buy merchandise, and view booking/order history. Organizers can create and manage events, view attendee lists, manage ticket sales, and upload merchandise. Admins can manage users, approve or remove events, monitor ticket sales, monitor system activity, and handle complaints.

---

# Technology Stack

## Frontend

- React.js
- React Router DOM
- Axios
- CSS / Tailwind CSS / Bootstrap

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token
- dotenv
- cors
- nodemon

## Database

- MongoDB Atlas or local MongoDB

## Payment

- Mock payment system for development
- bKash payment gateway structure for future integration

---

# User Roles

The system has three main roles:

## 1. Attendee

Attendees can:

- Register and log in
- Browse events
- Search and filter events by category, location, and date
- View event details
- Save events to favorites
- Book tickets
- View booking history
- Browse merchandise
- Add merchandise to cart
- Purchase merchandise
- View order history
- Submit complaints

## 2. Organizer

Organizers can:

- Register and log in
- Create events
- Update event information
- Cancel events
- Manage their own events
- View attendee lists
- View ticket sales
- Upload merchandise
- Manage merchandise

## 3. Admin

Admins can:

- Manage users
- Approve events
- Remove events
- Monitor ticket sales
- Monitor platform activity
- View complaints
- Respond to complaints

---

# Main Features

## Authentication

- User registration
- User login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected routes
- Role-based authorization

## Event Management

- Organizer can create events
- Organizer can update own events
- Organizer can cancel own events
- Admin can approve events
- Admin can remove events
- Attendee can browse approved events
- Attendee can search and filter events
- Attendee can view event details

## Ticket Booking

- Attendee can select ticket type
- Attendee can select ticket quantity
- System calculates total price
- System creates booking
- System uses mock payment first
- Attendee can view booking history
- Organizer can view attendee list
- Organizer can view ticket sales

## Merchandise

- Organizer can add merchandise for events
- Organizer can update merchandise
- Organizer can delete merchandise
- Attendee can browse merchandise
- Attendee can add merchandise to cart
- Attendee can purchase merchandise
- Attendee can view order history

## Admin Management

- Admin can view all users
- Admin can change user role
- Admin can delete users
- Admin can approve events
- Admin can remove events
- Admin can view ticket sales
- Admin can view complaints
- Admin can respond to complaints

---

# Expected Folder Structure

```txt
plan-z/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── README.md
├── PROJECT.md
└── .gitignore