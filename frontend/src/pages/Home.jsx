import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-primary-blue mb-4">
          📚 HKids
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 mb-12">
          Child Reading Platform
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link
            to="/read"
            className="btn-large bg-primary-green text-white shadow-lg hover:shadow-xl"
          >
            Start Reading
          </Link>
          
          <Link
            to="/admin/login"
            className="btn-large bg-primary-orange text-white shadow-lg hover:shadow-xl"
          >
            Admin Login
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="text-4xl mb-3">👶</div>
            <h3 className="text-xl font-semibold mb-2">Ages 3-5</h3>
            <p className="text-gray-600">Simple stories for little readers</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="text-4xl mb-3">🧒</div>
            <h3 className="text-xl font-semibold mb-2">Ages 6-8</h3>
            <p className="text-gray-600">Engaging adventures for growing minds</p>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="text-4xl mb-3">👦</div>
            <h3 className="text-xl font-semibold mb-2">Ages 9-12</h3>
            <p className="text-gray-600">Exciting stories for young readers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
