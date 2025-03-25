import './App.css';
import CategoryCarousel from './components/carousel/carousel';
import Navbar from './components/navbar/navbar';
import { Product } from './components/product_card/product_card';
import ProductGrid from './components/product_grid/product_grid';
import { sampleProducts } from './components/sample_products/sample_products';
import Spacer from './components/spacer/spacer';
import ThemeToggle from './components/theme_toggle/theme_toggle';

const App: React.FC = () => {
  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    // Implement cart logic here
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
    // Implement quick view modal logic here
  };

  const handleAddToFavorites = (product: Product) => {
    console.log('Add to favorites:', product);
    // Implement favorites logic here
  };

  return (
    <>
      <Navbar />
      <Spacer height="100px" />
      <CategoryCarousel />
      <div className="container mx-auto px-4 py-8">
        <ProductGrid
          products={sampleProducts}
          columns={4} 
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
          onAddToFavorites={handleAddToFavorites}
        />
      </div>
      <ThemeToggle/>

    </>
  );
};

export default App;