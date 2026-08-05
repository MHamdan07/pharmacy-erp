import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, FileText } from 'lucide-react';
import { Button, Card } from '../components/ui';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <Card variant="glass" className="max-w-md w-full p-8 text-center space-y-6 border-slate-800 shadow-2xl">
        <div className="p-4 bg-blue-600/20 text-blue-400 rounded-full inline-block border border-blue-500/30">
          <AlertCircle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white font-mono">404</h1>
          <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The route or resource you requested could not be found in the Pharmacy ERP SaaS platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link to="/dashboard" className="w-full">
            <Button variant="primary" size="sm" leftIcon={Home} fullWidth>
              Return to Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft} fullWidth>
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
