
import {Footer} from '../components/Footer';

import { Hero } from '@/components/Hero';
import HomepageSections from './HomePageSection';
import Features from '../components/Features';

const Home = () => {
  return (
    <div className="">
      <Hero />
      <Features/>
      <HomepageSections />
      <Footer/>
    </div>
  );
};

export default Home;

