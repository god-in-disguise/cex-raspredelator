# MEXC Withdrawal Tool - Next.js

A secure, modern web application for managing cryptocurrency withdrawals from MEXC exchange. Built with Next.js and designed for deployment on Vercel.

## Features

- 🔐 **Secure API Key Management**: Store your MEXC API credentials locally with encryption
- 💰 **Real-time Balance Checking**: View your available balances and withdrawal fees
- 🚀 **Bulk Withdrawals**: Process multiple withdrawals simultaneously
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Fast and Modern**: Built with Next.js, TypeScript, and Tailwind CSS
- 🔒 **Privacy-First**: Your API keys never leave your browser

## Quick Start

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mexc-withdrawal-nextjs)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account and create a new repository
3. Deploy the application
4. Access your deployed app and configure your MEXC API keys

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mexc-withdrawal-nextjs.git
   cd mexc-withdrawal-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### MEXC API Keys

1. Log in to your MEXC account
2. Go to **Account** > **API Management**
3. Create a new API key with **withdrawal permissions**
4. Copy your API Key and Secret Key
5. Enter them in the application when prompted

> **Important**: Your API keys are stored locally in your browser with encryption and never sent to any external servers except MEXC.

### Supported Cryptocurrencies

The application supports all cryptocurrencies available on MEXC, including:

- Bitcoin (BTC)
- Ethereum (ETH)
- Solana (SOL)
- USDT (multiple networks)
- USDC (multiple networks)
- BNB, ADA, DOT, MATIC, AVAX
- Custom cryptocurrencies (enter manually)

## Security Features

- **Client-side encryption** of API credentials using AES encryption
- **Local storage only** - credentials never leave your device
- **API key validation** before storage
- **Rate limiting** to prevent API abuse
- **Input validation** for all withdrawal requests

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Exchange Integration**: CCXT library
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
mexc-withdrawal-nextjs/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api.ts            # API client
│   ├── mexc-client.ts    # MEXC exchange client
│   ├── storage.ts        # Local storage utilities
│   └── utils.ts          # General utilities
└── ...
```

## API Routes

- `GET /api/balance/[coin]` - Get balance for a specific cryptocurrency
- `GET /api/withdrawal-fee/[coin]` - Get withdrawal fee information
- `POST /api/withdraw` - Execute withdrawal
- `GET /api/withdrawal-status/[id]` - Check withdrawal status
- `GET /api/deposit-address/[coin]` - Get deposit address
- `POST /api/test-credentials` - Validate API credentials

## Environment Variables

For local development, you can create a `.env.local` file:

```env
# Optional: Custom encryption key (defaults to built-in key)
ENCRYPTION_KEY=your-custom-encryption-key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is for educational and personal use only. Always verify withdrawal addresses and amounts before confirming transactions. The developers are not responsible for any financial losses that may occur from using this application.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/mexc-withdrawal-nextjs/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Made with ❤️ for the crypto community
