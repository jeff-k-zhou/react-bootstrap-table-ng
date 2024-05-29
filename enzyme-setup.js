import Adapter from '@cfaester/enzyme-adapter-react-18';
import { configure } from 'enzyme';

const configureEnzyme = () => {
  configure({ adapter: new Adapter() });
};

configureEnzyme();
