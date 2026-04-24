import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LampContainer } from '@/components/ui/lamp';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    Loader2,
    Send,
    User,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Users,
    MessageSquare
} from 'lucide-react';


const BudgetForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        employees: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    company: formData.company,
                    employees: formData.employees,
                    message: formData.message
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                console.error('Erro ao fazer parse da resposta:', parseError);
                throw new Error('Erro ao processar resposta do servidor');
            }

            if (!response.ok) {
                let errorMessage = data.error || data.message || 'Erro ao enviar solicitação';
                if (typeof errorMessage === 'object') {
                    errorMessage = errorMessage.message || JSON.stringify(errorMessage);
                }
                throw new Error(errorMessage);
            }

            console.log('Sucesso:', data);
            setIsSubmitted(true);

        } catch (error) {
            console.error("Erro no envio:", error);
            const errorMessage = error.message || "Tente novamente mais tarde.";
            alert(`Erro ao enviar solicitação: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const InputIcon = ({ icon: Icon, active }) => (
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${active ? 'text-royal-blue' : 'text-gray-400'}`}>
            <Icon className="w-5 h-5" />
        </div>
    );

    if (isSubmitted) {
        return (
            <section className="py-20 md:py-32 bg-gray-50/50" id="orcamento">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white rounded-2xl overflow-hidden text-center p-12">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Solicitação Recebida!</h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                            Obrigado pelo interesse, {formData.name.split(' ')[0]}. Nossa equipe analisará seus dados e entrará em contato em breve com uma proposta personalizada.
                        </p>
                        <Button
                            onClick={() => setIsSubmitted(false)}
                            className="bg-royal-blue text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Voltar ao site
                        </Button>
                    </Card>
                </div>
            </section>
        );
    }

    return (
        <LampContainer id="orcamento" className="pt-20 md:pt-40">
            <div className="container mx-auto px-4 max-w-5xl relative z-10 w-full">
                <div className="grid lg:grid-cols-5 gap-12 w-full">
                    {/* Header Context */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
                            Proposta Personalizada
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
                            Vamos construir o futuro da sua gestão.
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Preencha o formulário para receber uma análise gratuita e descobrir o potencial de economia da sua operação.
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Análise de ROI</h4>
                                    <p className="text-sm text-white/60">Cálculo detalhado do retorno sobre o investimento.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Demonstração Prática</h4>
                                    <p className="text-sm text-white/60">Tour guiado pela plataforma com seus dados.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="lg:col-span-3">
                        <Card className="border-none shadow-2xl shadow-gray-200/50 bg-white rounded-2xl overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-cyan-500"></div>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Nome */}
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Nome Completo</label>
                                            <div className="relative">
                                                <InputIcon icon={User} active={focusedField === 'name'} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/10 transition-all outline-none"
                                                    placeholder="Seu nome"
                                                />
                                            </div>
                                        </div>

                                        {/* Telefone */}
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Telefone / WhatsApp</label>
                                            <div className="relative">
                                                <InputIcon icon={Phone} active={focusedField === 'phone'} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('phone')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/10 transition-all outline-none"
                                                    placeholder="(11) 96264-1923"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2 relative md:col-span-2">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Email Corporativo</label>
                                            <div className="relative">
                                                <InputIcon icon={Mail} active={focusedField === 'email'} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/10 transition-all outline-none"
                                                    placeholder="seu@empresa.com.br"
                                                />
                                            </div>
                                        </div>

                                        {/* Empresa */}
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Nome da Empresa</label>
                                            <div className="relative">
                                                <InputIcon icon={Building2} active={focusedField === 'company'} />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('company')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/10 transition-all outline-none"
                                                    placeholder="Nome da sua empresa"
                                                />
                                            </div>
                                        </div>

                                        {/* Nº Colaboradores */}
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Colaboradores</label>
                                            <div className="relative">
                                                <InputIcon icon={Users} active={focusedField === 'employees'} />
                                                <select
                                                    name="employees"
                                                    value={formData.employees}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('employees')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/10 transition-all outline-none appearance-none"
                                                >
                                                    <option value="" disabled>Selecione</option>
                                                    <option value="1-50">1 - 50</option>
                                                    <option value="51-200">51 - 200</option>
                                                    <option value="201-500">201 - 500</option>
                                                    <option value="501-1000">501 - 1000</option>
                                                    <option value="1000+">Acima de 1000</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mensagem */}
                                    <div className="space-y-2 relative">
                                        <label className="text-sm font-medium text-gray-700 ml-1">Mensagem (Opcional)</label>
                                        <div className="relative">
                                            <div className={`absolute left-3 top-3 transition-colors duration-200 ${focusedField === 'message' ? 'text-royal-blue' : 'text-gray-400'}`}>
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-royal-blue focus:ring-4 focus:ring-royal-blue/10 transition-all outline-none resize-none"
                                                placeholder="Detalhes adicionais..."
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-royal-blue to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            <>
                                                Solicitar Proposta Agora
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Seus dados estão protegidos. Não enviamos spam.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </LampContainer>
    );
};

// Simple ArrowRight icon component just for the button if needed, 
// though we usually import it. adding here to be safe if not imported above.
const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);

export default BudgetForm;
