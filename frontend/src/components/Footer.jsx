import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4 max-w-md text-center md:text-left">
                        <img src="/logo.png" alt="Emplyon Logo" className="h-8 w-auto mx-auto md:mx-0" />
                        <p className="text-gray-500 text-sm leading-relaxed">
                            A plataforma definitiva para gestão empresarial inteligente. Otimize, escale e cresça com a{' '}<span className="notranslate" translate="no">Emplyon</span>.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-deep-navy mb-4 text-center md:text-right">Contato</h4>
                        <ul className="space-y-2 text-sm text-gray-500 flex flex-col items-center md:items-end">
                            <li className="flex items-center justify-center md:justify-end">
                                <Mail className="w-4 h-4 mr-2" />
                                <span className="notranslate" translate="no">adm.emplyon@gmail.com</span>
                            </li>
                            <li>
                                Av. Paulista, 1000 - SP
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col items-center text-sm text-gray-400 w-full">
                    <p>&copy; 2024{' '}<span className="notranslate" translate="no">Emplyon</span>. Todos os direitos reservados.</p>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4">
                        <Link to="/blog" className="hover:text-deep-navy transition-colors">Blog</Link>
                        <Link to="/termos" className="hover:text-deep-navy transition-colors">Termos</Link>
                        <Link to="/privacidade" className="hover:text-deep-navy transition-colors">Privacidade</Link>
                        <Link to="/cookies" className="hover:text-deep-navy transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
