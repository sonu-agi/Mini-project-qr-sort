import React from 'react';
import { MapPin, Phone, Mail, Printer } from 'lucide-react';
import { JIT_LOGO_BASE64 } from '../assets/jit_logo';
import { QRCodeSVG } from 'qrcode.react';

const Footer: React.FC = () => {
  const contactInfo = {
    address: 'Jeppiaar Institute of Technology, Kunnam, Sunguvarchatram, Sriperumbudur (TK), Chennai - 631 604.',
    collegePhones: ['044-27159000', '7401222000', '7401222010'],
    ladiesHostelPhones: ['044-27159019', '25'],
    gentsHostelPhones: ['044-27159014', '30'],
    fax: '044-27159006',
    emails: ['office@jeppiaarinstitute.org', 'network@jeppiaarinstitute.org'],
    collegeWebsite: 'https://www.jeppiaarinstitute.org/'
  };

  return (
    <footer className="bg-[#101f3c] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo and Address */}
          <div className="space-y-4">
             <img 
              src={JIT_LOGO_BASE64}
              alt="Jeppiaar Institute of Technology Logo"
              className="h-16 bg-white p-2 rounded-md"
            />
            <h3 className="text-xl font-bold">Jeppiaar Institute of Technology</h3>
            <div className="flex items-start">
              <MapPin size={20} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
              <p className="text-gray-300 text-sm leading-relaxed">{contactInfo.address}</p>
            </div>
             <div className="mt-6">
                <h5 className="font-semibold text-gray-200 mb-2">College Website QR</h5>
                <div className="bg-white p-2 rounded-md inline-block shadow-lg">
                    <QRCodeSVG value={contactInfo.collegeWebsite} size={100} />
                </div>
            </div>
          </div>

          {/* Column 2: Phone Numbers */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-100">Contact Numbers</h4>
            <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Phone size={16} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                  <div>
                    <span className="font-semibold text-gray-200">College Phone:</span>
                    <div className="flex flex-col">
                        {contactInfo.collegePhones.map(phone => <a key={phone} href={`tel:${phone}`} className="text-gray-300 hover:text-white hover:underline">{phone}</a>)}
                    </div>
                  </div>
                </div>
                 <div className="flex items-start">
                  <Phone size={16} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                  <div>
                    <span className="font-semibold text-gray-200">Ladies Hostel:</span>
                    <p className="text-gray-300">044-27159019, 25</p>
                  </div>
                </div>
                 <div className="flex items-start">
                  <Phone size={16} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                  <div>
                    <span className="font-semibold text-gray-200">Gents Hostel:</span>
                    <p className="text-gray-300">044-27159014, 30</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Printer size={16} className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                   <div>
                    <span className="font-semibold text-gray-200">Fax:</span>
                    <p className="text-gray-300">{contactInfo.fax}</p>
                   </div>
                </div>
            </div>
          </div>
          
          {/* Column 3: Emails */}
          <div className="space-y-4">
             <h4 className="text-lg font-semibold text-gray-100">Email Us</h4>
             <div className="space-y-3 text-sm">
                {contactInfo.emails.map(email => (
                   <div key={email} className="flex items-center">
                     <Mail size={16} className="mr-3 flex-shrink-0 text-gray-400" />
                     <a href={`mailto:${email}`} className="text-gray-300 hover:text-white hover:underline">{email}</a>
                   </div>
                ))}
             </div>
          </div>

          {/* Column 4: Quick Links */}
           <div className="space-y-4">
             <h4 className="text-lg font-semibold text-gray-100">Quick Links</h4>
             <div className="space-y-2 text-sm flex flex-col">
                <a href="#root" className="text-gray-300 hover:text-white hover:underline">All Projects</a>
                <a href="https://jitsriperumbudur.org/studentslogin/index.php" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white hover:underline">Student Portal</a>
                <a href="https://jitsriperumbudur.org/stafflogin/login.php?done=/stafflogin/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white hover:underline">Faculty Portal</a>
                <a href={contactInfo.collegeWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white hover:underline">College Website</a>
             </div>
          </div>

        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Jeppiaar Institute of Technology. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;