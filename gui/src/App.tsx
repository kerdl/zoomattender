import { MantineProvider } from '@mantine/core';
import './App.css';
import Main from './Main';


function App() {
  return (
    <MantineProvider theme={{
      colorScheme: 'dark',
      fontFamily: 'Greycliff CF, sans-serif',
      colors: {
        'ocean-blue': ['#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'],
      },
      loader: "oval"
    }}>
      <Main></Main>
    </MantineProvider>
  )
}

export default App;
