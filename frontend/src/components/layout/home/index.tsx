import React from 'react';
import Header from './header';
import CardComponent from './card';
import MainContent from './mainContent';
import Purpose from './purpose';
import Footer from './footer';

const Index: React.FC = () => {
  return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Header/>
        <CardComponent/>
        <MainContent/>
        <Purpose/>
        <Footer/>
      </div>
    
  );
};

export default Index;

