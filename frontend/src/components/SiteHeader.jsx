import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaultMenuItems = [
  { name: 'Blog', to: '/blog' },
  { name: 'Benefícios', to: '/#beneficios' },
  { name: 'Como Funciona', to: '/#como-funciona' },
  { name: 'FAQ', to: '/#faq' },
];


export function SiteHeader({ menuItems = defaultMenuItems } = {}) {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-50 w-full px-2 group mt-0 md:mt-4 transform-gpu"
      >
        <div
          className={cn(
            'mx-auto max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled
              ? 'bg-white/80 max-w-4xl rounded-full border border-gray-200 backdrop-blur-lg lg:px-6 shadow-sm py-2'
              : 'lg:px-12 py-4'
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0">
            <div className="flex w-full justify-between lg:w-auto">
              <Link to="/" aria-label="Início" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Emplyon Logo" className="h-8 w-auto" />
              </Link>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Fechar menu' : 'Abrir menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-deep-navy"
              >
                <Menu
                  className={cn(
                    'm-auto size-6 duration-200',
                    menuState ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 duration-200',
                    menuState ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-180'
                  )}
                />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm font-medium">
                {menuItems.map((item) => (
                  <li key={item.to + item.name}>
                    <Link
                      to={item.to}
                      className="text-gray-600 hover:text-royal-blue block duration-150 transition-colors"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                'bg-white lg:bg-transparent absolute top-full left-0 w-full rounded-2xl border border-gray-100 shadow-xl p-6 space-y-4 lg:static lg:block lg:w-auto lg:shadow-none lg:border-none lg:p-0 lg:space-y-0',
                menuState ? 'block' : 'hidden lg:flex'
              )}
            >
              <div className="lg:hidden">
                <ul className="space-y-4 text-base font-medium text-deep-navy">
                  {menuItems.map((item) => (
                    <li key={item.to + item.name + 'm'}>
                      <Link
                        to={item.to}
                        onClick={() => setMenuState(false)}
                        className="block py-2 hover:text-royal-blue transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit mt-4 lg:mt-0">
                <Button
                  asChild
                  size="sm"
                  className="rounded-full px-6 bg-royal-blue text-white hover:bg-blue-600 text-sm font-medium shadow-md"
                >
                  <Link to="/#orcamento" onClick={() => setMenuState(false)}>
                    <span>Falar com Especialista</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
