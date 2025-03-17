import './App.css';
import { MyCarousel } from './components/header/header';
import Navbar from './components/navbar/navbar';

const App: React.FC = () => {

  return (
    <>
      <Navbar />
      <MyCarousel />
    </>
  );
};

export default App;