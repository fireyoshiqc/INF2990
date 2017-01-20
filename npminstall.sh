!#/bin/bash
cd Sudoku/server
echo "Installing Sudoku server modules..."
npm install
echo "Sudoku server modules installed."
cd ../client
echo "Installing Sudoku client modules..."
npm install
echo "Sudoku client modules installed."
cd ../../Scrabble/server
echo "Installing Scrabble server modules..."
npm install
echo "Scrabble server modules installed."
cd ../client
echo "Installing Scrabble client modules..."
npm install
echo "Scrabble client modules installed."
cd ../../Curling/server
echo "Installing Curling server modules..."
npm install
echo "Curling server modules installed."
cd ../client
echo "Installing Curling client modules..."
npm install
echo "Curling client modules installed."
cd ..
echo "NPM Install done!"
