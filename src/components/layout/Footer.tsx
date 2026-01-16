import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MessageCircle, Shield, FileText, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      {/* Disclaimer Banner */}
      <div className="disclaimer-banner">
        <p className="text-primary font-medium">
          ⚠️ لعب ترفيهي فقط - لا يوجد مال حقيقي ⚠️
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold gold-text">
                LuxePlay
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              كازينو ترفيهي للعب المجاني فقط. استمتع بأفضل الألعاب بدون أي مخاطر مالية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/slots" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  ألعاب السلوتس
                </Link>
              </li>
              <li>
                <Link to="/tables" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  ألعاب الطاولة
                </Link>
              </li>
              <li>
                <Link to="/crash" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  ألعاب كراش
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">الدعم</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  عنا
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@luxeplay.demo
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  الدردشة المباشرة
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-right">
              © 2024 LuxePlay Casino. جميع الحقوق محفوظة. هذا موقع ترفيهي للعب المجاني فقط.
            </p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                18+ فقط
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                لعب مسؤول
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
