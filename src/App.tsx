import './App.css';
import CategoryCarousel from './components/carousel/carousel';
import HeroCarousel from "./components/header/header";
import Navbar from './components/navbar/navbar';
import Spacer from './components/spacer/spacer';

const App: React.FC = () => {

  return (
    <>
      <Navbar />
        <Spacer height="100px" />
        <CategoryCarousel />
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