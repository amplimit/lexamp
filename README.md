# Lexamp

<div align="center">
  <img src="public/favicon.ico" alt="Lexamp Logo" width="200"/>
  <p><em>Democratizing Legal Services through AI and Professional Expertise</em></p>
</div>

## 🌟 Overview

Lexamp is a revolutionary three-sided marketplace platform that bridges the gap between legal service accessibility and professional support. By connecting consumers, legal firms, and AI technology providers, we're creating a win-win-win ecosystem where:

- 👥 **Consumers** get affordable, efficient legal services
- ⚖️ **Law Firms** expand their digital presence and monetize data
- 🤖 **AI Partners** gain valuable data while growing equity value

## ✨ Core Products

### 🤖 AI Legal ChatBox
- Real-time legal consultation with natural conversation
- 30-minute free trial for new users
- Intelligent case complexity assessment
- Seamless referral to professional lawyers when needed
- Monthly subscription model ($10/month)
- Open Source Project:
  - GitHub: [lawyer-llama3-8b](https://github.com/StevenChen16/lawyer-llama3-8b.git)
  - Model: [llama3-8b-Lawyer on HuggingFace](https://huggingface.co/StevenChen16/llama3-8b-Lawyer)
  - Demo: [AI-Lawyer Space](https://huggingface.co/spaces/StevenChen16/AI-Lawyer)

### 📄 Smart Contract System (LexCraft)
- **Basic Plan** ($30)
  - AI-powered template selection and population
  - Standardized contract templates
  - Guaranteed fairness protection
  - Perfect for rental agreements

- **Premium Plan** ($888)
  - Professional legal support
  - Ongoing assistance
  - Ideal for real estate transfers
  - 70/30 revenue split with legal firms

- Open Source Project:
  - GitHub: [LexCraft](https://github.com/StevenChen16/LexCraft)

## 🛠️ Technology Stack

- **Frontend**
  - Next.js 15.1.5 (React 19)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui + Radix UI components

- **Backend**
  - Next.js App Router
  - Prisma ORM
  - PostgreSQL
  - NextAuth.js for authentication

- **AI Integration**
  - Template-based contract system
  - Natural language processing
  - Intelligent template selection
  - Data-driven improvements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

### Installation Steps

1. Clone the Repository
   ```bash
   git clone https://github.com/StevenChen16/Lexamp.git
   cd Lexamp
   ```

2. Install Dependencies
   ```bash
   npm install
   ```

3. Environment Setup
   ```bash
   cp .env.example .env
   ```
   Generate a secure secret key:
   ```bash
   openssl rand -base64 32
   ```
   Configure the following variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/Lexamp"
   NEXTAUTH_SECRET="your-generated-secret-key"    # Paste the generated key here
   NEXTAUTH_URL="http://localhost:8050"
   ```

4. Database Setup
   ```bash
   # Create database and run migrations
   npx prisma migrate dev
   
   # Seed initial data (if available)
   npx prisma db seed
   ```

5. Start Development Server
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:8050`

## 📁 Project Structure

```
Lexamp/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   │   ├── landing/     # Landing page components
│   │   ├── settings/    # User settings components
│   │   └── ui/          # UI components
│   └── lib/             # Utility functions and configs
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── tests/              # Test files
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- Create an issue in the [GitHub repository](https://github.com/amplimit/Lexamp/issues)
- Contact us at [i@stevenchen.site](mailto:i@stevenchen.site)
- Visit our [documentation](https://amplimit.com)

---

<div align="center">
  <p>Built with ❤️ by the Steven Chen</p>
</div>