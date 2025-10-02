import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ConsultantProfilePage = () => {
  const { consultantId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Consultant Profile - Consulting19</title>
      </Helmet>

      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Consultant Profile</h1>
          <p className="text-gray-600">
            Consultant ID: {consultantId}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This page is under construction. Please contact support for more information.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConsultantProfilePage;
