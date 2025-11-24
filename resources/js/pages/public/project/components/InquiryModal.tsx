import { X } from 'lucide-react';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectName: string;
}

export function InquiryModal({ isOpen, onClose, projectName }: InquiryModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

            {/* Content */}
            <div className="bg-white w-full max-w-md border border-gray-200 shadow-2xl p-8 relative z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">Private Inquiry</h3>
                <p className="text-gray-500 text-sm font-light mb-8">We respond personally.</p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                    className="space-y-5"
                >
                    <div>
                        <label className="block text-xs font-light tracking-widest text-gray-500 uppercase mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 focus:border-amber-500 outline-none transition-colors font-light"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-light tracking-widest text-gray-500 uppercase mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 focus:border-amber-500 outline-none transition-colors font-light"
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-light tracking-widest text-gray-500 uppercase mb-2">
                            Phone
                        </label>
                        <input
                            type="tel"
                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 focus:border-amber-500 outline-none transition-colors font-light"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-light tracking-widest text-gray-500 uppercase mb-2">
                            Message
                        </label>
                        <textarea
                            rows={3}
                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 focus:border-amber-500 outline-none transition-colors resize-none font-light"
                            placeholder="Tell us more..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-gray-900 text-white py-3 font-light tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
