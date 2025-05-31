# 📊 Business Tracker

[![Deployment Status](https://img.shields.io/badge/deployment-live-success)](https://trackerbusiness.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

Business Tracker is a modern, full-stack web application designed to help entrepreneurs and business owners track their investments, expenses, and profits in real-time. With an intuitive interface and powerful features, it simplifies financial management for your business.

## ✨ Features

- 🔐 **Secure Authentication**: Google OAuth integration for safe and easy login
- 💼 **Business Profile Management**: Customize your business details and logo
- 💰 **Transaction Tracking**: Monitor investments, expenses, and sales
- 📊 **Financial Analytics**: Real-time calculation of ROI and net profits
- 🔍 **Advanced Filtering**: Search and filter transactions by date, type, and category
- 📱 **Responsive Design**: Seamless experience across all devices
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations

## 🚀 Live Demo

Experience the application live at: [https://trackerbusiness.vercel.app](https://trackerbusiness.vercel.app)

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 14 (React)
  - TypeScript
  - Tailwind CSS
  - NextAuth.js

- **Backend**:
  - Next.js API Routes
  - MongoDB
  - Google OAuth

- **Deployment**:
  - Vercel
  - MongoDB Atlas

## 🏗️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trackerbusiness.git
   cd trackerbusiness
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   - `MONGODB_URI`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Alex Costa**
- GitHub: [@AlejandroCosta02](https://github.com/AlejandroCosta02)
- LinkedIn: [Alex Costa](https://www.linkedin.com/in/alex-costa-b4b99b1b8/)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for database services
- Google for OAuth authentication

## 📸 Screenshots

![Dashboard](public/dashboard-screenshot.png)
*Main dashboard showing business metrics and transactions*

![Transactions](public/transactions-screenshot.png)
*Transaction management interface*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/trackerbusiness/issues).

## 💫 Show your support

Give a ⭐️ if this project helped you!
