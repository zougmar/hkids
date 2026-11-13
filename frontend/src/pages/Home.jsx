import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Library, Shield, ArrowRight } from 'lucide-react';
import { AGE_GROUPS, saveSelectedAge } from '../constants/ageGroups';
import { AgeIcon } from '../components/AgeIcons';

const Home = () => {
  const navigate = useNavigate();

  const selectAge = (ageId) => {
    saveSelectedAge(ageId);
    navigate(`/read?age=${encodeURIComponent(ageId)}`);
  };

  return (
    <div className="site-shell">
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
            <Library className="w-5 h-5" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-ink-900">HKids</span>
        </div>
        <Link to="/admin/login" className="btn-ghost btn-large text-base px-4 py-2.5">
          <Shield className="w-4 h-4" />
          Admin
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 pt-8 md:pt-14">
        <section className="text-center mb-10 md:mb-14 animate-fade-up">
          <p className="inline-flex items-center gap-2 chip bg-white/80 text-brand-700 border border-brand-100 mb-5">
            <Library className="w-4 h-4" />
            Digital reading platform
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-ink-900 mb-4">
            HKids
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-ink-500 leading-relaxed">
            Choose your age group to open a library made just for you.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
            {AGE_GROUPS.map((group, index) => (
              <motion.button
                key={group.id}
                type="button"
                onClick={() => selectAge(group.id)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`age-card ${group.accent} p-5 md:p-6`}
              >
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="age-icon-wrap w-14 h-14 rounded-2xl flex items-center justify-center">
                    <AgeIcon ageId={group.id} className="w-7 h-7" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-ink-300 mt-1 group-hover:text-brand-600" />
                </div>
                <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">{group.label}</h2>
                <p className="text-ink-500 leading-relaxed">{group.description}</p>
              </motion.button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
