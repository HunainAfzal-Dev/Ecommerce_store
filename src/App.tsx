import './App.css';
import HeroCarousel from "./components/header/header";
import Navbar from './components/navbar/navbar';

const App: React.FC = () => {

  return (
    <>
      <Navbar />
      <HeroCarousel />
      <HeroCarousel />
      <HeroCarousel />
      <HeroCarousel />
      <HeroCarousel />
      <HeroCarousel />
    </>
  );
};

export default App;