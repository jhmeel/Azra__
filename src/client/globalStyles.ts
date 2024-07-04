import { createGlobalStyle } from 'styled-components';
import ulagaiBold from './src/assets/fonts/ulagadi-sans/UlagadiSansBold.ttf';


const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ulagadi-bold';
    src: url(${ulagaiBold});
  }

`;

export default GlobalStyles;
