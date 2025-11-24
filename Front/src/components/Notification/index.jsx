import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  const bgColor = message.type === 'error' 
    ? 'bg-red-100 border-red-500 text-red-700' 
    : message.type === 'success' 
      ? 'bg-green-100 border-green-500 text-green-700'
      : 'bg-blue-100 border-blue-500 text-blue-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 p-4 rounded-lg border-l-4 ${bgColor} shadow-lg max-w-sm z-50`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium">{message.text}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Fermer la notification"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default Notification;
